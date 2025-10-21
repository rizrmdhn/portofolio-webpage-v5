import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { projectViews } from "../db/schema";

const projectViewsQueries = {
	async incrementViews(projectId: string): Promise<void> {
		await db
			.update(projectViews)
			.set({
				count: sql`${projectViews.count} + 1`,
			})
			.where(eq(projectViews.projectId, projectId));
	},

	async getViews(projectId: string): Promise<number> {
		const views = await db.query.projectViews.findFirst({
			where: eq(projectViews.id, projectId),
		});

		return views?.count || 0;
	},

	async createProjectView(projectId: string): Promise<void> {
		const [projectView] = await db
			.insert(projectViews)
			.values({
				projectId,
				count: 0,
			})
			.returning()
			.execute();

		if (!projectView) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create project view",
			});
		}
	},
};

export default projectViewsQueries;
