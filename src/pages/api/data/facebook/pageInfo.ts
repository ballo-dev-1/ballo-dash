import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFacebookAccessToken } from "@/lib/facebook";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { platform, pageId } = req.query;

  if (
    typeof platform !== "string" ||
    typeof pageId !== "string"
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
    console.log("Fetching Facebook access token from database for page info...");
    console.log("   User Email:", session.user.email);
    console.log("   Company ID:", companyId);
    console.log("   Platform:", platform);
    console.log("   Page ID:", pageId);
    
    const accessToken = await getFacebookAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "Facebook access token not found in database" });
    }

    console.log("✅ Retrieved Facebook access token from database for page info, company:", companyId);

    const pageInfoRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}?fields=name&access_token=${accessToken}`
    );

    if (!pageInfoRes.ok) {
      throw new Error(`Failed to fetch page info: ${pageInfoRes.statusText}`);
    }

    const pageInfo = await pageInfoRes.json();
    res.status(200).json(pageInfo);
  } catch (error) {
    console.error("Error fetching page info:", error);
    res.status(500).json({ error: "Failed to fetch page info" });
  }
} 