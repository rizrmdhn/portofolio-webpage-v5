import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import projectQueries from "@/server/queries/project.queries";
import projectSchema from "@/schema/project.schema";
import projectViewsQueries from "@/server/queries/project-views.queries";

export const projectRouter = createTRPCRouter({
	getAll: publicProcedure.query(async () => {
		return await projectQueries.getAllProjects();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input: { id } }) => {
			return await projectQueries.getProjectById(id);
		}),

	create: protectedProcedure
		.input(projectSchema.createProjectSchema)
		.mutation(async ({ input }) => {
			return await projectQueries.createProject(input);
		}),

	updateView: publicProcedure
		.input(z.object({ projectId: z.string() }))
		.mutation(async ({ input: { projectId } }) => {
			return await projectViewsQueries.incrementViews(projectId);
		}),

	update: protectedProcedure
		.input(projectSchema.updateProjectSchema)
		.mutation(async ({ input }) => {
			return await projectQueries.updateProject(input);
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			return await projectQueries.deleteProject(id);
		}),
});
