import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getLinkedInAccessToken, getStoredLinkedInOrganizationId } from "@/lib/linkedin";

interface LinkedInPostInsights {
  share: string;
  totalShareStatistics: {
    uniqueImpressionsCount: number;
    shareCount: number;
    engagement: number;
    clickCount: number;
    likeCount: number;
    impressionCount: number;
    commentCount: number;
  };
  organizationalEntity: string;
}

interface LinkedInInsightsResponse {
  paging: {
    start: number;
    count: number;
    links: any[];
    total: number;
  };
  elements: LinkedInPostInsights[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId, shareIds } = req.query;

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
    
    const accessToken = await getLinkedInAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "LinkedIn access token not found in database" });
    }

    // Get the stored organization ID if not provided
    const storedOrganizationId = await getStoredLinkedInOrganizationId(companyId);
    const finalOrganizationId = (organizationId as string) || storedOrganizationId;

    if (!finalOrganizationId) {
      return res.status(400).json({ error: "LinkedIn organization ID not found" });
    }

    // Parse share IDs from query parameter
    let shareIdList: string[] = [];
    if (shareIds) {
      if (typeof shareIds === 'string') {
        shareIdList = shareIds.split(',');
      } else if (Array.isArray(shareIds)) {
        shareIdList = shareIds as string[];
      }
    }

    if (shareIdList.length === 0) {
      return res.status(400).json({ error: "No share IDs provided" });
    }

    // Format share IDs for LinkedIn API (ensure they have proper URN format)
    const formattedShareIds = shareIdList.map(shareId => {
      // If shareId doesn't start with urn:li:share:, add it
      if (!shareId.startsWith('urn:li:share:')) {
        return `urn:li:share:${shareId}`;
      }
      return shareId;
    });

    // Build the shares parameter for the API call
    const sharesParam = `List(${formattedShareIds.join(',')})`;

    console.log(`🔍 Fetching insights for ${formattedShareIds.length} LinkedIn posts`);

    // Fetch post insights from LinkedIn API
    const insightsRes = await fetch(
      `https://api.linkedin.com/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn%3Ali%3Aorganization%3A${finalOrganizationId}&shares=${encodeURIComponent(sharesParam)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'LinkedIn-Version': '202312'
        }
      }
    );

    const insightsJson = await insightsRes.json();

    if (!insightsRes.ok) {
      console.error("Failed to fetch LinkedIn post insights:", insightsJson);
      return res.status(500).json({ 
        error: "Failed to fetch LinkedIn post insights",
        details: insightsJson.message || "Unknown error"
      });
    }

    // Transform insights data to a more usable format
    const insightsMap: Record<string, LinkedInPostInsights['totalShareStatistics']> = {};
    
    if (insightsJson.elements && Array.isArray(insightsJson.elements)) {
      insightsJson.elements.forEach((element: LinkedInPostInsights) => {
        // Extract share ID from the URN
        const shareId = element.share.replace('urn:li:share:', '');
        insightsMap[shareId] = element.totalShareStatistics;
      });
    }

    res.status(200).json({
      platform: "linkedin",
      organizationId: finalOrganizationId,
      insights: insightsMap,
      total: insightsJson.elements?.length || 0,
      requestedShares: formattedShareIds.length
    });

  } catch (error: any) {
    console.error("Error fetching LinkedIn post insights:", error);
    res.status(500).json({ 
      error: "Failed to fetch LinkedIn post insights",
      details: error.message 
    });
  }
}
