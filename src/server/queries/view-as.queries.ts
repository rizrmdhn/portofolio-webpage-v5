import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { type DBType, db } from "../db";
import { applicationSettings } from "../db/schema";
import type { ViewAsType } from "@/types/view-as.types";

const viewAsQueries = {
	async getViewAsSetting(): Promise<ViewAsType> {
		const setting = await db.query.applicationSettings.findFirst({
			where: eq(applicationSettings.key, "viewAs"),
		});

		if (!setting) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "View As setting not found",
			});
		}

		return setting as ViewAsType;
	},

	async setViewAsSetting(value: ViewAsType["data"]): Promise<ViewAsType> {
		const existingSetting = await db.query.applicationSettings.findFirst({
			where: eq(applicationSettings.key, "viewAs"),
		});

		if (existingSetting) {
			const [updatedSetting] = await db
				.update(applicationSettings)
				.set({ data: value })
				.where(eq(applicationSettings.id, existingSetting.id))
				.returning();

			return updatedSetting as ViewAsType;
		}

		const [newSetting] = await db
			.insert(applicationSettings)
			.values({
				key: "viewAs",
				data: value,
			})
			.returning();

		return newSetting as ViewAsType;
	},
};

export default viewAsQueries;
