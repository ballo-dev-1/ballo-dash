// src/pages/api/debug/test-instagram-step-by-step.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getInstagramAccessToken, getStoredInstagramAccountId, getInstagramAccountId } from "@/lib/instagram";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const companyId = session.user.companyId;
    const results: any[] = [];

    // Step 1: Check if we can get the company ID
    results.push({
      step: 1,
      description: "Get Company ID",
      status: "success",
      data: { companyId }
    });

    // Step 2: Try to get Instagram access token
    try {
      const accessToken = await getInstagramAccessToken(companyId);
      if (accessToken) {
        results.push({
          step: 2,
          description: "Get Instagram Access Token",
          status: "success",
          data: { 
            hasToken: true, 
            tokenLength: accessToken.length,
            tokenPreview: `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 10)}`
          }
        });
      } else {
        results.push({
          step: 2,
          description: "Get Instagram Access Token",
          status: "error",
          data: { error: "No access token found" }
        });
        return res.json({ results, summary: "Failed at step 2 - no access token" });
      }
    } catch (error: any) {
      results.push({
        step: 2,
        description: "Get Instagram Access Token",
        status: "error",
        data: { error: error.message }
      });
      return res.json({ results, summary: "Failed at step 2 - error getting access token" });
    }

    // Step 3: Check for stored account ID
    try {
      const storedAccountId = await getStoredInstagramAccountId(companyId);
      if (storedAccountId) {
        results.push({
          step: 3,
          description: "Get Stored Account ID",
          status: "success",
          data: { accountId: storedAccountId }
        });
        
        // If we have a stored account ID, we're done
        return res.json({ 
          results, 
          summary: "Success! Using stored account ID",
          accountId: storedAccountId
        });
      } else {
        results.push({
          step: 3,
          description: "Get Stored Account ID",
          status: "info",
          data: { message: "No stored account ID found, will fetch from API" }
        });
      }
    } catch (error: any) {
      results.push({
        step: 3,
        description: "Get Stored Account ID",
        status: "error",
        data: { error: error.message }
      });
      return res.json({ results, summary: "Failed at step 3 - error checking stored account ID" });
    }

    // Step 4: Fetch account ID from Instagram API
    try {
      const accessToken = await getInstagramAccessToken(companyId);
      if (!accessToken) {
        results.push({
          step: 4,
          description: "Fetch Account ID from Instagram API",
          status: "error",
          data: { error: "No access token available for API call" }
        });
        return res.json({ results, summary: "Failed at step 4 - no access token" });
      }

      const accountId = await getInstagramAccountId(accessToken);
      if (accountId) {
        results.push({
          step: 4,
          description: "Fetch Account ID from Instagram API",
          status: "success",
          data: { accountId }
        });
        
        return res.json({ 
          results, 
          summary: "Success! Fetched account ID from Instagram API",
          accountId
        });
      } else {
        results.push({
          step: 4,
          description: "Fetch Account ID from Instagram API",
          status: "error",
          data: { error: "Could not fetch account ID from Instagram API" }
        });
        
        return res.json({ 
          results, 
          summary: "Failed at step 4 - could not fetch account ID from Instagram API"
        });
      }
    } catch (error: any) {
      results.push({
        step: 4,
        description: "Fetch Account ID from Instagram API",
        status: "error",
        data: { error: error.message }
      });
      
      return res.json({ 
        results, 
        summary: "Failed at step 4 - error calling Instagram API"
      });
    }

  } catch (error: any) {
    console.error("❌ Error in test-instagram-step-by-step:", error);
    return res.status(500).json({ 
      error: "Failed to test Instagram integration",
      details: error.message 
    });
  }
}
