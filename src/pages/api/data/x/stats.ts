// src/pages/api/data/x/stats.ts
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

    // Check if we have fresh cached data
    const cachedData = await socialMediaCacheService.getData(
      session.user.companyId,
      'X',
      cleanUsername
    );

    if (cachedData && cachedData.fetchStatus === 'SUCCESS') {
      const cacheAgeMinutes = Math.floor((Date.now() - new Date(cachedData.lastFetchedAt).getTime()) / (1000 * 60));
      console.log("📦 X API - Serving fresh cached data:", {
        username: cleanUsername,
        lastFetched: cachedData.lastFetchedAt,
        cacheAge: cacheAgeMinutes + "m ago"
      });
      return res.status(200).json(cachedData.data);
    }

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    // Fetch X access token directly from database
    const accessToken = await getXAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ 
        error: "X access token not found in database",
        details: "No X integration found or access token is missing. Please set up an X integration first."
      });
    }

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
          // When unauthorized, try to return cached data instead
          console.log("📦 X API unauthorized, attempting to serve cached data");
          const cachedData401 = await socialMediaCacheService.getData(
            session.user.companyId,
            'X',
            cleanUsername
          );
          
          if (cachedData401 && cachedData401.fetchStatus === 'SUCCESS') {
            const cacheAgeMinutes401 = Math.floor((Date.now() - new Date(cachedData401.lastFetchedAt).getTime()) / (1000 * 60));
            console.log("📦 X API 401 Error - Serving cached data:", {
              username: cleanUsername,
              lastFetched: cachedData401.lastFetchedAt,
              cacheAge: cacheAgeMinutes401 + "m ago"
            });
            const responseWithCache = {
              ...cachedData401.data,
              _cached: true,
              _fetchStatus: 'SUCCESS',
              _lastFetchedAt: cachedData401.lastFetchedAt,
              _message: 'Showing cached data due to X API authorization failure'
            };
            return res.status(200).json(responseWithCache);
          } else {
            return res.status(401).json({ 
              error: "Unauthorized: Invalid or expired access token from integration.",
              details: "The access token in your X integration may be expired or invalid. Please refresh it."
            });
          }
        case 403:
          // When forbidden, try to return cached data instead
          console.log("📦 X API forbidden, attempting to serve cached data");
          const cachedData403 = await socialMediaCacheService.getData(
            session.user.companyId,
            'X',
            cleanUsername
          );
          
          if (cachedData403 && cachedData403.fetchStatus === 'SUCCESS') {
            const cacheAgeMinutes403 = Math.floor((Date.now() - new Date(cachedData403.lastFetchedAt).getTime()) / (1000 * 60));
            console.log("📦 X API 403 Error - Serving cached data:", {
              username: cleanUsername,
              lastFetched: cachedData403.lastFetchedAt,
              cacheAge: cacheAgeMinutes403 + "m ago"
            });
            const responseWithCache = {
              ...cachedData403.data,
              _cached: true,
              _fetchStatus: 'SUCCESS',
              _lastFetchedAt: cachedData403.lastFetchedAt,
              _message: 'Showing cached data due to X API permission restrictions'
            };
            return res.status(200).json(responseWithCache);
          } else {
            return res.status(403).json({ 
              error: "Forbidden: Your access token doesn't have permission to access this endpoint.",
              details: "Check your X app permissions in the X Developer Portal"
            });
          }
        case 404:
          // When user not found, try to return cached data instead
          console.log("📦 X API user not found, attempting to serve cached data");
          const cachedData404 = await socialMediaCacheService.getData(
            session.user.companyId,
            'X',
            cleanUsername
          );
          
          if (cachedData404 && cachedData404.fetchStatus === 'SUCCESS') {
            const cacheAgeMinutes404 = Math.floor((Date.now() - new Date(cachedData404.lastFetchedAt).getTime()) / (1000 * 60));
            console.log("📦 X API 404 Error - Serving cached data:", {
              username: cleanUsername,
              lastFetched: cachedData404.lastFetchedAt,
              cacheAge: cacheAgeMinutes404 + "m ago"
            });
            const responseWithCache = {
              ...cachedData404.data,
              _cached: true,
              _fetchStatus: 'SUCCESS',
              _lastFetchedAt: cachedData404.lastFetchedAt,
              _message: 'Showing cached data due to X user not found (may be private)'
            };
            return res.status(200).json(responseWithCache);
          } else {
            return res.status(404).json({ 
              error: "User not found: The specified username doesn't exist or is private.",
              details: `Username: ${cleanUsername}`
            });
          }
        case 429:
          // When rate limited, try to return cached data instead
          console.log("📦 X API rate limited, attempting to serve cached data");
          const cachedData = await socialMediaCacheService.getData(
            session.user.companyId,
            'X',
            cleanUsername
          );
          
          if (cachedData && cachedData.fetchStatus === 'SUCCESS') {
            const cacheAgeMinutes = Math.floor((Date.now() - new Date(cachedData.lastFetchedAt).getTime()) / (1000 * 60));
            console.log("📦 X API 429 Rate Limited - Serving cached data:", {
              username: cleanUsername,
              lastFetched: cachedData.lastFetchedAt,
              cacheAge: cacheAgeMinutes + "m ago"
            });
            // Add cache metadata to response
            const responseWithCache = {
              ...cachedData.data,
              _cached: true,
              _fetchStatus: 'SUCCESS',
              _lastFetchedAt: cachedData.lastFetchedAt,
              _message: 'Showing cached data due to X API rate limiting'
            };
            return res.status(200).json(responseWithCache);
          } else {
            console.log("📦 X API 429 Error - No cached data available, returning error");
            return res.status(429).json({ 
              error: "Rate limited: Too many requests to X API.",
              details: "Wait a few minutes before trying again. No cached data available."
            });
          }
        default:
          // For any other error, try to return cached data instead
          console.log(`📦 X API error ${xApiResponse.status}, attempting to serve cached data`);
          const cachedDataDefault = await socialMediaCacheService.getData(
            session.user.companyId,
            'X',
            cleanUsername
          );
          
          if (cachedDataDefault && cachedDataDefault.fetchStatus === 'SUCCESS') {
            const cacheAgeMinutesDefault = Math.floor((Date.now() - new Date(cachedDataDefault.lastFetchedAt).getTime()) / (1000 * 60));
            console.log("📦 X API Error " + xApiResponse.status + " - Serving cached data:", {
              username: cleanUsername,
              lastFetched: cachedDataDefault.lastFetchedAt,
              cacheAge: cacheAgeMinutesDefault + "m ago"
            });
            const responseWithCache = {
              ...cachedDataDefault.data,
              _cached: true,
              _fetchStatus: 'SUCCESS',
              _lastFetchedAt: cachedDataDefault.lastFetchedAt,
              _message: "Showing cached data due to X API error (" + xApiResponse.status + ")"
            };
            return res.status(200).json(responseWithCache);
          } else {
            return res.status(xApiResponse.status).json({ 
              error: `X API error: ${xApiResponse.status}`,
              details: xApiResponse.statusText
            });
          }
      }
    }
    
    const data = await xApiResponse.json();
    
    // Validate response structure
    if (!data || !data.data || !data.data.username) {
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
    
    // Store successful result in cache
    try {
      await socialMediaCacheService.storeData(
        session.user.companyId,
        'X',
        cleanUsername,
        result,
        'SUCCESS'
      );
    } catch (cacheError) {
      // Don't fail the request if caching fails
    }
    
    return res.status(200).json(result);

  } catch (error: any) {
    // If there's an internal error, try to return cached data instead
    console.log("📦 X API internal error, attempting to serve cached data");
    
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session?.user?.companyId) {
        const { username } = req.query;
        const cleanUsername = username ? (username as string).replace('@', '').trim() : '';
        
        if (cleanUsername) {
          const cachedData = await socialMediaCacheService.getData(
            session.user.companyId,
            'X',
            cleanUsername
          );
          
          if (cachedData && cachedData.fetchStatus === 'SUCCESS') {
            const cacheAgeMinutesInternal = Math.floor((Date.now() - new Date(cachedData.lastFetchedAt).getTime()) / (1000 * 60));
            console.log("📦 X API Internal Error - Serving cached data:", {
              username: cleanUsername,
              lastFetched: cachedData.lastFetchedAt,
              cacheAge: cacheAgeMinutesInternal + "m ago"
            });
            const responseWithCache = {
              ...cachedData.data,
              _cached: true,
              _fetchStatus: 'SUCCESS',
              _lastFetchedAt: cachedData.lastFetchedAt,
              _message: 'Showing cached data due to internal server error'
            };
            return res.status(200).json(responseWithCache);
          }
        }
      }
    } catch (cacheError) {
      console.log("📦 Failed to retrieve cached data during error:", cacheError);
    }
    
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
