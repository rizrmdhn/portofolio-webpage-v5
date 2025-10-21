import { env } from "@/env";
import { createTokenCookie, deleteTokenCookie } from "@/server/auth/utils";
import sessionsQueries from "@/server/queries/sessions.queries";
import usersQueries from "@/server/queries/users.queries";
import { verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
	login: publicProcedure
		.input(
			z.object({
				email: z.email(),
				password: z.string(),
			}),
		)
		.mutation(async ({ input: { email, password } }) => {
			const user = await usersQueries.getUserByEmail(email);

			if (!user) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Invalid credentials",
				});
			}

			if (env.ALLOWED_EMAIL_LOGIN && user.email !== env.ALLOWED_EMAIL_LOGIN) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Invalid credentials",
				});
			}

			// verify password
			const verifyPasswordResult = await verify(user.password, password);

			if (!verifyPasswordResult) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Invalid credentials",
				});
			}

			const { sessions, user: users } = await sessionsQueries.createSessions(
				user.id,
			);

			void createTokenCookie(sessions.id, new Date(sessions.expiresAt));

			return {
				user: users,
				session: sessions,
			};
		}),

	logout: protectedProcedure.mutation(async ({ ctx: { session } }) => {
		await sessionsQueries.invalidateSessions(session.id);

		void deleteTokenCookie();

		return true;
	}),

	me: publicProcedure.query(async ({ ctx: { user } }) => {
		return user;
	}),
});
