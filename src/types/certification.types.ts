import type { certifications } from "@/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Certification = InferSelectModel<typeof certifications>;
