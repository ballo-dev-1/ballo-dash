import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ 
        error: "No session found",
        message: "User is not authenticated"
      });
    }

    // Create a safe version of the session for logging (hide sensitive data)
    const safeSession = {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        companyId: session.user.companyId,
        accessTokens: {
          FACEBOOK: session.user.accessTokens?.FACEBOOK ? 
            `${session.user.accessTokens.FACEBOOK.substring(0, 20)}...` : 
            null,
          LINKEDIN: session.user.accessTokens?.LINKEDIN ? 
            `${session.user.accessTokens.LINKEDIN.substring(0, 20)}...` : 
            null,
        },
        hasFacebookToken: !!session.user.accessTokens?.FACEBOOK,
        hasLinkedInToken: !!session.user.accessTokens?.LINKEDIN,
      }
    };

    // console.log("🔍 Debug Session API - Current session for user:", session.user.email);
    // console.log("   Session data:", JSON.stringify(safeSession, null, 2));

    res.status(200).json({
      message: "Session debug info",
      session: safeSession,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Error in debug session API:", error);
    res.status(500).json({ 
      error: "Failed to get session debug info",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 