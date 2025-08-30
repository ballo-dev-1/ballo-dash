// src/pages/api/data/linkedin/cached-stats.ts
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

    const { organizationId, platform } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    // Get cached data
    const cachedData = await socialMediaCacheService.getData(
      session.user.companyId,
      'LINKEDIN',
      organizationId.toString()
    );

    if (!cachedData) {
      return res.status(404).json({ 
        error: "No cached data found",
        details: "No cached data available for this organization"
      });
    }

    if (cachedData.fetchStatus === 'ERROR') {
      return res.status(200).json({
        ...cachedData.data,
        _cached: true,
        _fetchStatus: 'ERROR',
        _lastFetchedAt: cachedData.lastFetchedAt,
        _message: "Showing cached data due to previous fetch error"
      });
    }

    // Return cached data with metadata
    return res.status(200).json({
      ...cachedData.data,
      _cached: true,
      _fetchStatus: cachedData.fetchStatus,
      _lastFetchedAt: cachedData.lastFetchedAt,
      _message: "Showing cached data while fresh data is being fetched"
    });

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
