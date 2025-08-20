import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { users, companies } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("=== Company API called ===");
  
  const session = await getServerSession(req, res, authOptions);
  console.log("Session user email:", session?.user?.email);

  if (!session?.user?.email) {
    console.log("No session or user email");
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("User email:", session.user.email);

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email));

    console.log("User found:", user ? "Yes" : "No");

    if (!user) return res.status(404).json({ error: "User not found" });

    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, user.companyId));

    console.log("Company found:", company ? "Yes" : "No");
    console.log("Company data:", company);

    return res.status(200).json({ company });
  } catch (error) {
    console.error("❌ Company API Error:", error);
    return res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" });
  }
}
