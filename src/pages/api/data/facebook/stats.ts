import { redis } from "@/app/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFacebookAccessToken } from "@/lib/facebook";
import { FacebookStatsResponseSchema, FACEBOOK_CORE_METRICS } from "@/types/facebook";
import { createAccountInfo, createDateRange, createCacheMetadata, buildTimeSeriesFromValues } from "@/lib/stats-utils";

/**
 * Cache duration in seconds (5 minutes)
 */
const CACHE_TTL = 300;

/**
 * Check if cached data has changed
 */
function hasDataChanged(oldData: any, newData: any): boolean {
  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

/**
 * Facebook Stats API Handler
 * 
 * Fetches page insights metrics from Facebook Graph API
 * Returns structured data with proper typing and validation
 * Reference: https://developers.facebook.com/docs/graph-api/reference/v23.0/insights
 * 
 * @route GET /api/data/facebook/stats
 * @query pageId - Facebook Page ID
 * @query platform - Should be 'facebook'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pageId, platform } = req.query;

  // Validate required parameters
  if (typeof platform !== "string" || platform.toLowerCase() !== "facebook") {
    return res.status(400).json({ error: "Invalid platform parameter" });
  }

  if (typeof pageId !== "string") {
    return res.status(400).json({ error: "Missing or invalid pageId parameter" });
  }

  try {
    // Authenticate user
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      console.error("[Facebook Stats] No company ID in session for user:", session.user.email);
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    // Get access token
    const accessToken = await getFacebookAccessToken(companyId);
    if (!accessToken) {
      console.error("[Facebook Stats] No access token for company:", companyId);
      return res.status(400).json({ error: "Facebook access token not found" });
    }

    // Generate cache key
    const cacheKey = `fb:stats:${pageId}:lifetime`;

    // Try to get cached data
    const cached = await redis.get(cacheKey);
    const cachedData = typeof cached === "string" ? JSON.parse(cached) : null;

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Step 1: Fetch page_fans first to get creation date
    const pageCreationRes = await fetch(
      `https://graph.facebook.com/v23.0/${pageId}/insights?metric=page_fans&limit=1&since=2001-01-01&access_token=${accessToken}`
    );
    const pageCreationData = await pageCreationRes.json();

    // Extract page creation date
    let page_creation_date = null;
    if (pageCreationData?.data?.[0]?.values?.[0]?.end_time) {
      const endTime = pageCreationData.data[0].values[0].end_time;
      page_creation_date = new Date(endTime).toISOString().split('T')[0];
      console.log("[Facebook Stats] Using page creation date:", page_creation_date);
    } else {
      console.log("[Facebook Stats] No page creation data found in response");
      console.log("  - pageCreationData structure:", JSON.stringify(pageCreationData, null, 2));
    }

    // Core metrics to fetch (simplified from the original list)
    const metricList = Array.from(FACEBOOK_CORE_METRICS);
    
    // Map standardized names back to Facebook API metric names for fetching
    const fbApiMetricMap: Record<string, string> = {
      'page_likes': 'page_fans',
      'page_reach': 'page_impressions',
      'page_actions': 'page_total_actions',
    };
    
    // Step 2: Fetch all metrics using creation date for page_impressions
    const metricResults = await Promise.allSettled(
      metricList.map((metric) => {
        const fbApiMetric = fbApiMetricMap[metric] || metric;
        let sinceParam = '';
        if (fbApiMetric === 'page_fans') {
          sinceParam = '&since=2001-01-01';
        } else if (fbApiMetric === 'page_impressions' && page_creation_date) {
          sinceParam = `&since=${page_creation_date}`;
        }
        const url = `https://graph.facebook.com/v23.0/${pageId}/insights?metric=${fbApiMetric}${sinceParam}&access_token=${accessToken}`;
        return fetch(url).then((res) => res.json());
      })
    );

    // Structure to hold processed metrics (simplified - no period nesting)
    const structuredData: Record<
      string,
      { values: any[]; title: string; description: string }
    > = {};
    
    // Structure to hold time-series data for dateRange
    // Initialize all metrics to null, then populate those with time-series data
    const timeSeriesData: Record<string, Array<{ date: string; value: any }> | null> = {};

    // Process metric results - extract 'day' period by default
    metricResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value?.data) {
        result.value.data.forEach((metric: any) => {
          const { name, period, values, title, description } = metric;
          
          if (!name) {
            console.warn(`[Facebook Stats] Metric missing name at index ${index}`);
            return;
          }

          // Rename Facebook API metric names to our standardized names
          const metricNameMap: Record<string, string> = {
            'page_fans': 'page_likes',
            'page_impressions': 'page_reach',
            'page_total_actions': 'page_actions',
          };
          
          const standardizedName = metricNameMap[name] || name;
          
          // Only use 'day' period data, or 'lifetime' for cumulative metrics like page_likes
          const shouldUse = (period === 'day') || (period === 'lifetime' && standardizedName === 'page_likes');
          
          if (!shouldUse) {
            return; // Skip other periods
          }

          // Format values with consistent structure for metrics
          const formattedValues = values.map((v: any) => ({
            date: v.end_time ? new Date(v.end_time).toISOString().split("T")[0] : null,
            value: v.value,
          }));

          // Format values for time-series data (dateRange)
          const timeSeriesFormattedValues = values.map((v: any) => ({
            value: v.value,
            endTime: v.end_time ? new Date(v.end_time).toISOString().split("T")[0] : null,
          }));

          // For metrics with time-series data, only store the last value in metrics
          // The full time-series will be in dateRange
          const metricsValues = (standardizedName === 'page_likes' || standardizedName === 'page_reach')
            ? [formattedValues[formattedValues.length - 1]] // Last value only
            : formattedValues; // All values for other metrics

          // Store metric data directly (no period nesting) with standardized name
          structuredData[standardizedName] = {
            values: metricsValues,
            title: title || standardizedName,
            description: description || `${standardizedName} metric`,
          };
          
          // Build time-series data for dateRange (only for metrics with date data)
          if (standardizedName === 'page_likes' || standardizedName === 'page_reach') {
            const timeSeries = buildTimeSeriesFromValues(timeSeriesFormattedValues);
            if (timeSeries && timeSeries.length > 0) {
              timeSeriesData[standardizedName] = timeSeries;
            } else {
              timeSeriesData[standardizedName] = null;
            }
          } else {
            // Other metrics don't have time-series data
            timeSeriesData[standardizedName] = null;
          }
        });
      } else {
        const failedMetric = metricList[index];
        console.warn(`[Facebook Stats] Failed to fetch ${failedMetric}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
      } 
    });

    // Fetch page info and recent post in parallel
    const [pageInfoRes, recentPostRes] = await Promise.all([
      fetch(`https://graph.facebook.com/v23.0/${pageId}?fields=id,name&access_token=${accessToken}`),
      fetch(`https://graph.facebook.com/v23.0/${pageId}/posts?limit=1&since=2001-01-01&access_token=${accessToken}`)
    ]);

    const pageInfo = await pageInfoRes.json();
    const recentPostData = await recentPostRes.json();

    // Build standardized response object
    const responseData = {
      platform: "facebook",
      accountInfo: createAccountInfo({
        id: pageInfo.id || pageId,
        name: pageInfo.name || "Facebook Page",
        profilePicture: null,
        biography: null,
        creationDate: page_creation_date,
        verified: null,
      }),
      metrics: structuredData,
      dateRange: createDateRange(timeSeriesData),
      recentPost: recentPostData.data ? { data: recentPostData.data } : null,
      rawPageStats: null,
      cache: createCacheMetadata({
        cached: false,
        fetchStatus: 'SUCCESS',
        lastFetchedAt: new Date().toISOString(),
      }),
    };

    // Validate response with Zod
    try {
      const validated = FacebookStatsResponseSchema.parse(responseData);
      
      // Cache the validated data
      if (!cachedData || hasDataChanged(cachedData, validated)) {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(validated));
      }

      return res.status(200).json(validated);
    } catch (validationError) {
      console.error("[Facebook Stats] Response validation failed:", validationError);
      // Return data anyway but log the validation error
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(responseData));
      return res.status(200).json(responseData);
    }
  } catch (error) {
    console.error("[Facebook Stats] Error:", error);
    return res.status(500).json({ 
      error: "Failed to fetch Facebook stats",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
