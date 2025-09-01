// src/pages/api/debug/db-check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { socialMediaDataCache, integrations } from "@/db/schema";
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

    console.log("🔍 DB Debug - Company ID:", companyId);

    // Check cache table
    const cacheEntries = await db
      .select()
      .from(socialMediaDataCache)
      .where(eq(socialMediaDataCache.companyId, companyId));

    console.log("🔍 DB Debug - Cache entries found:", cacheEntries.length);

    // Check integrations table
    const companyIntegrations = await db
      .select()
      .from(integrations)
      .where(eq(integrations.companyId, companyId));

    console.log("🔍 DB Debug - Integrations found:", companyIntegrations.length);

    // Check all cache entries (for debugging)
    const allCacheEntries = await db
      .select()
      .from(socialMediaDataCache);

    console.log("🔍 DB Debug - Total cache entries in system:", allCacheEntries.length);

    return res.status(200).json({
      companyId,
      cacheEntries: cacheEntries.length,
      integrations: companyIntegrations.length,
      totalSystemCache: allCacheEntries.length,
      cacheDetails: cacheEntries.map(entry => ({
        id: entry.id,
        platform: entry.platform,
        profileId: entry.profileId,
        fetchStatus: entry.fetchStatus,
        lastFetchedAt: entry.lastFetchedAt,
        expiresAt: entry.expiresAt
      })),
      integrationDetails: companyIntegrations.map(int => ({
        id: int.id,
        type: int.type,
        status: int.status
      })),
      message: "Database check completed successfully"
    });

  } catch (error: any) {
    console.error("DB Debug error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
