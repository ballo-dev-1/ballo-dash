// src/pages/api/data/instagram/stats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getInstagramAccessToken, getInstagramAccountId, storeInstagramAccountId, getStoredInstagramAccountId } from "@/lib/instagram";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";
import DataTransformationService from "@/services/dataTransformationService";

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
    const platform = Array.isArray(req.query.platform) ? req.query.platform[0] : req.query.platform || "instagram";

    // For Instagram, we use a fixed identifier since data is fetched by account ID
    const identifier = "instagram_account";

    // Check cache first
    const cachedData = await socialMediaCacheService.getData(companyId, platform as string, identifier);
    if (cachedData && await socialMediaCacheService.hasFreshData(companyId, platform as string, identifier)) {
      return res.json(cachedData.data);
    }

    // Get Instagram access token
    const accessToken = await getInstagramAccessToken(companyId);
    if (!accessToken) {
      return res.status(401).json({ error: "Instagram access token not found" });
    }

    let accountId = await getStoredInstagramAccountId(companyId);
    
    if (!accountId) {
      console.log("❌ No stored account ID found in database");
      console.log("🔄 Attempting to fetch from Instagram API...");
      
      accountId = await getInstagramAccountId(accessToken);
      
      if (accountId) {
        console.log(`✅ Successfully fetched account ID from API: ${accountId}`);
        console.log(`💾 Storing account ID in database...`);
        
        try {
          await storeInstagramAccountId(companyId, accountId);
          console.log(`✅ Account ID stored successfully in database`);
        } catch (storeError) {
          console.log(`⚠️ Warning: Failed to store account ID:`, storeError);
        }
      } else {
        console.log("❌ Failed to fetch account ID from Instagram API");
      }
    } else {
      console.log(`✅ Found stored account ID in database: ${accountId}`);
    }
    
    console.log(`Final Account ID: ${accountId || 'NULL'}`);
    console.log("========================================");
    
    if (!accountId) {
      console.log("❌ Instagram account not found - returning 404");
      return res.status(404).json({ error: "Instagram account not found" });
    }

    // Fetch Instagram profile info (bio, username), insights, and recent posts
    const [profileResponse, reachResponse, engagementResponse, recentPostResponse] = await Promise.all([
      fetch(
        `https://graph.facebook.com/v23.0/${accountId}?fields=biography,id,username,followers_count&access_token=${accessToken}`
      ),
      fetch(
        `https://graph.facebook.com/v19.0/${accountId}/insights?metric=reach,follower_count,threads_views&period=day&access_token=${accessToken}`
      ),
      fetch(
        `https://graph.facebook.com/v19.0/${accountId}/insights?metric=website_clicks,profile_views,accounts_engaged,total_interactions,likes,comments,shares,saves,replies,follows_and_unfollows,profile_links_taps,views,content_views&metric_type=total_value&period=day&access_token=${accessToken}`
      ),
      fetch(
        `https://graph.facebook.com/v23.0/${accountId}/media?limit=1&fields=id,caption,timestamp&access_token=${accessToken}`
      )
    ]);

    if (!profileResponse.ok || !reachResponse.ok || !engagementResponse.ok) {
      throw new Error(`Instagram API error: Profile: ${profileResponse.status}, Reach: ${reachResponse.status}, Engagement: ${engagementResponse.status}`);
    }

    const [profileData, reachData, engagementData, recentPostData] = await Promise.all([
      profileResponse.json(),
      reachResponse.json(),
      engagementResponse.json(),
      recentPostResponse.json()
    ]);

    console.log("📸 Instagram Profile Data:", {
      username: profileData.username,
      biography: profileData.biography,
      id: profileData.id,
      followers_count: profileData.followers_count
    });

    // Prepare raw data for transformation
    const rawData = {
      userInfo: {
        username: profileData.username || accountId, // Use real username from API, fallback to account ID
        id: accountId,
        platform: "instagram",
        biography: profileData.biography || "",
        followers_count: profileData.followers_count || 0
      },
      metrics: {
        followers: profileData.followers_count || reachData.data?.find((m: any) => m.name === "follower_count")?.values?.[0]?.value || 0,
        reach: reachData.data?.find((m: any) => m.name === "reach")?.values?.[0]?.value || 0,
        threadsViews: reachData.data?.find((m: any) => m.name === "threads_views")?.values?.[0]?.value || 0,
        websiteClicks: engagementData.data?.find((m: any) => m.name === "website_clicks")?.values?.[0]?.value || 0,
        profileViews: engagementData.data?.find((m: any) => m.name === "profile_views")?.values?.[0]?.value || 0,
        accountsEngaged: engagementData.data?.find((m: any) => m.name === "accounts_engaged")?.values?.[0]?.value || 0,
        totalInteractions: engagementData.data?.find((m: any) => m.name === "total_interactions")?.values?.[0]?.value || 0,
        likes: engagementData.data?.find((m: any) => m.name === "likes")?.values?.[0]?.value || 0,
        comments: engagementData.data?.find((m: any) => m.name === "comments")?.values?.[0]?.value || 0,
        shares: engagementData.data?.find((m: any) => m.name === "shares")?.values?.[0]?.value || 0,
        saves: engagementData.data?.find((m: any) => m.name === "saves")?.values?.[0]?.value || 0,
        replies: engagementData.data?.find((m: any) => m.name === "replies")?.values?.[0]?.value || 0,
        followsAndUnfollows: engagementData.data?.find((m: any) => m.name === "follows_and_unfollows")?.values?.[0]?.value || 0,
        profileLinksTaps: engagementData.data?.find((m: any) => m.name === "profile_links_taps")?.values?.[0]?.value || 0,
        views: engagementData.data?.find((m: any) => m.name === "views")?.values?.[0]?.value || 0,
        contentViews: engagementData.data?.find((m: any) => m.name === "content_views")?.values?.[0]?.value || 0
      },
      recentPost: recentPostData.data ? { data: recentPostData.data } : null,
      since: '', // Instagram API doesn't support custom date ranges for these metrics
      until: '',
      datePreset: 'last_30_days'
    };

    // Use DataTransformationService to transform the data
    const transformedData = DataTransformationService.getInstance().transformInstagramData(rawData);
    
    if (!transformedData) {
      console.log("❌ Failed to transform Instagram data using DataTransformationService");
      return res.status(500).json({ error: "Failed to transform Instagram data" });
    }

    // Store in cache
    socialMediaCacheService.storeData(
      companyId,
      platform,
      identifier,
      transformedData,
      "SUCCESS"
    );

    return res.json(transformedData);

  } catch (error: any) {
    // Try to return cached data on error
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session?.user?.companyId) {
        const platform = Array.isArray(req.query.platform) ? req.query.platform[0] : req.query.platform || "instagram";
        const identifier = "instagram_account";
        const cachedData = await socialMediaCacheService.getData(
          session.user.companyId,
          platform as string,
          identifier
        );
        
        if (cachedData) {
          return res.json({
            ...cachedData.data,
            _cached: true,
            _fetchStatus: 'ERROR',
            _lastFetchedAt: cachedData.lastFetchedAt,
            _message: `Showing cached data due to error: ${error.message}`
          });
        }
      }
    } catch (cacheError) {
      // Ignore cache errors
    }

    return res.status(500).json({ 
      error: "Failed to fetch Instagram data",
      details: error.message 
    });
  }
}
