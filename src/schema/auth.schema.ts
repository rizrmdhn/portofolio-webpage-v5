import { z } from "zod";

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const authSchema = {
	loginSchema,
};

export default authSchema;
