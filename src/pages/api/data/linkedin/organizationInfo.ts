import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getLinkedInAccessToken } from "@/lib/linkedin";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawOrgId = req.query.organizationId;
  const organizationId = Array.isArray(rawOrgId) ? rawOrgId[0] : rawOrgId;

  console.log(`\n=== 🏢 LinkedIn Organization Info API Call ===`);
  console.log(`📋 Request Parameters:`);
  console.log(`   organizationId: ${organizationId}`);

  if (!organizationId) {
    console.error(`❌ Missing organizationId parameter`);
    return res.status(400).json({ error: "Missing organizationId" });
  }

  try {
    // Get user session to find company ID
    const session = await getServerSession(req, res, authOptions);
    console.log("LinkedIn Organization Info API - Session check");
    console.log("   Session exists:", !!session);
    console.log("   User email:", session?.user?.email);
    console.log("   Company ID:", session?.user?.companyId);
    
    if (!session?.user?.email) {
      console.error("❌ No session or user email found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      console.error("❌ No company ID found in session for user:", session.user.email);
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    // Fetch LinkedIn access token directly from database
    console.log("Fetching LinkedIn access token from database...");
    console.log("   User Email:", session.user.email);
    console.log("   Company ID:", companyId);
    
    const accessToken = await getLinkedInAccessToken(companyId);
    
    if (!accessToken) {
      console.error("❌ LinkedIn access token not found in database for company:", companyId);
      return res.status(400).json({ error: "LinkedIn access token not found in database" });
    }

    console.log("✅ Retrieved LinkedIn access token from database for company:", companyId);

    console.log(`🏢 Fetching organization info for ID: ${organizationId}`);
    
    // Fetch Organization Info
    const infoUrl = `${LINKEDIN_API_BASE}/organizations/${organizationId}`;
    console.log(`🌐 Organization Info API URL: ${infoUrl}`);
    
    const infoRes = await fetch(infoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    
    console.log(`📡 Organization Info API Response Status: ${infoRes.status}`);
    console.log(`📡 Organization Info API Response Headers:`, Object.fromEntries(infoRes.headers.entries()));
    
    if (infoRes.ok) {
      const orgInfoData = await infoRes.json();
      console.log(`✅ LinkedIn Organization Info API Response:`, JSON.stringify(orgInfoData, null, 2));
      
      const responseData = {
        id: organizationId,
        name: orgInfoData.localizedName || orgInfoData.name || "Unknown",
        localizedName: orgInfoData.localizedName,
        originalName: orgInfoData.name,
        description: orgInfoData.description,
        websiteUrl: orgInfoData.websiteUrl,
        logoUrl: orgInfoData.logoV2?.original?.url,
        industry: orgInfoData.industry,
        companyType: orgInfoData.companyType,
        foundedYear: orgInfoData.foundedYear,
        staffCountRange: orgInfoData.staffCountRange,
        specialties: orgInfoData.specialties,
        locations: orgInfoData.locations
      };
      
      console.log(`📊 Final organization info data:`, responseData);
      console.log(`📤 Sending organization info response:`, responseData);
      console.log(`=== ✅ LinkedIn Organization Info API Call Complete ===\n`);
      
      res.status(200).json(responseData);
    } else {
      const errorText = await infoRes.text();
      console.error(`❌ LinkedIn Organization Info API Error: ${infoRes.status} - ${errorText}`);
      console.log(`=== ❌ LinkedIn Organization Info API Call Failed ===\n`);
      res.status(infoRes.status).json({ 
        error: "Failed to fetch organization info",
        details: errorText
      });
    }
  } catch (error: any) {
    console.error(`\n💥 LinkedIn Organization Info API Error:`, error);
    console.log(`=== ❌ LinkedIn Organization Info API Call Failed ===\n`);
    res.status(500).json({
      error: "Failed to fetch LinkedIn organization info",
      details: error.message,
    });
  }
} 