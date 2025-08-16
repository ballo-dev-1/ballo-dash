-- Migration: Add DISCONNECTED and PENDING to integration_status enum
-- Date: 2024-01-XX

-- First, create a new enum with the additional values
CREATE TYPE integration_status_new AS ENUM (
  'CONNECTED',
  'DISCONNECTED', 
  'PENDING',
  'EXPIRED',
  'ERROR'
);

-- Update existing columns to use the new enum
ALTER TABLE integrations 
  ALTER COLUMN status TYPE integration_status_new 
  USING status::text::integration_status_new;

-- Drop the old enum
DROP TYPE integration_status;

-- Rename the new enum to the original name
ALTER TYPE integration_status_new RENAME TO integration_status;

-- Verify the change
SELECT unnest(enum_range(NULL::integration_status));
