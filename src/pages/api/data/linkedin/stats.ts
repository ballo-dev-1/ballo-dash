import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import { JSDOM } from "jsdom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("LinkedIn Stats API - Request received");
  const rawOrgId = req.query.organizationId;
  const organizationId = Array.isArray(rawOrgId) ? rawOrgId[0] : rawOrgId;
  const { since, until, datePreset } = req.query;

  if (!organizationId) {
    return res.status(400).json({ error: "Missing organizationId" });
  }

  try {
    // Get user session to find access tokens
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // console.log("🔍 LinkedIn Stats API - Session verification for user:", session.user.email);
    // console.log("   User ID:", session.user.id);
    // console.log("   Company ID:", session.user.companyId);
    // console.log("   Available access tokens:", Object.keys(session.user.accessTokens || {}));
    

    const accessToken = session.user.accessTokens?.LINKEDIN;
    if (!accessToken) {
      // console.error("❌ LinkedIn access token not found in session for user:", session.user.email);
      return res.status(400).json({ error: "LinkedIn access token not found in session" });
    }

    // console.log("✅ Retrieved LinkedIn access token from session for user:", session.user.email);
    // console.log("   Token preview:", accessToken.substring(0, 20) + "...");

    const orgUrn = `urn:li:organization:${organizationId}`;
    const encodedOrgUrn = encodeURIComponent(orgUrn);

    // Fetch Followers Data
    const followersUrl = `${LINKEDIN_API_BASE}/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=${encodedOrgUrn}`;
    const followersRes = await fetch(followersUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const followersData = await followersRes.json();

    // Fetch Organization Info
    const infoUrl = `${LINKEDIN_API_BASE}/organizations/${organizationId}`;
    const infoRes = await fetch(infoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const orgInfoData = await infoRes.json();

    // Fetch Impressions and Share Statistics
    const statsUrl = `${LINKEDIN_API_BASE}/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodedOrgUrn}`;
    const statsRes = await fetch(statsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const statsData = await statsRes.json();
    const shareStats = statsData.elements?.[0]?.totalShareStatistics || {};

    // Scrape fallback follower count
    const followWidgetUrl = `https://www.linkedin.com/pages-extensions/FollowCompany?id=${organizationId}&counter=bottom`;
    const htmlRes = await fetch(followWidgetUrl);
    const htmlText = await htmlRes.text();
    const dom = new JSDOM(htmlText);
    const followerDiv = dom.window.document.querySelector(".follower-count");
    const scrapedFollowerCount = followerDiv?.textContent?.trim() || null;

    // Final response object
    const finalResponse = {
      organizationInfo: {
        id: organizationId,
        name: orgInfoData.localizedName || orgInfoData.name || "Unknown",
      },
      platform: "linkedin",
      metrics: {
        page_follows: scrapedFollowerCount,
        // segmented_followers: followersData,
        since,
        until,
        datePreset,
        impressions: {
          impressionCount: shareStats.impressionCount || 0,
          uniqueImpressionsCount: shareStats.uniqueImpressionsCount || 0,
          clickCount: shareStats.clickCount || 0,
          likeCount: shareStats.likeCount || 0,
          commentCount: shareStats.commentCount || 0,
          shareCount: shareStats.shareCount || 0,
          shareMentionsCount: shareStats.shareMentionsCount || 0,
          commentMentionsCount: shareStats.commentMentionsCount || 0,
          engagement: shareStats.engagement || 0,
        },
      },
    };

    console.log("LinkedIn final response:", JSON.stringify(finalResponse, null, 2));
    res.status(200).json(finalResponse);
  } catch (error: any) {
    console.error("LinkedIn API Error:", error);
    res.status(500).json({
      error: "Failed to fetch LinkedIn data",
      details: error.message,
    });
  }
}
