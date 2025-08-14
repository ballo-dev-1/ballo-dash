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
        // No more accessTokens - tokens are fetched directly from database when needed
        note: "Access tokens are now fetched directly from database via token cache service"
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