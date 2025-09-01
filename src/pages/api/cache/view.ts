// src/pages/api/cache/view.ts
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

    const { platform, profileId } = req.query;
    const companyId = session.user.companyId;

    if (platform && profileId) {
      // Get specific cached data
      const cachedData = await socialMediaCacheService.getData(
        companyId,
        platform.toString(),
        profileId.toString()
      );

      if (!cachedData) {
        return res.status(404).json({ 
          error: "No cached data found",
          details: `No cached data for ${platform} profile ${profileId}`
        });
      }

      return res.status(200).json({
        success: true,
        data: cachedData,
        message: "Specific cached data retrieved"
      });
    } else if (platform) {
      // Get all cached data for a specific platform
      const cachedData = await socialMediaCacheService.getCompanyPlatformData(
        companyId,
        platform.toString()
      );

      return res.status(200).json({
        success: true,
        data: cachedData,
        message: `All cached ${platform} data retrieved`,
        count: cachedData.length
      });
    } else {
      // Get all cached data for the company
      const cacheStats = await socialMediaCacheService.getCacheStats(companyId);
      
      // Get sample data from each platform
      const allPlatforms = ['LINKEDIN', 'X', 'FACEBOOK', 'INSTAGRAM'];
      const sampleData: any = {};
      
      for (const platform of allPlatforms) {
        const platformData = await socialMediaCacheService.getCompanyPlatformData(companyId, platform);
        if (platformData.length > 0) {
          sampleData[platform] = platformData.slice(0, 2); // Show first 2 entries per platform
        }
      }

      return res.status(200).json({
        success: true,
        stats: cacheStats,
        sampleData,
        message: "Cache overview and sample data retrieved"
      });
    }

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
