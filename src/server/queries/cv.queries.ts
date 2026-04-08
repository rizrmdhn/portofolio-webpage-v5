import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { applicationSettings } from "@/server/db/schema";
import type { CVSettingType } from "@/types/cv.types";

const CV_SETTING_KEY = "cv";

const cvQueries = {
	async getCVSetting(): Promise<CVSettingType | null> {
		const setting = await db.query.applicationSettings.findFirst({
			where: eq(applicationSettings.key, CV_SETTING_KEY),
		});

		if (!setting) {
			return null;
		}

		return setting as CVSettingType;
	},

	async setCVSetting(value: CVSettingType["data"]): Promise<CVSettingType> {
		const existingSetting = await db.query.applicationSettings.findFirst({
			where: eq(applicationSettings.key, CV_SETTING_KEY),
		});

		if (existingSetting) {
			const [updatedSetting] = await db
				.update(applicationSettings)
				.set({ data: value })
				.where(eq(applicationSettings.id, existingSetting.id))
				.returning();

			return updatedSetting as CVSettingType;
		}

		const [newSetting] = await db
			.insert(applicationSettings)
			.values({
				key: CV_SETTING_KEY,
				data: value,
			})
			.returning();

		return newSetting as CVSettingType;
	},
};

export default cvQueries;
