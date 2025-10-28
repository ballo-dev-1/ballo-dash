import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFacebookAccessToken } from "@/lib/facebook";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { platform, pageId, metric, since, until, datePreset } = req.query;

  if (
    typeof platform !== "string" ||
    typeof pageId !== "string" ||
    typeof metric !== "string"
  ) {
    return res.status(400).json({ error: "Missing required parameters" });
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

    // Fetch Facebook access token directly from database
    // console.log("Fetching Facebook access token from database for metric...");
    // console.log("   User Email:", session.user.email);
    // console.log("   Company ID:", companyId);
    // console.log("   Metric:", metric);
    
    const accessToken = await getFacebookAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "Facebook access token not found in database" });
    }

    console.log("✅ Retrieved Facebook access token from database for metric, company:", companyId);

    const timeParams = new URLSearchParams();
    if (since) timeParams.append("since=", since.toString());
    if (until) timeParams.append("until=", until.toString());
    if (datePreset) timeParams.append("datePreset", datePreset.toString());

    const url = `https://graph.${platform}.com/v23.0/${pageId}/insights?metric=${metric}&datePreset=${datePreset}&access_token=${accessToken}&${timeParams.toString()}`;
    
    const fetchRes = await fetch(url);

    if (!fetchRes.ok) {
      throw new Error(`Failed to fetch metric ${metric}: ${fetchRes.statusText}`);
    }

    const data = await fetchRes.json();
    
    // Structure the data in FLAT format (no period nesting) - use 'day' period by default
    let metricResult: { values: any[]; title: string; description: string } | null = null;
    
    if (data.data) {
      // Find the 'day' period data, or use 'lifetime' for cumulative metrics like page_likes
      const isDayMetric = data.data.find((m: any) => m.period === 'day');
      const isLifetimeMetric = data.data.find((m: any) => m.period === 'lifetime');
      
      const metricData = isDayMetric || isLifetimeMetric || data.data[0];
      
      if (metricData) {
        const { values, title, description } = metricData;
        const formattedValues = values.map((v: any) => ({
          date: v.end_time
            ? new Date(v.end_time).toISOString().split("T")[0]
            : null,
          value: v.value,
        }));
        
        metricResult = {
          values: formattedValues,
          title: title || metric,
          description: description || `${metric} metric`,
        };
      }
    }

    return res.status(200).json(metricResult);
  } catch (error) {
    console.error(`Error fetching metric ${metric}:`, error);
    res.status(500).json({ error: `Failed to fetch metric ${metric}` });
  }
} 