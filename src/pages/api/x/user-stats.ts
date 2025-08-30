// src/pages/api/x/user-stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user session to verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      console.log("❌ API: No session or user email found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, platform, since, until, datePreset, accessToken } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
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

    console.log("🐦 X API: Fetching stats for username:", username);

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
    
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("❌ X API: Error fetching user stats:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
