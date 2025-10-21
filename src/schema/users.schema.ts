import { users } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
