import { users } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

const createUserSchema = createInsertSchema(users).pick({
	name: true,
	email: true,
	password: true,
});

const updateUserSchema = createInsertSchema(users).pick({
	id: true,
	name: true,
	email: true,
	password: true,
});

const userSchema = {
	createUserSchema,
	updateUserSchema,
};

export default userSchema;
