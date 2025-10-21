CREATE TABLE "portofolio-webpage-v5_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portofolio-webpage-v5_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "portofolio-webpage-v5_sessions" ADD CONSTRAINT "portofolio-webpage-v5_sessions_userId_portofolio-webpage-v5_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."portofolio-webpage-v5_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_id_idx" ON "portofolio-webpage-v5_sessions" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "portofolio-webpage-v5_sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "users_id_idx" ON "portofolio-webpage-v5_users" USING btree ("id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "portofolio-webpage-v5_users" USING btree ("email");