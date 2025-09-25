import { redis } from "@/app/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFacebookAccessToken } from "@/lib/facebook";

function hasDataChanged(oldData: any, newData: any) {
  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      console.error("❌ No company ID found in session for user:", session.user.email);
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    const accessToken = await getFacebookAccessToken(companyId);
    
    if (!accessToken) {
      console.error("❌ Facebook access token not found in database for company:", companyId);
      return res.status(400).json({ error: "Facebook access token not found in database" });
    }

    // console.log("✅ Retrieved Facebook access token from database for stats, company:", companyId);
    // console.log("   Token preview:", accessToken.substring(0, 20) + "...");

    const cacheKey = `facebookStats:${pageId}:${since || " "}:${until || " "}:${
      datePreset || " "
    }`;
    const cached = await redis.get(cacheKey);
    const cachedData = typeof cached === "string" ? JSON.parse(cached) : null;

    const metricList = [
      "page_fans",
      "page_fans_city",
      "page_total_actions",
      "page_follows",
      "page_status",
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
    ];

    // Calculate quarter dates
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const threeMonthsAgo = new Date(now.getTime() - (93 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const sixMonthsAgo = new Date(now.getTime() - (186 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const nineMonthsAgo = new Date(now.getTime() - (279 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const twelveMonthsAgo = new Date(now.getTime() - (372 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    // Additional metrics for different quarters
    const quarterMetrics = [
      // Page Post Engagements
      {
        metric: "page_post_engagements",
        name: "page_post_engagements_this_quarter",
        since: threeMonthsAgo,
        until: today,
        period: "day"
      },
      {
        metric: "page_post_engagements",
        name: "page_post_engagements_last_quarter", 
        since: sixMonthsAgo,
        until: threeMonthsAgo,
        period: "day"
      },
      {
        metric: "page_post_engagements",
        name: "page_post_engagements_three_quarters_back",
        since: nineMonthsAgo,
        until: sixMonthsAgo,
        period: "day"
      },
      {
        metric: "page_post_engagements",
        name: "page_post_engagements_four_quarters_back",
        since: twelveMonthsAgo,
        until: nineMonthsAgo,
        period: "day"
      },
      // Page Posts Impressions
      {
        metric: "page_posts_impressions",
        name: "page_posts_impressions_this_quarter",
        since: threeMonthsAgo,
        until: today,
        period: "day"
      },
      {
        metric: "page_posts_impressions",
        name: "page_posts_impressions_last_quarter", 
        since: sixMonthsAgo,
        until: threeMonthsAgo,
        period: "day"
      },
      {
        metric: "page_posts_impressions",
        name: "page_posts_impressions_three_quarters_back",
        since: nineMonthsAgo,
        until: sixMonthsAgo,
        period: "day"
      },
      {
        metric: "page_posts_impressions",
        name: "page_posts_impressions_four_quarters_back",
        since: twelveMonthsAgo,
        until: nineMonthsAgo,
        period: "day"
      },
      // Page Impressions
      {
        metric: "page_impressions",
        name: "page_impressions_this_quarter",
        since: threeMonthsAgo,
        until: today,
        period: "day"
      },
      {
        metric: "page_impressions",
        name: "page_impressions_last_quarter", 
        since: sixMonthsAgo,
        until: threeMonthsAgo,
        period: "day"
      },
      {
        metric: "page_impressions",
        name: "page_impressions_three_quarters_back",
        since: nineMonthsAgo,
        until: sixMonthsAgo,
        period: "day"
      },
      {
        metric: "page_impressions",
        name: "page_impressions_four_quarters_back",
        since: twelveMonthsAgo,
        until: nineMonthsAgo,
        period: "day"
      }
    ];

    const timeParams = new URLSearchParams();
    if (since) timeParams.append("since=", since.toString());
    if (until) timeParams.append("until=", until.toString());
    if (datePreset) timeParams.append("datePreset", datePreset.toString());

    // Fetch regular metrics
    const regularResults = await Promise.allSettled(
      metricList.map((metric) => {
        const url = `https://graph.${platform}.com/v23.0/${pageId}/insights?metric=${metric}&datePreset=${datePreset}&access_token=${accessToken}&${timeParams.toString()}`;
        return fetch(url).then((res) => res.json());
      })
    );

    // Fetch additional quarter metrics
    const quarterResults = await Promise.allSettled(
      quarterMetrics.map((metric) => {
        const url = `https://graph.${platform}.com/v23.0/${pageId}/insights?metric=${metric.metric}&since=${metric.since}&until=${metric.until}&period=${metric.period}&access_token=${accessToken}`;
        return fetch(url).then((res) => res.json()).then(data => ({
          ...data,
          metricName: metric.name,
          baseMetric: metric.metric
        }));
      })
    );

    // Combine all results
    const allResults = [...regularResults, ...quarterResults];

    const structuredData: Record<
      string,
      Record<string, { values: any[]; title: string; description: string }>
    > = {};

    // Process regular metrics
    regularResults.forEach((result, index) => {
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

    // Process quarter metrics
    quarterResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value?.data) {
        const metricName = result.value.metricName;
        const baseMetric = result.value.baseMetric;
        result.value.data.forEach((metric: any) => {
          const { period, values, title, description } = metric;
          if (!structuredData[metricName]) structuredData[metricName] = {};
          const formattedValues = values.map((v: any) => ({
            value: v.value,
            endTime: v.end_time
              ? new Date(v.end_time).toISOString().split("T")[0]
              : null,
          }));
          
          // Generate appropriate title and description based on the base metric
          let displayTitle = title;
          let displayDescription = description;
          
          if (!title) {
            const quarterName = metricName.replace(`${baseMetric}_`, '').replace('_', ' ');
            displayTitle = `${baseMetric.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} - ${quarterName}`;
          }
          
          if (!description) {
            const quarterName = metricName.replace(`${baseMetric}_`, '').replace('_', ' ');
            displayDescription = `${baseMetric.replace('_', ' ')} data for ${quarterName}`;
          }
          
          structuredData[metricName][period] = {
            values: formattedValues,
            title: displayTitle,
            description: displayDescription,
          };
        });
      } else {
        const failedMetric = quarterMetrics[index];
        console.warn(`Failed to fetch ${failedMetric.name}:`, result);
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
      recentPost: recentPost.data ? { data: recentPost.data } : null,
    };

    // Check if data has changed before caching
    if (!cachedData || hasDataChanged(cachedData, newData)) {
      await redis.setex(cacheKey, 300, JSON.stringify(newData)); // Cache for 5 minutes
    }

    // console.log("Meta final response:", JSON.stringify(newData, null, 2));
    console.log("=== Facebook Stats API Completed Successfully ===");
    res.status(200).json(newData);
  } catch (error) {
    console.error("Error fetching Facebook stats:", error);
    console.log("=== Facebook Stats API Failed ===");
    res.status(500).json({ error: "Failed to fetch Facebook stats" });
  }
}
