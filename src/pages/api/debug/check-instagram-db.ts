// src/pages/api/debug/check-instagram-db.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    // Get all integrations for this company
    const allIntegrations = await db
      .select()
      .from(integrations)
      .where(eq(integrations.companyId, companyId));

    // Filter Instagram integrations
    const instagramIntegrations = allIntegrations.filter(i => i.type === 'INSTAGRAM');

    // Get specific Instagram integration details
    const instagramDetails = instagramIntegrations.map(integration => ({
      id: integration.id,
      type: integration.type,
      status: integration.status,
      handle: integration.handle,
      hasAccessToken: !!integration.accessToken,
      accessTokenLength: integration.accessToken?.length || 0,
      hasAccountId: !!integration.accountId,
      accountId: integration.accountId,
      createdAt: integration.createdAt,
      updatedAt: integration.updatedAt
    }));

    return res.json({
      companyId,
      totalIntegrations: allIntegrations.length,
      allIntegrations: allIntegrations.map(i => ({
        id: i.id,
        type: i.type,
        status: i.status,
        hasAccessToken: !!i.accessToken,
        hasAccountId: !!i.accountId
      })),
      instagramIntegrations: instagramDetails,
      summary: {
        hasInstagram: instagramIntegrations.length > 0,
        connectedInstagram: instagramIntegrations.filter(i => i.status === 'CONNECTED').length,
        hasAccountId: instagramIntegrations.some(i => i.accountId),
        hasAccessToken: instagramIntegrations.some(i => i.accessToken)
      }
    });

  } catch (error: any) {
    console.error("❌ Error in check-instagram-db:", error);
    return res.status(500).json({ 
      error: "Failed to check Instagram database",
      details: error.message 
    });
  }
}
