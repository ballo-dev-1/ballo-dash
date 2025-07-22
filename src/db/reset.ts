import "dotenv/config"; // Load environment variables from .env
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { reset } from "drizzle-seed";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL not found in environment variables");
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  await reset(db, schema);
  console.log("Database reset successful.");
  await pool.end();
}

main().catch((err) => {
  console.error("Database reset failed:", err);
  process.exit(1);
});
