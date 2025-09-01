// src/pages/api/debug/test-instagram.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getInstagramAccessToken, getInstagramAccountId } from "@/lib/instagram";

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

    // Step 1: Get Instagram access token
    console.log("🔍 Step 1: Getting Instagram access token...");
    const accessToken = await getInstagramAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(401).json({ 
        error: "Instagram access token not found",
        step: "getInstagramAccessToken",
        companyId 
      });
    }

    console.log("✅ Step 1: Access token found, length:", accessToken.length);

    // Step 2: Get Instagram account ID
    console.log("🔍 Step 2: Getting Instagram account ID...");
    const accountId = await getInstagramAccountId(accessToken);
    
    if (!accountId) {
      return res.status(404).json({ 
        error: "Instagram account not found",
        step: "getInstagramAccountId",
        accessTokenLength: accessToken.length
      });
    }

    console.log("✅ Step 2: Account ID found:", accountId);

    // Step 3: Test Instagram profile API (bio, username, followers_count)
    console.log("🔍 Step 3: Testing Instagram profile API...");
    
    const profileResponse = await fetch(
      `https://graph.facebook.com/v23.0/${accountId}?fields=biography,id,username,followers_count&access_token=${accessToken}`
    );

    console.log("📊 Profile API Status:", profileResponse.status);

    if (!profileResponse.ok) {
      const profileText = await profileResponse.text();
      
      return res.status(500).json({
        error: "Instagram profile API error",
        profileStatus: profileResponse.status,
        profileResponse: profileText
      });
    }

    const profileData = await profileResponse.json();
    console.log("✅ Step 3: Profile API call successful");

    // Step 4: Test Instagram insights API
    console.log("🔍 Step 4: Testing Instagram insights API...");
    
    const [reachResponse, engagementResponse] = await Promise.all([
      fetch(
        `https://graph.facebook.com/v19.0/${accountId}/insights?metric=reach,follower_count,threads_views&period=day&access_token=${accessToken}`
      ),
      fetch(
        `https://graph.facebook.com/v19.0/${accountId}/insights?metric=website_clicks,profile_views,accounts_engaged,total_interactions,likes,comments,shares,saves,replies,follows_and_unfollows,profile_links_taps,views,content_views&metric_type=total_value&period=day&access_token=${accessToken}`
      )
    ]);

    console.log("📊 Reach API Status:", reachResponse.status);
    console.log("📊 Engagement API Status:", engagementResponse.status);

    if (!reachResponse.ok || !engagementResponse.ok) {
      const reachText = await reachResponse.text();
      const engagementText = await engagementResponse.text();
      
      return res.status(500).json({
        error: "Instagram insights API error",
        reachStatus: reachResponse.status,
        engagementStatus: engagementResponse.status,
        reachResponse: reachText,
        engagementResponse: engagementText
      });
    }

    const [reachData, engagementData] = await Promise.all([
      reachResponse.json(),
      engagementResponse.json()
    ]);

    console.log("✅ Step 4: Insights API calls successful");

    return res.json({
      success: true,
      companyId,
      accountId,
      accessTokenLength: accessToken.length,
      profileData,
      reachData,
      engagementData,
      message: "Instagram API test successful"
    });

  } catch (error: any) {
    console.error("❌ Instagram test error:", error);
    return res.status(500).json({ 
      error: "Instagram test failed",
      details: error.message,
      stack: error.stack
    });
  }
}
