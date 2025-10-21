import type experienceSchema from "@/schema/experience.schema";
import { db } from "@/server/db";
import { experiences } from "@/server/db/schema";
import projectViewsQueries from "@/server/queries/project-views.queries";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import type z from "zod";

const experienceQueries = {
	async getAllExperiences() {
		const experiences = await db.query.experiences.findMany({
			orderBy: (experience) => [desc(experience.startDate)],
		});
		return experiences;
	},

	async getExperienceById(id: string) {
		const experience = await db.query.experiences.findFirst({
			where: eq(experiences.id, id),
		});

		if (!experience) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Experience with id ${id} not found`,
			});
		}

		return experience;
	},

	async createExperience(
		data: z.infer<typeof experienceSchema.createExperienceSchema>,
	) {
		const [experience] = await db.insert(experiences).values(data).returning();
		if (!experience) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create experience",
			});
		}

		return experience;
	},

	async updateExperience(
		data: z.infer<typeof experienceSchema.updateExperienceSchema>,
	) {
		const isExist = this.getExperienceById(data.id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Experience with id ${data.id} not found`,
			});
		}

		const [experience] = await db
			.update(experiences)
			.set(data)
			.where(eq(experiences.id, data.id))
			.returning();

		if (!experience) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update experience",
			});
		}

		return experience;
	},

	async deleteExperience(id: string) {
		const isExist = this.getExperienceById(id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Experience with id ${id} not found`,
			});
		}

		const [experience] = await db
			.delete(experiences)
			.where(eq(experiences.id, id))
			.returning();

		if (!experience) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete experience",
			});
		}

		return experience;
	},
};

export default experienceQueries;
