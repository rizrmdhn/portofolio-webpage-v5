import type { SessionValidationResult, Sessions } from "@/types/sessions.types";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { db } from "../db";
import { sessions, users } from "../db/schema";

const sessionsQueries = {
	async createSessions(userId: string) {
		const SessionsData: Sessions = {
			id: uuidv7(),
			userId,
			createdAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
		};

		await db.insert(sessions).values(SessionsData).execute();

		// get Sessions data with user data and role data
		const [result] = await db
			.select({ user: users, sessions })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, SessionsData.id));

		if (!result) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Gagal membuat sesi",
			});
		}

		return result;
	},

	async validateSessionsToken(token: string): Promise<SessionValidationResult> {
		// get Sessions data with user data and role data
		const result = await db
			.select({ user: users, sessions })
			.from(sessions)
			.innerJoin(users, eq(sessions.userId, users.id))
			.where(eq(sessions.id, token));

		if (result.length < 1) {
			return { session: null, user: null };
		}

		const firstResult = result[0];
		if (!firstResult) {
			return { session: null, user: null };
		}

		const { sessions: SessionsData, user: userData } = firstResult;

		if (Date.now() >= new Date(SessionsData.expiresAt).getTime()) {
			await db.delete(sessions).where(eq(sessions.id, SessionsData.id));
			return { session: null, user: null };
		}

		if (
			Date.now() >=
			new Date(SessionsData.expiresAt).getTime() - 1000 * 60 * 60 * 24 * 15
		) {
			SessionsData.expiresAt = new Date(
				Date.now() + 1000 * 60 * 60 * 24 * 30,
			).toISOString();
			await db
				.update(sessions)
				.set({
					expiresAt: SessionsData.expiresAt,
				})
				.where(eq(sessions.id, SessionsData.id));
		}

		const userWithRole = { ...userData };

		return {
			session: SessionsData,
			user: userWithRole,
		};
	},

	async invalidateSessions(SessionsId: string): Promise<void> {
		await db.delete(sessions).where(eq(sessions.id, SessionsId));
	},
};

export default sessionsQueries;
