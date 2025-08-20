import { redis } from "@/app/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFacebookAccessToken } from "@/lib/facebook";

function hasDataChanged(oldData: any, newData: any) {
  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== Meta Stats API Called ===");
  console.log("Meta Stats API - Request received");
  console.log("Query params:", req.query);
  
  const { pageId, platform, since, until, datePreset } = req.query;

  if (
    typeof platform !== "string" ||
    typeof pageId !== "string"
  ) {
    return res.status(400).json({ error: "Missing pageId" });
  }

  try {
    // Get user session to find access tokens
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // console.log("Facebook Stats API - Session verification for user:", session.user.email);
    // console.log("   User ID:", session.user.id);
    // console.log("   Company ID:", session.user.companyId);
    // console.log("   Available access tokens:", Object.keys(session.user.accessTokens || {}));
    // console.log("   Facebook token exists:", !!session.user.accessTokens?.FACEBOOK);
    // console.log("   LinkedIn token exists:", !!session.user.accessTokens?.LINKEDIN);

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      console.error("❌ No company ID found in session for user:", session.user.email);
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    // Fetch Facebook access token directly from database
    console.log("Fetching Facebook access token from database for stats...");
    console.log("   User Email:", session.user.email);
    console.log("   Company ID:", companyId);
    
    const accessToken = await getFacebookAccessToken(companyId);
    
    if (!accessToken) {
      console.error("❌ Facebook access token not found in database for company:", companyId);
      return res.status(400).json({ error: "Facebook access token not found in database" });
    }

    console.log("✅ Retrieved Facebook access token from database for stats, company:", companyId);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");

    const cacheKey = `metaStats:${pageId}:${since || " "}:${until || " "}:${
      datePreset || " "
    }`;
    const cached = await redis.get(cacheKey);
    const cachedData = typeof cached === "string" ? JSON.parse(cached) : null;

    const metricList = [
      "page_fans",
      "page_fans_city",
      "page_total_actions",
      "page_follows",
      "page_views_total",
      "page_post_engagements",
      "page_impressions",
      "page_impressions_viral",
      "page_impressions_nonviral",
      "page_posts_served_impressions_organic_unique",
      "post_clicks",
      "page_fans_country",
      "page_fan_adds",
      "page_fan_removes",

      // "page_video_views",
      // "page_video_repeat_views",
      // "page_video_complete_views_30s",
      // "content_monetization_earnings",
    ];

    const timeParams = new URLSearchParams();
    if (since) timeParams.append("since=", since.toString());
    if (until) timeParams.append("until=", until.toString());
    if (datePreset) timeParams.append("datePreset", datePreset.toString());
    const results = await Promise.allSettled(
      metricList.map((metric) => {
        const url = `https://graph.${platform}.com/v23.0/${pageId}/insights?metric=${metric}&datePreset=${datePreset}&access_token=${accessToken}&${timeParams.toString()}`;
        return fetch(url).then((res) => res.json());
      })
    );

    const structuredData: Record<
      string,
      Record<string, { values: any[]; title: string; description: string }>
    > = {};

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value?.data) {
        result.value.data.forEach((metric: any) => {
          const { name, period, values, title, description } = metric;
          if (!structuredData[name]) structuredData[name] = {};
          const formattedValues = values.map((v: any) => ({
            value: v.value,
            endTime: v.end_time
              ? new Date(v.end_time).toISOString().split("T")[0]
              : null,
          }));
          structuredData[name][period] = {
            values: formattedValues,
            title,
            description,
          };
        });
      } else {
        const failedMetric = metricList[index];
        console.warn(`Failed to fetch ${failedMetric}:`, result);
      }
    });

    const pageInfoRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}?fields=name&access_token=${accessToken}`
    );

    const pageInfo = await pageInfoRes.json();

    const recentPostRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}/posts?limit=1&access_token=${accessToken}`
    );

    const recentPost = await recentPostRes.json();

    const newData = {
      pageInfo,
      platform,
      metrics: structuredData,
      recentPost: recentPost.data?.[0] || null,
    };

    // Check if data has changed before caching
    if (!cachedData || hasDataChanged(cachedData, newData)) {
      await redis.setex(cacheKey, 300, JSON.stringify(newData)); // Cache for 5 minutes
    }

    console.log("Meta final response:", JSON.stringify(newData, null, 2));
    console.log("=== Meta Stats API Completed Successfully ===");
    res.status(200).json(newData);
  } catch (error) {
    console.error("Error fetching Facebook stats:", error);
    console.log("=== Meta Stats API Failed ===");
    res.status(500).json({ error: "Failed to fetch Facebook stats" });
  }
}
