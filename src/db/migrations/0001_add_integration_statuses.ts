import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Add new enum values to the existing integration_status enum
  await db.execute(sql`
    ALTER TYPE integration_status ADD VALUE IF NOT EXISTS 'DISCONNECTED';
    ALTER TYPE integration_status ADD VALUE IF NOT EXISTS 'PENDING';
  `);
}

export async function down(db: any) {
  // Note: PostgreSQL doesn't support removing enum values easily
  // This is a limitation - you'd need to recreate the enum to remove values
  console.log('Warning: Cannot easily remove enum values in PostgreSQL');
}
