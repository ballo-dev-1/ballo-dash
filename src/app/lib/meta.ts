// pages/api/meta/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId } = req.query;

  // Replace with your real logic for accessToken lookup (DB or env var)
  const accessToken = process.env.META_ACCESS_TOKEN;

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/insights?metric=page_impressions,page_views_total&access_token=${accessToken}`
    );
    const data = await fbRes.json();

    res.status(200).json({
      pageId,
      impressions:
        data.data?.find((d: any) => d.name === "page_impressions")?.values?.[0]
          ?.value ?? 0,
      engagement:
        data.data?.find((d: any) => d.name === "page_engaged_users")
          ?.values?.[0]?.value ?? 0,
      likes:
        data.data?.find((d: any) => d.name === "page_fans")?.values?.[0]
          ?.value ?? 0,
      views:
        data.data?.find((d: any) => d.name === "page_views_total")?.values?.[0]
          ?.value ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve Meta stats" });
  }
}
