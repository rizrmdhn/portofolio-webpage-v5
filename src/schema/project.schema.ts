import { projects } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const createProjectSchema = createInsertSchema(projects, {
	tech: z.string(),
}).pick({
	name: true,
	description: true,
	github_url: true,
	live_url: true,
	playstore_url: true,
	appstore_url: true,
	tech: true,
});

const updateProjectSchema = createInsertSchema(projects, {
	tech: z.string(),
})
	.required({
		id: true,
	})
	.pick({
		id: true,
		name: true,
		description: true,
		github_url: true,
		live_url: true,
		playstore_url: true,
		appstore_url: true,
		tech: true,
	});

const projectSchema = {
	createProjectSchema,
	updateProjectSchema,
};

export default projectSchema;
