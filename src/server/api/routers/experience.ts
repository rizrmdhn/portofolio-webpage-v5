import experienceSchema from "@/schema/experience.schema";
import experienceQueries from "@/server/queries/experience.queries";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const experienceRouter = createTRPCRouter({
	getAll: publicProcedure.query(async () => {
		return await experienceQueries.getAllExperiences();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input: { id } }) => {
			return await experienceQueries.getExperienceById(id);
		}),

	create: protectedProcedure
		.input(experienceSchema.createExperienceSchema)
		.mutation(async ({ input }) => {
			return await experienceQueries.createExperience(input);
		}),

	update: protectedProcedure
		.input(experienceSchema.updateExperienceSchema)
		.mutation(async ({ input }) => {
			return await experienceQueries.updateExperience(input);
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			return await experienceQueries.deleteExperience(id);
		}),
});
