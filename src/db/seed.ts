import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found in .env.development");
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);
  const companyId = uuidv4();
  const hashedPassword = await bcrypt.hash("ballo2025", 10);

  await db.insert(schema.companies).values({
    id: companyId,
    name: "Ballo Innovations",
    domain: "balloinnovations.com",
    logoUrl:
      "https://lh3.google.com/u/0/d/1_Wyt6aPf_q04Yq16BLMslLkrC7WvvxNJ=w1920-h922-iv1?auditContext=prefetch",
    websiteUrl: "https://balloinnovations.com",
    timezone: "Africa/Lusaka",
    locale: "en-ZM",
    plan: "ENTERPRISE",
    isActive: true,
    isDeleted: false,
    createdBy: "system",
    updatedBy: "system",
  });

  const users = [
    {
      email: "lombe.lusale@balloinnovations.com",
      firstName: "Lombe",
      lastName: "Lusale",
      role: "ADMIN",
    },
    {
      email: "support@balloinnovations.com",
      firstName: "Mwali",
      lastName: "Chisanga",
      role: "ADMIN",
    },
    {
      email: "jonah.h@balloinnovations.com",
      firstName: "Jonah",
      lastName: "Hachunde",
      role: "ADMIN",
    },
    {
      email: "jon@balloinnovations.com",
      firstName: "Jonathan",
      lastName: "Gowera",
      role: "ADMIN",
    },
    {
      email: "george.m@balloinnovations.com",
      firstName: "George",
      lastName: "M'sapenda",
      role: "ADMIN",
    },
    {
      email: "shannon.z@balloinnovations.com",
      firstName: "Shannon",
      lastName: "Zebron",
      role: "ADMIN",
    },
  ];

  await db.insert(schema.users).values(
    users.map((user) => ({
      id: uuidv4(),
      companyId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: hashedPassword,
      role: user.role,
      isActive: true,
      createdBy: "system",
      updatedBy: "system",
    }))
  );

  const platforms = [
    "FACEBOOK",
    "INSTAGRAM",
    "LINKEDIN",
    "GOOGLE_ANALYTICS",
    "GOOGLE_SEARCH_CONSOLE",
    "TIKTOK",
  ];

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days from now

  await db.insert(schema.socialProfiles).values(
    platforms.map((platform) => ({
      id: uuidv4(),
      companyId,
      platform,
      profileId: uuidv4(),
      handle: "Ballo Innovations",
      connectedAt: now,
    }))
  );

  await db.insert(schema.integrations).values(
    platforms.map((platform) => ({
      id: uuidv4(),
      companyId,
      type: platform,
      status: "CONNECTED",
      accessToken: uuidv4(),
      refreshToken: uuidv4(),
      expiresAt,
      lastSyncedAt: now,
      metadata: { source: "seed", version: 1 },
      createdBy: "system",
      updatedBy: "system",
    }))
  );

  console.log("✅ Seeding completed successfully.");
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
