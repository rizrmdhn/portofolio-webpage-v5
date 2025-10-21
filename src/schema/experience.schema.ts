import { experiences } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const createExperienceSchema = createInsertSchema(experiences).pick({
	title: true,
	company: true,
	type: true,
	description: true,
	startDate: true,
	endDate: true,
	currentlyWorking: true,
});

const updateExperienceSchema = createExperienceSchema.extend({
	id: z.string(),
});

const experienceSchema = {
	createExperienceSchema,
	updateExperienceSchema,
};

export default experienceSchema;
