CREATE TYPE "public"."integration_status" AS ENUM('CONNECTED', 'EXPIRED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."integration_type" AS ENUM('FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'X', 'GOOGLE_ANALYTICS', 'GOOGLE_SEARCH_CONSOLE', 'TIKTOK', 'YOUTUBE', 'WEBSITE');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('FREE', 'PRO', 'ENTERPRISE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'MANAGER', 'ANALYST', 'CLIENT');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"domain" text,
	"logo_url" text,
	"website_url" text,
	"timezone" text,
	"locale" text,
	"plan" "plan" DEFAULT 'FREE' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "companies_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "integration_type" NOT NULL,
	"status" "integration_status" DEFAULT 'CONNECTED' NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp,
	"last_synced_at" timestamp,
	"metadata" jsonb,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "unique_integration_per_company" UNIQUE("company_id","type")
);
--> statement-breakpoint
CREATE TABLE "marketing_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"timeframe" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"tasks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "unique_company_plan_period" UNIQUE("company_id","timeframe","period_start")
);
--> statement-breakpoint
CREATE TABLE "social_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"platform" "integration_type" NOT NULL,
	"profile_id" text NOT NULL,
	"handle" text,
	"connected_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_company_platform_profile" UNIQUE("company_id","platform")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'CLIENT' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "unique_email_per_company" UNIQUE("company_id","email")
);
--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_plans" ADD CONSTRAINT "marketing_plans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_profiles" ADD CONSTRAINT "social_profiles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companies_domain_idx" ON "companies" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "integrations_company_type_idx" ON "integrations" USING btree ("company_id","type");--> statement-breakpoint
CREATE INDEX "marketing_plans_company_timeframe_idx" ON "marketing_plans" USING btree ("company_id","timeframe");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");