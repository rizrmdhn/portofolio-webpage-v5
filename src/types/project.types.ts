import type { projects } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Project = InferSelectModel<typeof projects>;
