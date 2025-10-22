import type projectSchema from "@/schema/project.schema";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import projectViewsQueries from "@/server/queries/project-views.queries";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import type z from "zod";
import utapi from "../uploadthing";

const projectQueries = {
	async getAllProjects() {
		const projects = await db.query.projects.findMany({
			orderBy: (project) => [desc(project.createdAt)],
			with: { projectView: true },
		});

		return projects;
	},

	async getProjectById(id: string) {
		const project = await db.query.projects.findFirst({
			where: eq(projects.id, id),
			with: { projectView: true },
		});

		if (!project) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Project with id ${id} not found`,
			});
		}

		return project;
	},

	async createProject(data: z.infer<typeof projectSchema.createProjectSchema>) {
		const tech: string[] = [];

		// data.tech.split(",").forEach((t) => {
		// 	tech.push(t.trim());
		// });

		for (const t of data.tech.split(",")) {
			tech.push(t.trim());
		}

		const [project] = await db
			.insert(projects)
			.values({ ...data, tech })
			.returning();

		if (!project) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to create project",
			});
		}

		await projectViewsQueries.createProjectView(project.id);

		return project;
	},

	async updateProject(data: z.infer<typeof projectSchema.updateProjectSchema>) {
		const isExist = this.getProjectById(data.id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Project with id ${data.id} not found`,
			});
		}

		const tech: string[] = [];

		for (const t of data.tech.split(",")) {
			tech.push(t.trim());
		}

		const [result] = await db
			.update(projects)
			.set({ ...data, tech })
			.where(eq(projects.id, data.id))
			.returning();

		if (!result) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update project",
			});
		}

		return result;
	},

	async insertImageToProject(id: string, image_url: string | null) {
		const isExist = this.getProjectById(id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Project with id ${id} not found`,
			});
		}

		const [result] = await db
			.update(projects)
			.set({ image_url })
			.where(eq(projects.id, id))
			.returning();

		if (!result) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to insert image to project",
			});
		}

		return result;
	},

	async deleteProject(id: string) {
		const isExist = this.getProjectById(id);

		if (!isExist) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `Project with id ${id} not found`,
			});
		}

		const [result] = await db
			.delete(projects)
			.where(eq(projects.id, id))
			.returning();

		if (!result) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete project",
			});
		}

		if (result.image_url) {
			const imageFiles = result.image_url.split("/").pop();

			if (!imageFiles)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to parse image file name",
				});

			await utapi.deleteFiles(imageFiles);
		}

		return result;
	},
};

export default projectQueries;
