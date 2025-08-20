import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
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

    const { integrationId, accessToken, appId, appSecret } = req.body;

    let fbIntegration: any;
    let targetAccessToken: string;
    let targetAppId: string;
    let targetAppSecret: string;

    if (integrationId) {
      // Existing flow: fetch integration by ID
      console.log("Fetching Facebook token info for integration:", integrationId);

      const integration = await db
        .select()
        .from(integrations)
        .where(
          and(
            eq(integrations.id, integrationId),
            eq(integrations.companyId, companyId),
            eq(integrations.type, "FACEBOOK")
          )
        );

      if (integration.length === 0) {
        return res.status(404).json({ error: "Facebook integration not found or access denied" });
      }

      fbIntegration = integration[0];
      targetAccessToken = fbIntegration.accessToken;
      targetAppId = fbIntegration.appId;
      targetAppSecret = fbIntegration.appSecret;

      if (!targetAccessToken) {
        return res.status(400).json({ error: "No access token found for this integration" });
      }
    } else {
      // New flow: direct access token and app credentials
      if (!accessToken || !appId || !appSecret) {
        return res.status(400).json({ error: "Access token, app ID, and app secret are required" });
      }

      console.log("Fetching Facebook token info for direct access token");
      targetAccessToken = accessToken;
      targetAppId = appId;
      targetAppSecret = appSecret;
    }

    if (!targetAppId || !targetAppSecret) {
      console.error("❌ Facebook app credentials not found");
      return res.status(500).json({ error: "Facebook app credentials are required. Please provide App ID and App Secret." });
    }

    // Generate app access token
    const appAccessToken = `${targetAppId}|${targetAppSecret}`;

    try {
      // Call Facebook's debug_token endpoint
      const fbResponse = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${targetAccessToken}&access_token=${appAccessToken}`
      );

      if (!fbResponse.ok) {
        const errorText = await fbResponse.text();
        console.error("❌ Facebook API error:", fbResponse.status, errorText);
        throw new Error(`Facebook API error: ${fbResponse.status}`);
      }

      const fbData = await fbResponse.json();
      console.log("Facebook token info response:", fbData);

      if (!fbData.data) {
        throw new Error("Invalid response from Facebook API");
      }

      const tokenInfo = fbData.data;
      const expiresAt = tokenInfo.expires_at ? new Date(tokenInfo.expires_at * 1000) : null;
      const dataAccessExpiresAt = tokenInfo.data_access_expires_at ? new Date(tokenInfo.data_access_expires_at * 1000) : null;

      // Update the integration with the new expiry information
      const updateData: any = {
        updatedAt: new Date()
      };

      // Use the most relevant expiry date
      if (expiresAt) {
        updateData.expiresAt = expiresAt;
      } else if (dataAccessExpiresAt) {
        updateData.expiresAt = dataAccessExpiresAt;
      }

      // Add metadata about the token
      updateData.metadata = {
        ...(fbIntegration?.metadata || {}),
        lastTokenCheck: new Date().toISOString(),
        tokenType: tokenInfo.type,
        appId: tokenInfo.app_id,
        userId: tokenInfo.user_id,
        scopes: tokenInfo.scopes,
        isValid: tokenInfo.is_valid,
        dataAccessExpiresAt: dataAccessExpiresAt?.toISOString(),
        originalExpiresAt: expiresAt?.toISOString()
      };

      // Update the integration in the database if we have an integration ID
      if (integrationId) {
        const result = await db
          .update(integrations)
          .set(updateData)
          .where(
            and(
              eq(integrations.id, integrationId),
              eq(integrations.companyId, companyId)
            )
          )
          .returning();

        if (result.length === 0) {
          throw new Error("Failed to update integration");
        }
      }

      if (integrationId) {
        console.log("✅ Facebook token info updated successfully in database");
      } else {
        console.log("✅ Facebook token info fetched successfully");
      }

      // Return the updated token information
      return res.status(200).json({
        success: true,
        message: integrationId ? "Token info refreshed successfully" : "Token info fetched successfully",
        tokenInfo: {
          expiresAt: updateData.expiresAt?.toISOString(),
          isValid: tokenInfo.is_valid,
          type: tokenInfo.type,
          scopes: tokenInfo.scopes,
          lastChecked: updateData.metadata.lastTokenCheck
        }
      });

    } catch (fbError: any) {
      console.error("❌ Error fetching Facebook token info:", fbError);
      return res.status(500).json({
        error: "Failed to fetch Facebook token info",
        details: fbError.message
      });
    }

  } catch (error: any) {
    console.error("❌ Unexpected error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
