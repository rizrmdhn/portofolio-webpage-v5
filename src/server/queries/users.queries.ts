import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { type DBType, db } from "../db";
import { users } from "../db/schema";

const usersQueries = {
	async getUserById(id: string) {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});

		return user;
	},

	async getUserByEmail(email: string) {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		return user;
	},

	async deleteUser(id: string, transaction: DBType) {
		const user = await this.getUserById(id);

		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "User not found",
			});
		}

		await transaction.delete(users).where(eq(users.id, id));

		return user;
	},
};

export default usersQueries;
