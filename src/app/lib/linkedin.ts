// File: lib/linkedin.ts
import axios from "axios";
import { PlatformAnalytics } from "./types";

export async function fetchLinkedInAnalytics(
  accessToken: string,
  organizationId: string
): Promise<PlatformAnalytics> {
  try {
    const url = `https://api.linkedin.com/v2/organizationPageStatistics?q=organization&organization=${organizationId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    const stats = response.data.elements[0];
    const metrics = [
      {
        type: "impressions",
        value: stats.totalPageStatistics.views.pageViews.total || 0,
        date: new Date().toISOString().split("T")[0],
      },
      {
        type: "clicks",
        value: stats.totalPageStatistics.clicks.total || 0,
        date: new Date().toISOString().split("T")[0],
      },
      {
        type: "followers",
        value: stats.totalPageStatistics.followers.total || 0,
        date: new Date().toISOString().split("T")[0],
      },
    ];

    return {
      platform: "linkedin",
      accountId: organizationId,
      metrics,
    };
  } catch (error) {
    console.error("LinkedIn API error:", error);
    throw new Error("Failed to fetch LinkedIn analytics");
  }
}
