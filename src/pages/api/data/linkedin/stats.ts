import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import { JSDOM } from "jsdom";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getLinkedInAccessToken } from "@/lib/linkedin";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== LinkedIn Stats API Called ===");
  console.log("LinkedIn Stats API - Request received");
  console.log("Query params:", req.query);
  const rawOrgId = req.query.organizationId;
  const organizationId = Array.isArray(rawOrgId) ? rawOrgId[0] : rawOrgId;
  const { since, until, datePreset } = req.query;

  if (!organizationId) {
    console.log("❌ Missing organizationId");
    return res.status(400).json({ error: "Missing organizationId" });
  }

  console.log("✅ Organization ID:", organizationId);
  console.log("✅ Since:", since);
  console.log("✅ Until:", until);
  console.log("✅ Date Preset:", datePreset);

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

    // Fetch LinkedIn access token directly from database
    console.log("Fetching LinkedIn access token from database for stats...");
    console.log("   User Email:", session.user.email);
    console.log("   Company ID:", companyId);
    
    const accessToken = await getLinkedInAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "LinkedIn access token not found in database" });
    }

    console.log("✅ Retrieved LinkedIn access token: ", accessToken);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");

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
    console.log("🏢 Organization Info:", orgInfoData);

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
    console.log("=== LinkedIn Stats API Completed Successfully ===");
    res.status(200).json(finalResponse);
  } catch (error: any) {
    console.error("LinkedIn API Error:", error);
    console.log("=== LinkedIn Stats API Failed ===");
    res.status(500).json({
      error: "Failed to fetch LinkedIn data",
      details: error.message,
    });
  }
}
