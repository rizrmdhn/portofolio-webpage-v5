import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { users } from "@/server/db/schema";

const createUserSchema = createInsertSchema(users).pick({
	name: true,
	email: true,
	password: true,
});

const updateUserSchema = createInsertSchema(users).pick({
	name: true,
	email: true,
	password: true,
});

const userSchema = {
	createUserSchema,
	updateUserSchema,
};

export default userSchema;
