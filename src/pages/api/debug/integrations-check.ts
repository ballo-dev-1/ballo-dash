// src/pages/api/debug/integrations-check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user session to verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const companyId = session.user.companyId;
    if (!companyId) {
      return res.status(400).json({ error: "Company ID not found" });
    }

    console.log("🔍 Integrations Check - Company ID:", companyId);

    // Get all integrations for this company
    const companyIntegrations = await db
      .select()
      .from(integrations)
      .where(eq(integrations.companyId, companyId));

    console.log("🔍 Integrations found:", companyIntegrations.length);

    // Get all integrations in system (for debugging)
    const allIntegrations = await db
      .select()
      .from(integrations);

    console.log("🔍 Total integrations in system:", allIntegrations.length);

    return res.status(200).json({
      companyId,
      companyIntegrations: companyIntegrations.map(int => ({
        id: int.id,
        type: int.type,
        status: int.status,
        companyId: int.companyId,
        hasAccessToken: !!int.accessToken,
        hasRefreshToken: !!int.refreshToken,
        expiresAt: int.expiresAt,
        lastSyncedAt: int.lastSyncedAt,
        createdAt: int.createdAt
      })),
      allIntegrations: allIntegrations.length,
      message: "Integrations check completed successfully"
    });

  } catch (error: any) {
    console.error("Integrations check error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
