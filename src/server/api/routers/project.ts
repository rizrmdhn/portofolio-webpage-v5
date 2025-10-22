import projectSchema from "@/schema/project.schema";
import projectViewsQueries from "@/server/queries/project-views.queries";
import projectQueries from "@/server/queries/project.queries";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import utapi from "@/server/uploadthing";

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

	deleteImage: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			const project = await projectQueries.getProjectById(id);

			if (!project)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});

			if (!project.image_url)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Project does not have an image",
				});

			const imageFiles = project.image_url.split("/").pop();

			if (!imageFiles)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to parse image file name",
				});

			await utapi.deleteFiles(imageFiles);

			await projectQueries.insertImageToProject(id, null);

			return true;
		}),
});
