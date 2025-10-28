import type { techStack } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type TechStack = InferSelectModel<typeof techStack>;
