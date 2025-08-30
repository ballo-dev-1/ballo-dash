// src/pages/api/data/x/cached-stats.ts
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
      console.log("❌ X Cached API: No session or user email found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, platform } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.toString().replace('@', '').trim();
    if (cleanUsername.length === 0) {
      return res.status(400).json({ error: "Invalid username format" });
    }



    console.log("📦 X Cached Stats API - Looking for cached data:", {
      companyId: session.user.companyId,
      platform: 'X',
      username: cleanUsername
    });

    // Get cached data
    const cachedData = await socialMediaCacheService.getData(
      session.user.companyId,
      'X',
      cleanUsername
    );

    if (!cachedData) {
      console.log("📦 X Cached Stats API - No cached data found for:", cleanUsername);
      return res.status(404).json({ 
        error: "No cached data found",
        details: "No cached data available for this username",
        suggestion: "Data will be cached after the first successful API call"
      });
    }

    console.log("📦 X Cached Stats API - Found cached data:", {
      username: cleanUsername,
      fetchStatus: cachedData.fetchStatus,
      lastFetched: cachedData.lastFetchedAt
    });

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
