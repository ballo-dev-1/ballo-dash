// src/pages/api/data/x/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getXAccessToken } from "@/lib/x";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user session to verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      console.log("❌ X Posts API: No session or user email found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { accountId, username } = req.query;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    // Check if we have fresh cached data
    const cacheKey = `x-posts-${accountId}`;
    const cachedData = await socialMediaCacheService.getData(
      companyId,
      'X',
      cacheKey
    );

    if (cachedData && cachedData.fetchStatus === 'SUCCESS') {
      const cacheAgeMinutes = Math.floor((Date.now() - new Date(cachedData.lastFetchedAt).getTime()) / (1000 * 60));
      console.log("📦 X Posts API - Serving fresh cached data:", {
        accountId,
        lastFetched: cachedData.lastFetchedAt,
        cacheAge: cacheAgeMinutes + "m ago"
      });
      return res.status(200).json(cachedData.data);
    }

    // Fetch X access token directly from database
    const accessToken = await getXAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ 
        error: "X access token not found in database",
        details: "No X integration found or access token is missing. Please set up an X integration first."
      });
    }

    // Make API call to X API to fetch user's tweets
    const tweetsResponse = await fetch(`https://api.x.com/2/users/${accountId}/tweets?tweet.fields=created_at,public_metrics,text,attachments&max_results=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!tweetsResponse.ok) {
      console.error(`❌ X Posts API error: ${tweetsResponse.status} - ${tweetsResponse.statusText}`);
      
      // Handle different error status codes
      switch (tweetsResponse.status) {
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
            error: "User not found: The specified account ID doesn't exist or is private.",
            details: `Account ID: ${accountId}`
          });
        case 429:
          return res.status(429).json({ 
            error: "Rate limited: Too many requests to X API.",
            details: "Wait a few minutes before trying again."
          });
        default:
          return res.status(tweetsResponse.status).json({ 
            error: `X API error: ${tweetsResponse.status}`,
            details: tweetsResponse.statusText
          });
      }
    }
    
    const tweetsData = await tweetsResponse.json();
    
    // Validate response structure
    if (!tweetsData || !tweetsData.data) {
      return res.status(500).json({ 
        error: "Invalid response from X API",
        details: "The API response doesn't contain the expected tweets data structure"
      });
    }

    const tweets = tweetsData.data || [];

    // Transform tweets to match expected format
    const transformedTweets = tweets.map((tweet: any) => ({
      id: tweet.id,
      message: tweet.text || "",
      created_time: new Date(tweet.created_at).toISOString(),
      media_type: tweet.attachments?.media_keys ? "MEDIA" : "TEXT",
      public_metrics: {
        retweet_count: tweet.public_metrics?.retweet_count || 0,
        like_count: tweet.public_metrics?.like_count || 0,
        reply_count: tweet.public_metrics?.reply_count || 0,
        quote_count: tweet.public_metrics?.quote_count || 0,
        impression_count: tweet.public_metrics?.impression_count || 0
      }
    }));

    const response = {
      platform: "x",
      accountId: accountId,
      pageInfo: {
        name: username || "X User",
        profilePicture: null,
        id: accountId,
        username: username || "x_user",
        followers_count: 0,
        media_count: tweets.length
      },
      posts: transformedTweets,
      total: tweets.length
    };
    
    // Store successful result in cache
    try {
      await socialMediaCacheService.storeData(
        companyId,
        'X',
        cacheKey,
        response,
        'SUCCESS'
      );
    } catch (cacheError) {
      // Don't fail the request if caching fails
      console.log("Failed to cache X posts data:", cacheError);
    }
    
    res.status(200).json(response);

  } catch (error: any) {
    console.error("Error fetching X posts:", error);
    res.status(500).json({ 
      error: "Failed to fetch X posts",
      details: error.message 
    });
  }
}
