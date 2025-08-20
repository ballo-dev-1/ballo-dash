-- Migration: Add DISCONNECTED and PENDING to integration_status enum
-- Date: 2024-01-XX

-- Add new enum values to the existing integration_status enum
ALTER TYPE "public"."integration_status" ADD VALUE IF NOT EXISTS 'DISCONNECTED';
ALTER TYPE "public"."integration_status" ADD VALUE IF NOT EXISTS 'PENDING';
