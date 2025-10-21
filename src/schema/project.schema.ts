import { projects } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";

const createProjectSchema = createInsertSchema(projects).pick({
	name: true,
	description: true,
	github_url: true,
	live_url: true,
	tech: true,
});

const updateProjectSchema = createInsertSchema(projects)
	.required({
		id: true,
	})
	.pick({
		id: true,
		name: true,
		description: true,
		github_url: true,
		live_url: true,
		tech: true,
	});

const projectSchema = {
	createProjectSchema,
	updateProjectSchema,
};

export default projectSchema;
