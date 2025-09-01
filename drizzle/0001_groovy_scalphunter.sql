ALTER TYPE "public"."integration_status" ADD VALUE 'DISCONNECTED' BEFORE 'EXPIRED';--> statement-breakpoint
ALTER TYPE "public"."integration_status" ADD VALUE 'PENDING' BEFORE 'EXPIRED';--> statement-breakpoint
CREATE TABLE "social_media_data_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"platform" "integration_type" NOT NULL,
	"profile_id" text NOT NULL,
	"data" jsonb NOT NULL,
	"last_fetched_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"fetch_status" text DEFAULT 'SUCCESS' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_cache_company_platform_profile" UNIQUE("company_id","platform","profile_id")
);
--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "handle" text;--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "app_id" text;--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "app_secret" text;--> statement-breakpoint
ALTER TABLE "social_media_data_cache" ADD CONSTRAINT "social_media_data_cache_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cache_company_platform_idx" ON "social_media_data_cache" USING btree ("company_id","platform");--> statement-breakpoint
CREATE INDEX "cache_expires_at_idx" ON "social_media_data_cache" USING btree ("expires_at");