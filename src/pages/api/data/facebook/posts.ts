// src/pages/api/data/meta/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getFacebookAccessToken } from "@/lib/facebook";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId, platform } = req.query;

  if (!pageId || !platform) {
    return res
      .status(400)
      .json({ error: "Missing pageId or platform" });
  }

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
    
    const accessToken = await getFacebookAccessToken(companyId);
    
    if (!accessToken) {
      return res.status(400).json({ error: "Facebook access token not found in database" });
    }

    // 1. Fetch Page Info
    const pageInfoRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}?fields=name&access_token=${accessToken}`
    );
    const pageInfo = await pageInfoRes.json();
    if (!pageInfoRes.ok)
      throw new Error(pageInfo.error?.message || "Failed to fetch page info");

    // 2. Fetch Page Picture
    const profilePictureRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}/picture?redirect=false&access_token=${accessToken}`,
      {
        headers: {
          'User-Agent': 'Ballo-Dashboard/1.0'
        }
      }
    );
    const profilePictureJson = await profilePictureRes.json();
    const profilePictureUrl = profilePictureJson?.data?.url || "";

    // 3. Fetch Posts
    const postsRes = await fetch(
      `https://graph.facebook.com/v23.0/${pageId}/posts?limit=100&access_token=${accessToken}`,
      {
        headers: {
          'User-Agent': 'Ballo-Dashboard/1.0'
        }
      }
    );
    const postsJson = await postsRes.json();
    if (!postsRes.ok)
      throw new Error(postsJson.error?.message || "Failed to fetch posts");

    const posts = postsJson.data || [];

    // 4. Fetch Insights for each post in parallel (limit batch size if needed)
    const metrics = [
      "post_impressions",
      "post_activity_by_action_type",
      "post_clicks",
      "post_reactions_like_total",
      "post_reactions_love_total",
      "post_reactions_wow_total",
      "post_reactions_haha_total",
      "post_reactions_sorry_total",
      "post_reactions_anger_total",
      "post_reactions_by_type_total",
      // "post_engaged_users",
      // "post_reactions_by_type_total",
      // "post_clicks",
      // "post_shares",
    ];

    // Process posts in smaller batches to avoid overwhelming the API
    const batchSize = 5;
    const enrichedPosts: any[] = [];
    
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (post: any) => {
          try {
            // Add timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            const insightRes = await fetch(
              `https://graph.${platform}.com/v23.0/${
                post.id
              }/insights?metric=${metrics.join(",")}&access_token=${accessToken}`,
              {
                signal: controller.signal,
                headers: {
                  'User-Agent': 'Ballo-Dashboard/1.0'
                }
              }
            );
            
            clearTimeout(timeoutId);
            const insightJson = await insightRes.json();

            if (!insightRes.ok) {
              console.warn(
                `Failed to fetch insights for post ${post.id}`,
                insightJson.error
              );
              return { ...post };
            }

            // Flatten the insights into key-value structure
            const insights = (insightJson.data || []).reduce(
              (acc: any, metric: any) => {
                const key = metric.name;
                const value = metric.values?.[0]?.value;

                if (typeof value === "object" && value !== null) {
                  Object.entries(value).forEach(([subKey, subValue]) => {
                    acc[subKey] = subValue;
                  });
                } else {
                  acc[key] = value;
                }

                return acc;
              },
              {}
            );

            return { ...post, insights };
          } catch (error: any) {
            if (error.name === 'AbortError') {
              console.warn(`Timeout fetching insights for post ${post.id}`);
            } else {
              console.warn(`Error fetching insights for ${post.id}`, error);
            }
            return { ...post };
          }
        })
      );
      
      // Process batch results
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          enrichedPosts.push(result.value);
        } else {
          // If rejected, add post without insights
          enrichedPosts.push({ ...batch[index] });
        }
      });
      
      // Add small delay between batches to avoid rate limiting
      if (i + batchSize < posts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.status(200).json({
      pageInfo: {
        ...pageInfo,
        profilePictureUrl,
      },
      platform,
      posts: enrichedPosts,
    });
  } catch (error: any) {
    console.error("Error fetching Facebook posts:", error);
    res.status(500).json({
      error: "Failed to fetch Facebook posts",
      details: error.message,
    });
  }
}
