// src/pages/api/integrations/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { companyId, platform } = req.query;

  if (!companyId || typeof companyId !== "string") {
    return res.status(400).json({ error: "Missing or invalid companyId" });
  }

  try {
    const whereClause =
      platform && typeof platform === "string"
        ? and(
            eq(integrations.companyId, companyId),
            eq(integrations.type, platform)
          )
        : eq(integrations.companyId, companyId);

    const integrationData = await db
      .select()
      .from(integrations)
      .where(whereClause);

    return res.status(200).json(integrationData);
  } catch (error) {
    console.error("[GET_INTEGRATIONS]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
