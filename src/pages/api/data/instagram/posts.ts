import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getInstagramAccessToken, getStoredInstagramAccountId, getInstagramUsername } from "@/lib/instagram";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accountId, username } = req.query;

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
    
    const accessToken = await getInstagramAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "Instagram access token not found in database" });
    }

    console.log("✅ Retrieved Instagram access token from database for posts, company:", companyId);

    // Get the stored account ID if not provided
    const storedAccountId = await getStoredInstagramAccountId(companyId);
    const finalAccountId = (accountId as string) || storedAccountId;

    if (!finalAccountId) {
      return res.status(400).json({ error: "Instagram account ID not found" });
    }

    // Get Instagram username if not provided
    let finalUsername = username as string;
    if (!finalUsername) {
      console.log("🔍 Username not provided, fetching from Instagram API...");
      const fetchedUsername = await getInstagramUsername(finalAccountId, accessToken);
      if (!fetchedUsername) {
        return res.status(400).json({ error: "Instagram username not found" });
      }
      finalUsername = fetchedUsername;
    }

    console.log(`📸 Fetching Instagram posts for account: ${finalAccountId}, username: ${finalUsername}`);

    // Use business discovery API to fetch posts
    const postsRes = await fetch(
      `https://graph.facebook.com/v19.0/${finalAccountId}?fields=business_discovery.username(${finalUsername}){media{caption,id,media_type,media_url,timestamp}}&access_token=${accessToken}`,
      {
        headers: {
          'User-Agent': 'Ballo-Dashboard/1.0'
        }
      }
    );

    const postsJson = await postsRes.json();
    
    if (!postsRes.ok) {
      console.error("Failed to fetch Instagram posts:", postsJson.error);
      return res.status(500).json({ 
        error: "Failed to fetch Instagram posts",
        details: postsJson.error?.message || "Unknown error"
      });
    }

    const posts = postsJson.business_discovery?.media?.data || [];

    // Fetch insights for each post
    const transformedPosts = await Promise.all(
      posts.map(async (post: any) => {
        let insights = {};
        
        try {
          // Fetch insights for this specific post
          const insightsRes = await fetch(
            `https://graph.facebook.com/v19.0/${post.id}/insights?metric=reach,saved,likes,comments,shares,total_interactions,follows,profile_visits,profile_activity,views&access_token=${accessToken}`,
            {
              headers: {
                'User-Agent': 'Ballo-Dashboard/1.0'
              }
            }
          );

          if (insightsRes.ok) {
            const insightsJson = await insightsRes.json();
            const insightsData = insightsJson.data || [];
            
            // Transform insights data into a more usable format
            insights = insightsData.reduce((acc: any, metric: any) => {
              acc[metric.name] = metric.values?.[0]?.value || 0;
              return acc;
            }, {});
            
            console.log(`📊 Fetched insights for post ${post.id}:`, insights);
          } else {
            console.log(`⚠️ Failed to fetch insights for post ${post.id}`);
          }
        } catch (insightsError) {
          console.log(`⚠️ Error fetching insights for post ${post.id}:`, insightsError);
        }

        return {
          id: post.id,
          message: post.caption || "",
          created_time: post.timestamp,
          media_type: post.media_type,
          media_url: post.media_url,
          insights: insights
        };
      })
    );

    res.status(200).json({
      platform: "instagram",
      accountId: finalAccountId,
      pageInfo: {
        name: finalUsername,
        profilePicture: null,
        id: finalAccountId,
        username: finalUsername,
        followers_count: 0,
        media_count: posts.length
      },
      posts: transformedPosts,
      total: posts.length
    });
  } catch (error: any) {
    console.error("Error fetching Instagram posts:", error);
    res.status(500).json({ 
      error: "Failed to fetch Instagram posts",
      details: error.message 
    });
  }
}
