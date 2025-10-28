// src/pages/api/data/instagram/stats.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getInstagramAccessToken, getInstagramAccountId, storeInstagramAccountId, getStoredInstagramAccountId } from "@/lib/instagram";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";
import { InstagramStatsResponseSchema, INSTAGRAM_METRICS } from "@/types/instagram";
import { createAccountInfo, createDateRange, createCacheMetadata, wrapMetric, createEmptyDateRange } from "@/lib/stats-utils";

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
      // console.log("❌ No stored account ID found in database");
      // console.log("🔄 Attempting to fetch from Instagram API...");
      
      accountId = await getInstagramAccountId(accessToken);
      
      if (accountId) {
        // console.log(`✅ Successfully fetched account ID from API: ${accountId}`);
        // console.log(`💾 Storing account ID in database...`);
        
        try {
          await storeInstagramAccountId(companyId, accountId);
          // console.log(`✅ Account ID stored successfully in database`);
        } catch (storeError) {
          // console.log(`⚠️ Warning: Failed to store account ID:`, storeError);
        }
      } else {
        // console.log("❌ Failed to fetch account ID from Instagram API");
      }
    } else {
      // console.log(`✅ Found stored account ID in database: ${accountId}`);
    }
    
    // console.log(`Final Account ID: ${accountId || 'NULL'}`);
    console.log("========================================");
    
    if (!accountId) {
      // console.log("❌ Instagram account not found - returning 404");
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

    // console.log("📸 Instagram Profile Data:", {
    //   username: profileData.username,
    //   biography: profileData.biography,
    //   id: profileData.id,
    //   followers_count: profileData.followers_count
    // });

    // Build standardized metrics structure (no period nesting)
    const standardizedMetrics: Record<string, any> = {
      followers: wrapMetric(
        profileData.followers_count || reachData.data?.find((m: any) => m.name === "follower_count")?.values?.[0]?.value || 0,
        'followers'
      ),
      reach: wrapMetric(
        reachData.data?.find((m: any) => m.name === "reach")?.values?.[0]?.value || 0,
        'reach'
      ),
      threads_views: wrapMetric(
        reachData.data?.find((m: any) => m.name === "threads_views")?.values?.[0]?.value || 0,
        'threads_views'
      ),
      website_clicks: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "website_clicks")?.values?.[0]?.value || 0,
        'website_clicks'
      ),
      profile_views: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "profile_views")?.values?.[0]?.value || 0,
        'profile_views'
      ),
      accounts_engaged: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "accounts_engaged")?.values?.[0]?.value || 0,
        'accounts_engaged'
      ),
      total_interactions: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "total_interactions")?.values?.[0]?.value || 0,
        'total_interactions'
      ),
      likes: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "likes")?.values?.[0]?.value || 0,
        'likes'
      ),
      comments: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "comments")?.values?.[0]?.value || 0,
        'comments'
      ),
      shares: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "shares")?.values?.[0]?.value || 0,
        'shares'
      ),
      saves: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "saves")?.values?.[0]?.value || 0,
        'saves'
      ),
      replies: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "replies")?.values?.[0]?.value || 0,
        'replies'
      ),
      follows_and_unfollows: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "follows_and_unfollows")?.values?.[0]?.value || 0,
        'follows_and_unfollows'
      ),
      profile_links_taps: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "profile_links_taps")?.values?.[0]?.value || 0,
        'profile_links_taps'
      ),
      views: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "views")?.values?.[0]?.value || 0,
        'views'
      ),
      content_views: wrapMetric(
        engagementData.data?.find((m: any) => m.name === "content_views")?.values?.[0]?.value || 0,
        'content_views'
      ),
    };

    // Build standardized response
    const transformedData = {
      platform: "instagram",
      accountInfo: createAccountInfo({
        id: accountId,
        name: profileData.username || accountId,
        profilePicture: null,
        biography: profileData.biography || null,
        creationDate: null,
        verified: null,
      }),
      metrics: standardizedMetrics,
      dateRange: createEmptyDateRange(Array.from(INSTAGRAM_METRICS)),
      recentPost: recentPostData.data ? { data: recentPostData.data } : null,
      rawPageStats: null,
      cache: createCacheMetadata({
        cached: false,
        fetchStatus: 'SUCCESS',
        lastFetchedAt: new Date().toISOString(),
      }),
    };

    // Validate with Zod schema
    try {
      const validated = InstagramStatsResponseSchema.parse(transformedData);
      
      // Store validated data in cache
      await socialMediaCacheService.storeData(
        companyId,
        platform,
        identifier,
        validated,
        "SUCCESS"
      );

      return res.json(validated);
    } catch (validationError) {
      console.error("[Instagram Stats] Response validation failed:", validationError);
      // Store and return data anyway but log the validation error
      await socialMediaCacheService.storeData(
        companyId,
        platform,
        identifier,
        transformedData,
        "SUCCESS"
      );
      return res.json(transformedData);
    }

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
          const responseWithCache = {
            ...cachedData.data,
            cache: {
              cached: true,
              fetchStatus: 'ERROR' as const,
              lastFetchedAt: cachedData.lastFetchedAt,
              message: `Showing cached data due to error: ${error.message}`,
            },
          };
          return res.json(responseWithCache);
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
