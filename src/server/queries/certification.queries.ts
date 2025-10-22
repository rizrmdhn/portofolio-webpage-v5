import type certificationSchema from "@/schema/certifcation.schema";
import { db } from "@/server/db";
import { certifications } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import type z from "zod";

const certificationQueries = {
	async getAllCertifications() {
		const certificationsList = await db.query.certifications.findMany({
			orderBy: (certification) => [desc(certification.createdAt)],
		});

		return certificationsList;
	},

	async getCertificationById(id: string) {
		const certification = await db.query.certifications.findFirst({
			where: eq(certifications.id, id),
		});

		if (!certification) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Certification with id ${id} not found`,
			});
		}
		return certification;
	},

	async createCertification(
		data: z.infer<typeof certificationSchema.createCertificationSchema>,
	) {
		const [certification] = await db
			.insert(certifications)
			.values({
				...data,
				issueDate: data.issueDate.toISOString(),
				expiryDate: data.expiryDate ? data.expiryDate.toISOString() : null,
			})
			.returning();

		if (!certification) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create certification",
			});
		}
		return certification;
	},

	async updateCertification(
		data: z.infer<typeof certificationSchema.updateCertificationSchema>,
	) {
		const isExist = this.getCertificationById(data.id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Certification with id ${data.id} not found`,
			});
		}

		const [certification] = await db
			.update(certifications)
			.set({
				...data,
				issueDate: data.issueDate.toISOString(),
				expiryDate: data.expiryDate ? data.expiryDate.toISOString() : null,
			})
			.where(eq(certifications.id, data.id))
			.returning();

		if (!certification) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update certification",
			});
		}

		return certification;
	},

	async deleteCertification(id: string) {
		const isExist = this.getCertificationById(id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Certification with id ${id} not found`,
			});
		}

		const [certification] = await db
			.delete(certifications)
			.where(eq(certifications.id, id))
			.returning();

		if (!certification) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete certification",
			});
		}

		return certification;
	},
};

export default certificationQueries;
