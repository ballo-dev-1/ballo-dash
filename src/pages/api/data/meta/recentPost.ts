import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
    // Get user session to find access tokens
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const accessToken = session.user.accessTokens?.FACEBOOK;
    if (!accessToken) {
      return res.status(400).json({ error: "Facebook access token not found in session" });
    }

    // console.log("Retrieved Facebook access token from session for recent post", session.user.email);

    const recentPostRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}/posts?limit=1&access_token=${accessToken}`
    );

    if (!recentPostRes.ok) {
      throw new Error(`Failed to fetch recent post: ${recentPostRes.statusText}`);
    }

    const recentPost = await recentPostRes.json();
    res.status(200).json(recentPost);
  } catch (error) {
    console.error("Error fetching recent post:", error);
    res.status(500).json({ error: "Failed to fetch recent post" });
  }
} 