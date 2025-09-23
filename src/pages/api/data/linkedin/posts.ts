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

    // Fetch posts from linkedin API
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
      console.error("Failed to fetch linkedin posts:", postsJson);
      return res.status(500).json({ 
        error: "Failed to fetch LinkedIn posts",
        details: postsJson.message || "Unknown error"
      });
    }

    const posts = postsJson.elements || [];

    // Separate posts by type (ugcPost vs share) for proper insights fetching
    const sharePosts = posts.filter((post: any) => post.id.startsWith('urn:li:share:'));
    const ugcPosts = posts.filter((post: any) => post.id.startsWith('urn:li:ugcPost:'));
    
    console.log(`📊 Found ${sharePosts.length} share posts and ${ugcPosts.length} ugcPost posts`);
    
    // Fetch insights for all posts
    let insightsMap: Record<string, any> = {};
    
    // Try to fetch insights for share posts one by one (like your Postman example)
    if (sharePosts.length > 0) {
      console.log(`🔍 Fetching linkedin insights for ${sharePosts.length} LinkedIn share posts individually`);
      
      for (const post of sharePosts) {
        try {
          const shareId = post.id;
          console.log(`🔍 Fetching insights for individual post: ${shareId}`);
          
          // Use the exact format from your Postman example - single post
          const insightsUrl = `https://api.linkedin.com/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn%3Ali%3Aorganization%3A${finalOrganizationId}&shares=List(${encodeURIComponent(shareId)})`;
          console.log(`🌐 Single post insights URL:`, insightsUrl);
          
          const insightsRes = await fetch(insightsUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'LinkedIn-Version': '202501',
              'X-Restli-Protocol-Version': '2.0.0'
            }
          });
          
          console.log(`📊 Single post insights - Status: ${insightsRes.status}`);
          
          if (insightsRes.ok) {
            const insightsJson = await insightsRes.json();
            console.log(`📈 Single post insights response:`, JSON.stringify(insightsJson, null, 2));
            
            if (insightsJson.elements && Array.isArray(insightsJson.elements) && insightsJson.elements.length > 0) {
              const element = insightsJson.elements[0];
              const postId = element.share.replace('urn:li:share:', '');
              console.log(`📊 Processing insights for share ${postId}:`, element.totalShareStatistics);
              insightsMap[postId] = element.totalShareStatistics;
            } else {
              console.log(`⚠️ No insights elements found for post ${shareId}`);
            }
          } else {
            const errorText = await insightsRes.text();
            console.log(`❌ Failed to fetch insights for post ${shareId}:`, errorText);
          }
          
          // Add a small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (postError: any) {
          console.log(`❌ Error fetching insights for post ${post.id}:`, postError);
        }
      }
      
      console.log(`✅ Completed individual insights fetching for share posts`);
    }
    
    // Try to fetch insights for ugcPost posts individually
    if (ugcPosts.length > 0) {
      console.log(`🔍 Attempting to fetch insights for ${ugcPosts.length} LinkedIn ugcPost posts individually`);
      
      for (const post of ugcPosts) {
        try {
          const ugcPostId = post.id;
          console.log(`🔍 Fetching insights for individual ugcPost: ${ugcPostId}`);
          
          // Try using ugcPost parameter for individual posts
          const ugcInsightsUrl = `https://api.linkedin.com/rest/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn%3Ali%3Aorganization%3A${finalOrganizationId}&ugcPosts=List(${encodeURIComponent(ugcPostId)})`;
          console.log(`🌐 Single UGC post insights URL:`, ugcInsightsUrl);
          
          const ugcInsightsRes = await fetch(ugcInsightsUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'LinkedIn-Version': '202501',
              'X-Restli-Protocol-Version': '2.0.0'
            }
          });
          
          console.log(`📊 Single UGC post insights - Status: ${ugcInsightsRes.status}`);
          
          if (ugcInsightsRes.ok) {
            const ugcInsightsJson = await ugcInsightsRes.json();
            console.log(`📈 Single UGC post insights response:`, JSON.stringify(ugcInsightsJson, null, 2));
            
            if (ugcInsightsJson.elements && Array.isArray(ugcInsightsJson.elements) && ugcInsightsJson.elements.length > 0) {
              const element = ugcInsightsJson.elements[0];
              const postId = element.share?.replace('urn:li:ugcPost:', '') || element.ugcPost?.replace('urn:li:ugcPost:', '');
              if (postId) {
                console.log(`📊 Processing insights for ugcPost ${postId}:`, element.totalShareStatistics);
                insightsMap[postId] = element.totalShareStatistics;
              }
            } else {
              console.log(`⚠️ No insights elements found for ugcPost ${ugcPostId}`);
            }
          } else {
            const errorText = await ugcInsightsRes.text();
            console.log(`❌ Failed to fetch insights for ugcPost ${ugcPostId}:`, errorText);
          }
          
          // Add a small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (ugcPostError: any) {
          console.log(`❌ Error fetching insights for ugcPost ${post.id}:`, ugcPostError);
        }
      }
      
      console.log(`✅ Completed individual insights fetching for ugcPost posts`);
    }
    
    console.log(`📊 Final insights map:`, insightsMap);

    // Transform posts to match expected format
    const transformedPosts = posts.map((post: any) => {
      const shareId = post.id.replace('urn:li:share:', '').replace('urn:li:ugcPost:', '');
      const insights = insightsMap[shareId] || {};
      
      return {
        id: post.id,
        message: post.commentary || "", // LinkedIn uses 'commentary' field for post content
        created_time: new Date(post.createdAt).toISOString(), // Convert timestamp to ISO string
        media_type: post.content?.media?.mediaType || "TEXT",
        media_url: post.content?.media?.url,
        permalink: `https://www.linkedin.com/feed/update/${shareId}`, // Generate LinkedIn permalink
        author: post.author,
        visibility: post.visibility,
        lifecycleState: post.lifecycleState,
        specificContent: post.content,
        // LinkedIn insights data
        likes: insights.likeCount || 0,
        comments: insights.commentCount || 0,
        shares: insights.shareCount || 0,
        views: insights.impressionCount || 0,
        clicks: insights.clickCount || 0,
        uniqueImpressions: insights.uniqueImpressionsCount || 0,
        engagement: insights.engagement || 0
      };
    });

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