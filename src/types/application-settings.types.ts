import type { applicationSettings } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type ApplicationSettings = InferSelectModel<typeof applicationSettings>;
