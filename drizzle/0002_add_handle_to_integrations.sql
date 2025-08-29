-- Migration: Add handle column to integrations table
-- Date: 2024-01-XX

-- Add handle column to integrations table
ALTER TABLE "public"."integrations" ADD COLUMN IF NOT EXISTS "handle" text;

-- Add comment to explain the column purpose
COMMENT ON COLUMN "public"."integrations"."handle" IS 'Social media handle or profile identifier (e.g., @username, page name)';
