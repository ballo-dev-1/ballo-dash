// src/pages/api/debug/cache-view.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";

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

    console.log("🔍 Cache Debug - Company ID:", companyId);
    
    // Get cache stats
    const cacheStats = await socialMediaCacheService.getCacheStats(companyId);
    console.log("🔍 Cache Debug - Stats:", cacheStats);
    
    // Get all cached data for this company
    const allCachedData = await socialMediaCacheService.getCompanyPlatformData(companyId, 'X');
    console.log("🔍 Cache Debug - X Cache:", allCachedData.length, "entries");
    
    const linkedInCachedData = await socialMediaCacheService.getCompanyPlatformData(companyId, 'LINKEDIN');
    console.log("🔍 Cache Debug - LinkedIn Cache:", linkedInCachedData.length, "entries");
    
    const metaCachedData = await socialMediaCacheService.getCompanyPlatformData(companyId, 'META');
    console.log("🔍 Cache Debug - Meta Cache:", metaCachedData.length, "entries");

    return res.status(200).json({
      companyId,
      cacheStats,
      xCache: allCachedData,
      linkedInCache: linkedInCachedData,
      metaCache: metaCachedData,
      message: "Cache debug information retrieved successfully"
    });

  } catch (error: any) {
    console.error("Cache debug error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
