CREATE TABLE "portofolio-webpage-v5_tech_stack" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"list" text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "tech_stack_id_idx" ON "portofolio-webpage-v5_tech_stack" USING btree ("id");