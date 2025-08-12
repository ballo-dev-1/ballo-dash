import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
    // Get user session to find access tokens
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const accessToken = session.user.accessTokens?.FACEBOOK;
    if (!accessToken) {
      return res.status(400).json({ error: "Facebook access token not found in session" });
    }

    // console.log("Retrieved Facebook access token from session for metric:", metric, session.user.email);

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
    
    // Structure the data similar to the main stats endpoint
    const structuredData: Record<string, { values: any[]; title: string; description: string }> = {};
    
    if (data.data) {
      data.data.forEach((metricData: any) => {
        const { name, period, values, title, description } = metricData;
        const formattedValues = values.map((v: any) => ({
          value: v.value,
          endTime: v.end_time
            ? new Date(v.end_time).toISOString().split("T")[0]
            : null,
        }));
        structuredData[period] = {
          values: formattedValues,
          title,
          description,
        };
      });
    }

    return res.status(200).json(structuredData);
  } catch (error) {
    console.error(`Error fetching metric ${metric}:`, error);
    res.status(500).json({ error: `Failed to fetch metric ${metric}` });
  }
} 