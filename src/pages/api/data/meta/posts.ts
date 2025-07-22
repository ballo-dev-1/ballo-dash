// src/pages/api/data/meta/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId, accessToken, platform } = req.query;

  if (!pageId || !accessToken || !platform) {
    return res
      .status(400)
      .json({ error: "Missing pageId, platform or accessToken" });
  }

  try {
    // 1. Fetch Page Info
    const pageInfoRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}?fields=name&access_token=${accessToken}`
    );
    const pageInfo = await pageInfoRes.json();
    if (!pageInfoRes.ok)
      throw new Error(pageInfo.error?.message || "Failed to fetch page info");

    // 2. Fetch Page Picture
    const profilePictureRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}/picture?redirect=false&access_token=${accessToken}`
    );
    const profilePictureJson = await profilePictureRes.json();
    const profilePictureUrl = profilePictureJson?.data?.url || "";

    // 3. Fetch Posts
    const postsRes = await fetch(
      `https://graph.${platform}.com/v23.0/${pageId}/posts?limit=100&access_token=${accessToken}`
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

    const enrichedPosts = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const insightRes = await fetch(
            `https://graph.${platform}.com/v23.0/${
              post.id
            }/insights?metric=${metrics.join(",")}&access_token=${accessToken}`
          );
          const insightJson = await insightRes.json();

          if (!insightRes.ok) {
            console.warn(
              `Failed to fetch insights for post ${post.id}`,
              insightJson.error
            );
            return { ...post };
          }

          // console.log(insightJson.data);
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
        } catch (error) {
          console.warn(`Error fetching insights for ${post.id}`, error);
          return { ...post };
        }
      })
    );

    return res.status(200).json({
      pageInfo: {
        name: pageInfo.name,
        id: pageId,
        profilePicture: profilePictureUrl,
      },
      platform,
      posts: enrichedPosts,
    });
  } catch (error: any) {
    console.error("[FB_POSTS_ERROR]", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
