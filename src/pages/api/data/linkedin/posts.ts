import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getLinkedInAccessToken, getStoredLinkedInOrganizationId } from "@/lib/linkedin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId } = req.query;

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

    console.log("✅ Retrieved LinkedIn access token from database for posts, company:", companyId);

    // Get the stored organization ID if not provided
    const storedOrganizationId = await getStoredLinkedInOrganizationId(companyId);
    const finalOrganizationId = (organizationId as string) || storedOrganizationId;

    if (!finalOrganizationId) {
      return res.status(400).json({ error: "LinkedIn organization ID not found" });
    }

    // Fetch organization details to get the actual name
    let organizationName = "LinkedIn Organization";
    try {
      const orgRes = await fetch(
        `https://api.linkedin.com/v2/organizations/${finalOrganizationId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (orgRes.ok) {
        const orgData = await orgRes.json();
        organizationName = orgData.localizedName || orgData.name || "LinkedIn Organization";
        console.log("✅ Retrieved LinkedIn organization name:", organizationName);
      } else {
        console.log("⚠️ Failed to fetch organization details, using default name");
      }
    } catch (orgError) {
      console.log("⚠️ Error fetching organization details:", orgError);
    }

    // Fetch posts from LinkedIn API
    const postsRes = await fetch(
      `https://api.linkedin.com/v2/posts?q=author&author=urn:li:organization:${finalOrganizationId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const postsJson = await postsRes.json();

    if (!postsRes.ok) {
      console.error("Failed to fetch LinkedIn posts:", postsJson);
      return res.status(500).json({ 
        error: "Failed to fetch LinkedIn posts",
        details: postsJson.message || "Unknown error"
      });
    }

    const posts = postsJson.elements || [];

    // Transform posts to match expected format
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      message: post.commentary || "", // LinkedIn uses 'commentary' field for post content
      created_time: new Date(post.createdAt).toISOString(), // Convert timestamp to ISO string
      media_type: post.content?.media?.mediaType || "TEXT",
      media_url: post.content?.media?.url,
      permalink: `https://www.linkedin.com/feed/update/${post.id.replace('urn:li:share:', '').replace('urn:li:ugcPost:', '')}`, // Generate LinkedIn permalink
      author: post.author,
      visibility: post.visibility,
      lifecycleState: post.lifecycleState,
      specificContent: post.content,
      // LinkedIn specific metrics (these would need separate API calls for detailed insights)
      likes: 0, // Would need separate API call
      comments: 0, // Would need separate API call
      shares: 0, // Would need separate API call
      views: 0 // Would need separate API call
    }));

    res.status(200).json({
      platform: "linkedin",
      organizationId: finalOrganizationId,
      pageInfo: {
        name: organizationName,
        profilePicture: null,
        id: finalOrganizationId,
        username: "linkedin_org",
        followers_count: 0,
        media_count: posts.length
      },
      posts: transformedPosts,
      total: posts.length
    });

  } catch (error: any) {
    console.error("Error fetching LinkedIn posts:", error);
    res.status(500).json({ 
      error: "Failed to fetch LinkedIn posts",
      details: error.message 
    });
  }
}