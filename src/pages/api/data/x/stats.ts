// src/pages/api/data/x/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getXAccessToken } from "@/lib/x";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user session to verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      console.log("❌ X API: No session or user email found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, platform, since, until, date_preset } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Validate username format (basic validation)
    if (typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: "Username must be a non-empty string" });
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim();
    if (cleanUsername.length === 0) {
      return res.status(400).json({ error: "Invalid username format" });
    }

    console.log("🐦 X API: Fetching stats for username:", cleanUsername);

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    // Fetch X access token directly from database
    console.log("Fetching X access token from database for stats...");
    console.log("   User Email:", session.user.email);
    console.log("   Company ID:", companyId);
    
    const accessToken = await getXAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ 
        error: "X access token not found in database",
        details: "No X integration found or access token is missing. Please set up an X integration first."
      });
    }

    console.log("✅ Retrieved X access token: ", accessToken);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");

    // Make real API call to X API using the integration's access token
    const xApiResponse = await fetch(`https://api.x.com/2/users/by/username/${cleanUsername}?user.fields=profile_image_url,description,public_metrics,verified`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!xApiResponse.ok) {
      console.error(`❌ X API error: ${xApiResponse.status} - ${xApiResponse.statusText}`);
      
      // Handle different error status codes
      switch (xApiResponse.status) {
        case 401:
          return res.status(401).json({ 
            error: "Unauthorized: Invalid or expired access token from integration.",
            details: "The access token in your X integration may be expired or invalid. Please refresh it."
          });
        case 403:
          return res.status(403).json({ 
            error: "Forbidden: Your access token doesn't have permission to access this endpoint.",
            details: "Check your X app permissions in the X Developer Portal"
          });
        case 404:
          return res.status(404).json({ 
            error: "User not found: The specified username doesn't exist or is private.",
            details: `Username: ${cleanUsername}`
          });
        case 429:
          return res.status(429).json({ 
            error: "Rate limited: Too many requests to X API.",
            details: "Wait a few minutes before trying again"
          });
        default:
          return res.status(xApiResponse.status).json({ 
            error: `X API error: ${xApiResponse.status}`,
            details: xApiResponse.statusText
          });
      }
    }
    
    const data = await xApiResponse.json();
    console.log("✅ X API: Real response received:", data);
    
    // Validate response structure
    if (!data || !data.data || !data.data.username) {
      console.error("❌ X API: Invalid response structure:", data);
      return res.status(500).json({ 
        error: "Invalid response from X API",
        details: "The API response doesn't contain the expected user data structure"
      });
    }
    
    // Transform the response to match our expected format
    const result = {
      platform: platform || 'x',
      userInfo: {
        username: data.data.username,
        id: data.data.id,
        name: data.data.name,
        description: data.data.description || "",
        profileImageUrl: data.data.profile_image_url || "",
        verified: data.data.verified || false,
      },
      metrics: {
        followers: data.data.public_metrics?.followers_count || 0,
        following: data.data.public_metrics?.following_count || 0,
        tweetCount: data.data.public_metrics?.tweet_count || 0,
        listedCount: data.data.public_metrics?.listed_count || 0,
        likeCount: data.data.public_metrics?.like_count || 0,
        mediaCount: data.data.public_metrics?.media_count || 0,
      },
      since: since || "",
      until: until || "",
      datePreset: date_preset || ""
    };
    
    return res.status(200).json(result);

  } catch (error: any) {
    console.error("❌ X API: Error fetching user stats:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
