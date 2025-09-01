// src/pages/api/debug/update-instagram-account-ids.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getInstagramAccessToken, getInstagramAccountId, storeInstagramAccountId } from "@/lib/instagram";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const companyId = session.user.companyId;

    // Get all Instagram integrations for the company
    const instagramIntegrations = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM'),
          eq(integrations.status, 'CONNECTED')
        )
      );

    if (instagramIntegrations.length === 0) {
      return res.json({
        message: "No Instagram integrations found",
        companyId,
        updated: 0
      });
    }

    const results = [];

    for (const integration of instagramIntegrations) {
      try {
        // Skip if already has account ID
        if (integration.accountId) {
          results.push({
            id: integration.id,
            status: 'skipped',
            reason: 'Already has account ID',
            accountId: integration.accountId
          });
          continue;
        }

        // Get access token
        const accessToken = integration.accessToken;
        if (!accessToken) {
          results.push({
            id: integration.id,
            status: 'error',
            reason: 'No access token'
          });
          continue;
        }

        // Fetch account ID from Instagram API
        const accountId = await getInstagramAccountId(accessToken);
        if (!accountId) {
          results.push({
            id: integration.id,
            status: 'error',
            reason: 'Could not fetch account ID from Instagram API'
          });
          continue;
        }

        // Store account ID in database
        await storeInstagramAccountId(companyId, accountId);

        results.push({
          id: integration.id,
          status: 'success',
          accountId,
          message: 'Account ID updated successfully'
        });

      } catch (error: any) {
        results.push({
          id: integration.id,
          status: 'error',
          reason: error.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const skippedCount = results.filter(r => r.status === 'skipped').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return res.json({
      message: `Instagram account IDs update completed`,
      companyId,
      summary: {
        total: instagramIntegrations.length,
        success: successCount,
        skipped: skippedCount,
        error: errorCount
      },
      results
    });

  } catch (error: any) {
    console.error("❌ Error updating Instagram account IDs:", error);
    return res.status(500).json({ 
      error: "Failed to update Instagram account IDs",
      details: error.message 
    });
  }
}
