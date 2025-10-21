CREATE TYPE "public"."experience_type" AS ENUM('internship', 'full-time', 'freelance');--> statement-breakpoint
CREATE TABLE "portofolio-webpage-v5_certifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"issuer" varchar(256) NOT NULL,
	"certificate_url" text NOT NULL,
	"issueDate" date NOT NULL,
	"expiryDate" date,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "portofolio-webpage-v5_experiences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"company" varchar(256) NOT NULL,
	"type" "experience_type" NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date,
	"currentlyWorking" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "portofolio-webpage-v5_project_views" (
	"id" uuid PRIMARY KEY NOT NULL,
	"projectId" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portofolio-webpage-v5_projects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"tech" text[] NOT NULL,
	"github_url" text,
	"live_url" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "portofolio-webpage-v5_project_views" ADD CONSTRAINT "portofolio-webpage-v5_project_views_projectId_portofolio-webpage-v5_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."portofolio-webpage-v5_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "certifications_id_idx" ON "portofolio-webpage-v5_certifications" USING btree ("id");--> statement-breakpoint
CREATE INDEX "experiences_id_idx" ON "portofolio-webpage-v5_experiences" USING btree ("id");--> statement-breakpoint
CREATE INDEX "project_views_id_idx" ON "portofolio-webpage-v5_project_views" USING btree ("id");--> statement-breakpoint
CREATE INDEX "projects_id_idx" ON "portofolio-webpage-v5_projects" USING btree ("id");