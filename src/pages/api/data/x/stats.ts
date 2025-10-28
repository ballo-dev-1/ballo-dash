// src/pages/api/data/x/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getXAccessToken } from "@/lib/x";
import { socialMediaCacheService } from "@/services/socialMediaCacheService";
import { XStatsResponseSchema, X_METRICS } from "@/types/x";
import { createAccountInfo, createDateRange, createCacheMetadata, wrapMetric, createEmptyDateRange } from "@/lib/stats-utils";

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
              cache: {
                cached: true,
                fetchStatus: 'SUCCESS' as const,
                lastFetchedAt: cachedData401.lastFetchedAt,
                message: 'Showing cached data due to X API authorization failure',
              },
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
              cache: {
                cached: true,
                fetchStatus: 'SUCCESS' as const,
                lastFetchedAt: cachedData403.lastFetchedAt,
                message: 'Showing cached data due to X API permission restrictions',
              },
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
              cache: {
                cached: true,
                fetchStatus: 'SUCCESS' as const,
                lastFetchedAt: cachedData404.lastFetchedAt,
                message: 'Showing cached data due to X user not found (may be private)',
              },
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
              cache: {
                cached: true,
                fetchStatus: 'SUCCESS' as const,
                lastFetchedAt: cachedData.lastFetchedAt,
                message: 'Showing cached data due to X API rate limiting',
              },
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
              cache: {
                cached: true,
                fetchStatus: 'SUCCESS' as const,
                lastFetchedAt: cachedDataDefault.lastFetchedAt,
                message: "Showing cached data due to X API error (" + xApiResponse.status + ")",
              },
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
    
    // Build standardized metrics structure (no period nesting)
    const standardizedMetrics: Record<string, any> = {
      followers: wrapMetric(
        data.data.public_metrics?.followers_count || 0,
        'followers'
      ),
      following: wrapMetric(
        data.data.public_metrics?.following_count || 0,
        'following'
      ),
      tweet_count: wrapMetric(
        data.data.public_metrics?.tweet_count || 0,
        'tweet_count'
      ),
      listed_count: wrapMetric(
        data.data.public_metrics?.listed_count || 0,
        'listed_count'
      ),
      like_count: wrapMetric(
        data.data.public_metrics?.like_count || 0,
        'like_count'
      ),
      media_count: wrapMetric(
        data.data.public_metrics?.media_count || 0,
        'media_count'
      ),
    };

    // Transform the response to standardized format
    const result = {
      platform: 'x',
      accountInfo: createAccountInfo({
        id: data.data.id,
        name: data.data.name,
        profilePicture: data.data.profile_image_url || null,
        biography: data.data.description || null,
        creationDate: null,
        verified: data.data.verified || null,
      }),
      metrics: standardizedMetrics,
      dateRange: createEmptyDateRange(Array.from(X_METRICS)),
      recentPost: null,
      rawPageStats: null,
      cache: createCacheMetadata({
        cached: false,
        fetchStatus: 'SUCCESS',
        lastFetchedAt: new Date().toISOString(),
      }),
    };
    
    // Validate with Zod schema
    try {
      const validated = XStatsResponseSchema.parse(result);
      
      // Store validated result in cache
      try {
        await socialMediaCacheService.storeData(
          session.user.companyId,
          'X',
          cleanUsername,
          validated,
          'SUCCESS'
        );
      } catch (cacheError) {
        console.error("[X Stats] Cache error:", cacheError);
        // Don't fail the request if caching fails
      }
      
      return res.status(200).json(validated);
    } catch (validationError) {
      console.error("[X Stats] Response validation failed:", validationError);
      // Store and return data anyway but log the validation error
      try {
        await socialMediaCacheService.storeData(
          session.user.companyId,
          'X',
          cleanUsername,
          result,
          'SUCCESS'
        );
      } catch (cacheError) {
        // Ignore cache errors
      }
      return res.status(200).json(result);
    }

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
              cache: {
                cached: true,
                fetchStatus: 'SUCCESS' as const,
                lastFetchedAt: cachedData.lastFetchedAt,
                message: 'Showing cached data due to internal server error',
              },
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
