import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { tokenCache } from "@/lib/tokenCache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("🔄 Force refreshing token cache for user:", session.user.email);
    console.log("   Company ID:", session.user.companyId);

    // Clear all cached tokens for this company to force fresh database fetch
    tokenCache.clearCompanyTokens(session.user.companyId);

    // Get cache statistics
    const cacheStats = tokenCache.getCacheStats();

    res.status(200).json({
      message: "Token cache refreshed successfully",
      note: "Access tokens are now fetched directly from database via token cache service",
      companyId: session.user.companyId,
      cacheStats: cacheStats
    });

  } catch (error) {
    console.error("❌ Error refreshing tokens:", error);
    res.status(500).json({ 
      error: "Failed to refresh tokens",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 