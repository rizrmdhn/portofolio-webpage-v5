import techStackSchema from "@/schema/tech-stack.schema";
import techStackQueries from "@/server/queries/tech-stack.queries";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const techStackRouter = createTRPCRouter({
	getAll: publicProcedure.query(async () => {
		return await techStackQueries.getAllTechStacks();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input: { id } }) => {
			return await techStackQueries.getTechStackById(id);
		}),

	create: protectedProcedure
		.input(techStackSchema.createTechStackSchema)
		.mutation(async ({ input }) => {
			return await techStackQueries.createTechStack(input);
		}),

	update: protectedProcedure
		.input(techStackSchema.updateTechStackSchema)
		.mutation(async ({ input }) => {
			return await techStackQueries.updateTechStack(input);
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			return await techStackQueries.deleteTechStack(id);
		}),
});
