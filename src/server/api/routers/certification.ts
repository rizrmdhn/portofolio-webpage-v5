import certificationSchema from "@/schema/certifcation.schema";
import certificationQueries from "@/server/queries/certification.queries";
import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const certificationRouter = createTRPCRouter({
	getAll: publicProcedure.query(async () => {
		return await certificationQueries.getAllCertifications();
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input: { id } }) => {
			return await certificationQueries.getCertificationById(id);
		}),

	create: protectedProcedure
		.input(certificationSchema.createCertificationSchema)
		.mutation(async ({ input }) => {
			return await certificationQueries.createCertification(input);
		}),

	update: protectedProcedure
		.input(certificationSchema.updateCertificationSchema)
		.mutation(async ({ input }) => {
			return await certificationQueries.updateCertification(input);
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			return await certificationQueries.deleteCertification(id);
		}),
});
