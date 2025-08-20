// src/pages/api/integrations/modal-data.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user session to find company ID
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    console.log("Modal API: Fetching integrations for company:", companyId);

    try {
      const result = await db
        .select()
        .from(integrations)
        .where(eq(integrations.companyId, companyId));

      console.log("Modal API: Found integrations:", result.length);
      console.log("Modal API: Integration details:", result.map(i => ({
        id: i.id,
        type: i.type,
        status: i.status,
        hasAccessToken: !!i.accessToken,
        accessTokenLength: i.accessToken?.length || 0,
        accessTokenPreview: i.accessToken ? `${i.accessToken.substring(0, 20)}...` : 'NONE'
      })));

      // Return FULL integration data including access tokens for modal
      return res.status(200).json(result);
    } catch (dbError: any) {
      console.error("❌ Modal API: Database error during fetch:", dbError);
      return res.status(500).json({
        error: "Database error during fetch",
        details: dbError.message,
      });
    }
  } catch (error: any) {
    console.error("❌ Modal API: Unexpected error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
