// src/pages/api/debug/instagram-check.ts

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

    // Get all integrations for the company
    const allIntegrations = await db
      .select()
      .from(integrations)
      .where(eq(integrations.companyId, companyId));

    // Filter Instagram-related integrations
    const instagramIntegrations = allIntegrations.filter(integration => 
      integration.type.toLowerCase().includes('instagram') || 
      integration.type.toLowerCase().includes('meta') ||
      integration.type.toLowerCase().includes('facebook')
    );

    // Get specific Instagram integration
    const instagramIntegration = allIntegrations.find(integration => 
      integration.type === 'INSTAGRAM'
    );

    return res.json({
      companyId,
      totalIntegrations: allIntegrations.length,
      allIntegrations: allIntegrations.map(i => ({
        id: i.id,
        type: i.type,
        status: i.status,
        hasAccessToken: !!i.accessToken,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      })),
      instagramRelated: instagramIntegrations.map(i => ({
        id: i.id,
        type: i.type,
        status: i.status,
        hasAccessToken: !!i.accessToken,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      })),
      exactInstagramMatch: instagramIntegration ? {
        id: instagramIntegration.id,
        type: instagramIntegration.type,
        status: instagramIntegration.status,
        hasAccessToken: !!instagramIntegration.accessToken,
        createdAt: instagramIntegration.createdAt,
        updatedAt: instagramIntegration.updatedAt
      } : null,
      searchQuery: "Looking for integration.type === 'INSTAGRAM'"
    });

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Failed to check Instagram integration",
      details: error.message 
    });
  }
}
