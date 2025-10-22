import { certifications } from "@/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const createCertificationSchema = createInsertSchema(certifications, {
	name: z.string().min(2).max(256),
	issuer: z.string().min(2).max(256),
	certificate_url: z.url().optional(),
	certificate_id: z.string().min(2).max(256).optional(),
	issueDate: z.date(),
	expiryDate: z.date().optional(),
}).pick({
	name: true,
	issuer: true,
	certificate_url: true,
	certificate_id: true,
	expiryDate: true,
	issueDate: true,
});

const updateCertificationSchema = createCertificationSchema.extend({
	id: z.string(),
});

const certificationSchema = {
	createCertificationSchema,
	updateCertificationSchema,
};

export default certificationSchema;
