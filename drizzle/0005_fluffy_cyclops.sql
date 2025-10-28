CREATE TABLE "portofolio-webpage-v5_application_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"key" varchar(256) NOT NULL,
	"data" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "portofolio-webpage-v5_application_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE INDEX "application_settings_id_idx" ON "portofolio-webpage-v5_application_settings" USING btree ("id");--> statement-breakpoint
CREATE INDEX "application_settings_key_idx" ON "portofolio-webpage-v5_application_settings" USING btree ("key");