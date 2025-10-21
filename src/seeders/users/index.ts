import { env } from "@/env";
import { db } from "@/server/db";
import { hash } from "@node-rs/argon2";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../../server/db/schema";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const insertUsersSchema = createInsertSchema(users, {
	email: z.email(),
	name: z.string().min(1).max(256),
	password: z.string().min(8).max(256),
});

export type UsersToBeInserted = z.infer<typeof insertUsersSchema>;

const generateUsers = async (): Promise<UsersToBeInserted[]> => {
	const rows: UsersToBeInserted[] = [];

	const password = env.ALLOWED_EMAIL_PASSWORD || "test12345";

	rows.push({
		name: "Developer",
		email: env.ALLOWED_EMAIL_LOGIN,
		password: await hash(password),
	});

	return rows;
};

async function seedUsers() {
	const usersToBeInserted = await generateUsers();

	// eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(users).execute();

	await db.insert(users).values(usersToBeInserted).execute();
}

export default seedUsers;
