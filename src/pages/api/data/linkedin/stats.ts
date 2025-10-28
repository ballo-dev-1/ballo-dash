import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import { JSDOM } from "jsdom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getLinkedInAccessToken } from "@/lib/linkedin";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";
import { LinkedInStatsResponseSchema } from "@/types/linkedin";
import { createAccountInfo, createDateRange, createCacheMetadata, wrapMetric, createEmptyDateRange } from "@/lib/stats-utils";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";
const LINKEDIN_REST_API_BASE = "https://api.linkedin.com/rest";
const LINKEDIN_API_VERSION = "202501"; // LinkedIn-Version header

/**
 * LinkedIn Stats API Handler
 * 
 * Fetches organization page statistics from LinkedIn Marketing API
 * Reference: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/page-statistics
 * 
 * @route GET /api/data/linkedin/stats
 * @query organizationId - LinkedIn Organization ID
 * @query since - Start date (YYYY-MM-DD format, optional)
 * @query until - End date (YYYY-MM-DD format, optional)
 * @query datePreset - Date preset value (optional)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawOrgId = req.query.organizationId;
  const organizationId = Array.isArray(rawOrgId) ? rawOrgId[0] : rawOrgId;
  const { since, until, datePreset } = req.query;

  if (!organizationId) {
    return res.status(400).json({ error: "Missing organizationId" });
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

    // Build cache key including date parameters for date-specific caching
    const cacheKey = since && until 
      ? `${organizationId}:${since}:${until}`
      : organizationId;
    
    // Check if we have fresh cached data
    const cachedData = await socialMediaCacheService.getData(
      companyId,
      'LINKEDIN',
      cacheKey
    );

    if (cachedData && cachedData.fetchStatus === 'SUCCESS') {
      return res.status(200).json(cachedData.data);
    }

    // Fetch LinkedIn access token directly from database
    // console.log("Fetching LinkedIn access token from database for stats...");
    // console.log("   User Email:", session.user.email);
    // console.log("   Company ID:", companyId);
    
    const accessToken = await getLinkedInAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "LinkedIn access token not found in database" });
    }

    // console.log("✅ Retrieved LinkedIn access token: ", accessToken);
    // console.log("   Token preview:", accessToken.substring(0, 20) + "...");

    const orgUrn = `urn:li:organization:${organizationId}`;
    const encodedOrgUrn = encodeURIComponent(orgUrn);

    // Build time intervals parameters for LinkedIn API
    // Reference: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/page-statistics
    let timeIntervalsParams = '';
    if (since && until) {
      const startDate = new Date(since as string);
      const endDate = new Date(until as string);
      
      // LinkedIn expects milliseconds since epoch
      const startMs = startDate.getTime();
      const endMs = endDate.getTime();
      
      // Calculate granularity (DAY or MONTH based on range)
      const diffDays = Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24));
      const granularity = diffDays > 31 ? 'MONTH' : 'DAY';
      
      // Build Restli 1.0 format parameters
      timeIntervalsParams = `&timeIntervals.timeGranularityType=${granularity}&timeIntervals.timeRange.start=${startMs}&timeIntervals.timeRange.end=${endMs}`;
    }

    // Fetch Followers Data
    const followersUrl = `${LINKEDIN_API_BASE}/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=${encodedOrgUrn}`;
    const followersRes = await fetch(followersUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const followersData = await followersRes.json();

    // Fetch Organization Info
    const infoUrl = `${LINKEDIN_API_BASE}/organizations/${organizationId}`;
    const infoRes = await fetch(infoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const orgInfoData = await infoRes.json();

    // Fetch Page Statistics with time intervals
    // Using organizationPageStatistics for comprehensive page stats
    // Reference: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/page-statistics
    const pageStatsUrl = `${LINKEDIN_REST_API_BASE}/organizationPageStatistics?q=organization&organization=${encodedOrgUrn}${timeIntervalsParams}`;
    
    const pageStatsRes = await fetch(pageStatsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": LINKEDIN_API_VERSION,
      },
    });
    
    if (!pageStatsRes.ok) {
      console.error("[LinkedIn Stats] Page stats fetch failed:", await pageStatsRes.text());
    }
    
    const pageStatsData = await pageStatsRes.json();

    // Fetch Share Statistics with time intervals
    const statsUrl = `${LINKEDIN_API_BASE}/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodedOrgUrn}${timeIntervalsParams}`;
    const statsRes = await fetch(statsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const statsData = await statsRes.json();
    const shareStats = statsData.elements?.[0]?.totalShareStatistics || {};

    // Scrape fallback follower count
    const followWidgetUrl = `https://www.linkedin.com/pages-extensions/FollowCompany?id=${organizationId}&counter=bottom`;
    const htmlRes = await fetch(followWidgetUrl);
    const htmlText = await htmlRes.text();
    const dom = new JSDOM(htmlText);
    const followerDiv = dom.window.document.querySelector(".follower-count");
    const scrapedFollowerCount = followerDiv?.textContent?.trim() || null;

    // Extract page views from page statistics
    let pageViews = 0;
    if (pageStatsData?.elements?.length > 0) {
      const pageStats = pageStatsData.elements[0];
      
      // For time-bound stats, aggregate from totalPageStatistics
      if (pageStats.totalPageStatistics?.views?.allPageViews?.pageViews) {
        pageViews = pageStats.totalPageStatistics.views.allPageViews.pageViews;
      }
      // For lifetime stats, aggregate from all segments
      else if (pageStats.totalPageStatistics?.views?.overviewPageViews?.pageViews) {
        pageViews = pageStats.totalPageStatistics.views.overviewPageViews.pageViews;
      }
    }

    // Calculate total engagement
    const totalEngagement = 
      (shareStats.likeCount || 0) +
      (shareStats.commentCount || 0) +
      (shareStats.shareCount || 0);

    // Build standardized metrics structure (no period nesting)
    const standardizedMetrics: Record<string, any> = {
      page_follows: wrapMetric(
        scrapedFollowerCount || 0,
        'page_follows'
      ),
      page_views: wrapMetric(
        pageViews,
        'page_views'
      ),
      impression_count: wrapMetric(
        shareStats.impressionCount || 0,
        'impression_count'
      ),
      unique_impressions_count: wrapMetric(
        shareStats.uniqueImpressionsCount || 0,
        'unique_impressions_count'
      ),
      click_count: wrapMetric(
        shareStats.clickCount || 0,
        'click_count'
      ),
      like_count: wrapMetric(
        shareStats.likeCount || 0,
        'like_count'
      ),
      comment_count: wrapMetric(
        shareStats.commentCount || 0,
        'comment_count'
      ),
      share_count: wrapMetric(
        shareStats.shareCount || 0,
        'share_count'
      ),
      share_mentions_count: wrapMetric(
        shareStats.shareMentionsCount || 0,
        'share_mentions_count'
      ),
      comment_mentions_count: wrapMetric(
        shareStats.commentMentionsCount || 0,
        'comment_mentions_count'
      ),
      engagement: wrapMetric(
        totalEngagement,
        'engagement'
      ),
    };

    // LinkedIn metric names for empty dateRange
    const linkedInMetrics = Object.keys(standardizedMetrics);
    
    // Final standardized response object
    const finalResponse = {
      platform: "linkedin",
      accountInfo: createAccountInfo({
        id: organizationId,
        name: orgInfoData.localizedName || orgInfoData.name || "Unknown",
        profilePicture: null,
        biography: null,
        creationDate: null,
        verified: null,
      }),
      metrics: standardizedMetrics,
      dateRange: createEmptyDateRange(linkedInMetrics),
      recentPost: null,
      rawPageStats: pageStatsData,
      cache: createCacheMetadata({
        cached: false,
        fetchStatus: 'SUCCESS',
        lastFetchedAt: new Date().toISOString(),
      }),
    };

    // Validate response with Zod
    try {
      const validated = LinkedInStatsResponseSchema.parse(finalResponse);
      
      // Store validated result in cache with date-specific key
      try {
        await socialMediaCacheService.storeData(
          companyId,
          'LINKEDIN',
        cacheKey,
        validated,
        'SUCCESS'
      );
    } catch (cacheError) {
        console.error("[LinkedIn Stats] Cache error:", cacheError);
        // Don't fail the request if caching fails
      }

      return res.status(200).json(validated);
    } catch (validationError) {
      console.error("[LinkedIn Stats] Response validation failed:", validationError);
      // Return data anyway but log the validation error
      return res.status(200).json(finalResponse);
    }
  } catch (error: any) {
    console.error("[LinkedIn Stats] Error:", error);
    res.status(500).json({
      error: "Failed to fetch LinkedIn data",
      details: error.message,
    });
  }
}
