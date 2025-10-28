import type techStackSchema from "@/schema/tech-stack.schema";
import { db } from "@/server/db";
import { techStack } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import type z from "zod";

const techStackQueries = {
	async getAllTechStacks() {
		const techStacks = await db.query.techStack.findMany({
			orderBy: (ts) => [desc(ts.createdAt)],
		});

		return techStacks;
	},

	async getTechStackById(id: string) {
		const techStackItem = await db.query.techStack.findFirst({
			where: eq(techStack.id, id),
		});

		if (!techStackItem) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Tech stack with id ${id} not found`,
			});
		}

		return techStackItem;
	},

	async createTechStack(
		data: z.infer<typeof techStackSchema.createTechStackSchema>,
	) {
		const list: string[] = [];

		for (const item of data.list.split(",")) {
			list.push(item.trim());
		}
		const [techStackItem] = await db
			.insert(techStack)
			.values({ ...data, list })
			.returning();

		if (!techStackItem) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create tech stack item",
			});
		}

		return techStackItem;
	},

	async updateTechStack(
		data: z.infer<typeof techStackSchema.updateTechStackSchema>,
	) {
		const isExist = await this.getTechStackById(data.id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Tech stack with id ${data.id} not found`,
			});
		}

		const list: string[] = [];

		for (const item of data.list.split(",")) {
			list.push(item.trim());
		}

		const [result] = await db
			.update(techStack)
			.set({ name: data.name, list })
			.where(eq(techStack.id, data.id))
			.returning();

		if (!result) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update tech stack item",
			});
		}

		return result;
	},

	async deleteTechStack(id: string) {
		const isExist = await this.getTechStackById(id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Tech stack with id ${id} not found`,
			});
		}

		const [result] = await db
			.delete(techStack)
			.where(eq(techStack.id, id))
			.returning();

		if (!result) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete tech stack item",
			});
		}

		return result;
	},
};

export default techStackQueries;
