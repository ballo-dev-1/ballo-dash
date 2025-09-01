// src/pages/api/data/instagram/cached-stats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const companyId = session.user.companyId;
    const platform = Array.isArray(req.query.platform) ? req.query.platform[0] : req.query.platform || "instagram";

    // For Instagram, we use a fixed identifier since data is fetched by account ID
    const identifier = "instagram_account";

    const cachedData = await socialMediaCacheService.getData(companyId, platform, identifier);

    if (!cachedData) {
      return res.status(404).json({ 
        error: "No cached Instagram data found",
        suggestion: "Try fetching fresh data first from /api/data/instagram/stats"
      });
    }

    // Add cache metadata
    const response = {
      ...cachedData.data,
      _cached: true,
      _fetchStatus: cachedData.fetchStatus,
      _lastFetchedAt: cachedData.lastFetchedAt,
      _message: "Data served from cache"
    };

    return res.json(response);

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Failed to retrieve cached Instagram data",
      details: error.message 
    });
  }
}
