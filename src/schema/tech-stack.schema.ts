import { techStack } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const createTechStackSchema = createInsertSchema(techStack, {
	list: z.string(),
}).pick({
	name: true,
	list: true,
});

const updateTechStackSchema = createInsertSchema(techStack, {
	list: z.string(),
})
	.required({
		id: true,
	})
	.pick({
		id: true,
		name: true,
		list: true,
	});

const techStackSchema = {
	createTechStackSchema,
	updateTechStackSchema,
};

export default techStackSchema;
