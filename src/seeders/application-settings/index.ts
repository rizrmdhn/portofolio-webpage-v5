import { env } from "@/env";
import { db } from "@/server/db";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { applicationSettings } from "../../server/db/schema";
import { ViewAsViewType } from "@/types/view-as.types";

const insertApplicationSettingsSchema = createInsertSchema(applicationSettings);

export type ApplicationSettingsToBeInserted = z.infer<
	typeof insertApplicationSettingsSchema
>;

const generateApplicationSettings = async (): Promise<
	ApplicationSettingsToBeInserted[]
> => {
	const rows: ApplicationSettingsToBeInserted[] = [];

	rows.push({
		key: "viewAs",
		data: { value: ViewAsViewType.GUEST },
	});

	return rows;
};

async function seedApplicationSettings() {
	const applicationSettingsToBeInserted = await generateApplicationSettings();
	// eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(applicationSettings).execute();
	await db
		.insert(applicationSettings)
		.values(applicationSettingsToBeInserted)
		.execute();
}

export default seedApplicationSettings;
