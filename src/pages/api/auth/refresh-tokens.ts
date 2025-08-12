import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    // console.log("🔄 Force refreshing tokens for user:", session.user.email);
    // console.log("   Company ID:", session.user.companyId);

    // Fetch fresh integrations from database
    const companyIntegrations = await db
      .select()
      .from(integrations)
      .where(eq(integrations.companyId, session.user.companyId));

    const accessTokens: { FACEBOOK?: string; LINKEDIN?: string } = {};
    
    companyIntegrations.forEach((integration) => {
      if (integration.accessToken) {
        accessTokens[integration.type as keyof typeof accessTokens] = integration.accessToken;
      }
    });

    // Update the session with new tokens
    session.user.accessTokens = accessTokens;


    res.status(200).json({
      message: "Tokens refreshed successfully",
      availableTokens: Object.keys(accessTokens),
      hasFacebookToken: !!accessTokens.FACEBOOK,
      hasLinkedInToken: !!accessTokens.LINKEDIN
    });

  } catch (error) {
    console.error("❌ Error refreshing tokens:", error);
    res.status(500).json({ 
      error: "Failed to refresh tokens",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 