// File: pages/api/analytics/linkedin.ts
import { fetchLinkedInAnalytics } from "@/app/lib/linkedin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const organizationId = req.query.organizationId as string;

  if (!accessToken || !organizationId) {
    return res
      .status(400)
      .json({ error: "Missing access token or organization ID" });
  }

  try {
    const data = await fetchLinkedInAnalytics(accessToken, organizationId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
