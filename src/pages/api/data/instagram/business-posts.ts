import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getInstagramAccessToken, getStoredInstagramAccountId, getInstagramUsername } from "@/lib/instagram";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accountId, username } = req.query;

  if (!accountId) {
    return res.status(400).json({ error: "Missing accountId" });
  }

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
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
    
    const accessToken = await getInstagramAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "Instagram access token not found in database" });
    }

    console.log("✅ Retrieved Instagram access token from database for business posts, company:", companyId);

    // Get the stored account ID if not provided
    const AccountId = await getStoredInstagramAccountId(companyId);
    console.log("🎒 Instagram account ID:", AccountId);

    if (!AccountId) {
      return res.status(400).json({ error: "Instagram account ID not found" });
    }

    const username = await getInstagramUsername(AccountId, accessToken);

    // Use the business_discovery API to fetch posts
    const businessDiscoveryUrl = `https://graph.facebook.com/v19.0/${AccountId}?fields=business_discovery.username(${username}){media{caption,id,media_type,media_url,timestamp,like_count,comments_count}}&access_token=${accessToken}`;
    
    console.log("🔍 Fetching Instagram business posts from:", businessDiscoveryUrl);

    const postsRes = await fetch(businessDiscoveryUrl, {
      headers: {
        'User-Agent': 'Ballo-Dashboard/1.0'
      }
    });

    const postsJson = await postsRes.json();
    
    if (!postsRes.ok) {
      console.error("Failed to fetch Instagram business posts:", postsJson.error);
      return res.status(500).json({ 
        error: "Failed to fetch Instagram business posts",
        details: postsJson.error?.message || "Unknown error"
      });
    }

    console.log("✅ Instagram business posts API response:", postsJson);

    // Extract posts from business_discovery response
    const businessDiscovery = postsJson.business_discovery;
    const posts = businessDiscovery?.media?.data || [];

    // Transform posts to match expected format
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      message: post.caption || "",
      created_time: post.timestamp,
      media_type: post.media_type,
      media_url: post.media_url,
      like_count: post.like_count || 0,
      comments_count: post.comments_count || 0,
      // Add insights structure to match Facebook format
      insights: {
        post_impressions: "-", // Not available in business_discovery API
        comment: post.comments_count || 0,
        share: 0, // Not available in business_discovery API
        post_reactions_like_total: post.like_count || 0,
        post_reactions_love_total: 0, // Not available in business_discovery API
        post_reactions_wow_total: 0,
        post_reactions_haha_total: 0,
        post_reactions_sorry_total: 0,
        post_reactions_anger_total: 0,
      }
    }));

    // Get account info
    const accountInfo = {
      name: businessDiscovery?.username || username,
      profilePicture: businessDiscovery?.profile_picture_url || null,
      id: businessDiscovery?.id || AccountId,
      username: businessDiscovery?.username || username,
      followers_count: businessDiscovery?.followers_count || 0,
      media_count: businessDiscovery?.media_count || 0,
    };

    res.status(200).json({
      platform: "instagram",
      accountId: AccountId,
      pageInfo: accountInfo,
      posts: transformedPosts,
      total: posts.length,
      business_discovery: businessDiscovery
    });

  } catch (error: any) {
    console.error("Error fetching Instagram business posts:", error);
    res.status(500).json({ 
      error: "Failed to fetch Instagram business posts",
      details: error.message 
    });
  }
}
