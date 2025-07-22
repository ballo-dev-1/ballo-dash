import { redis } from "@/app/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";

function hasDataChanged(oldData: any, newData: any) {
  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { platform, pageId, accessToken, since, until, datePreset } = req.query;

  if (
    typeof platform !== "string" ||
    typeof pageId !== "string" ||
    typeof accessToken !== "string"
  ) {
    return res.status(400).json({ error: "Missing pageId or accessToken" });
  }

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

  if (!pageInfo.name) {
    return res.status(400).json({ error: "Invalid access token or page ID" });
  }

  if (!recentPost) {
    return { data: {} };
  }

  const newData = {
    pageInfo,
    platform,
    metrics: structuredData,
    recentPost,
  };

  if (!cachedData || hasDataChanged(cachedData, newData)) {
    try {
      await redis.set(cacheKey, JSON.stringify(newData), { ex: 300 });
      await redis.publish(
        "metricsUpdates",
        JSON.stringify({ pageId, updatedAt: new Date().toISOString() })
      );
    } catch (err) {
      console.error("Redis error:", err);
    }
  }

  res.status(200).json(newData);
}
