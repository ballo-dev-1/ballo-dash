import { NextApiRequest, NextApiResponse } from "next";
import { tokenCache } from "@/lib/tokenCache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cacheStats = tokenCache.getCacheStats();
    
    res.status(200).json({
      message: "Token Cache Statistics",
      timestamp: new Date().toISOString(),
      stats: cacheStats,
      cacheInfo: {
        description: "In-memory token cache for API access tokens",
        duration: "5 minutes",
        types: ["LINKEDIN", "FACEBOOK", "INSTAGRAM"],
        benefits: [
          "Reduces database queries",
          "Improves API response time", 
          "Automatic expiration",
          "Memory efficient"
        ]
      }
    });
  } catch (error) {
    console.error("❌ Error getting cache stats:", error);
    res.status(500).json({ error: "Failed to get cache statistics" });
  }
}
