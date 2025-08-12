import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { organizationId } = req.query;

  if (typeof organizationId !== "string") {
    return res.status(400).json({ error: "Missing organizationId" });
  }

  try {
    // Get user session to find access tokens
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const accessToken = session.user.accessTokens?.LINKEDIN;
    if (!accessToken) {
      return res.status(400).json({ error: "LinkedIn access token not found in session" });
    }

    console.log("Retrieved LinkedIn access token from session for posts", session.user.email);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
    };

    const postsRes = await fetch(
      `https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:organization:${organizationId}&sortBy=LAST_MODIFIED&sharesPerOwner=10`,
      { headers }
    );

    if (!postsRes.ok) {
      const text = await postsRes.text();
      return res.status(postsRes.status).json({ error: text });
    }

    const data = await postsRes.json();

    const organizationInfoRes = await fetch(
      `https://api.linkedin.com/v2/organizations/${organizationId}?projection=(localizedName)`,
      { headers }
    );

    const organizationInfo = await organizationInfoRes.json();

    const posts = (data.elements || []).map((post: any) => ({
      id: post.activity,
      text: post.text?.text ?? "",
      created_time: post.created?.time ? new Date(post.created.time).toISOString() : "",
    }));

    res.status(200).json({
      organizationInfo: {
        id: organizationId,
        name: organizationInfo.localizedName,
      },
      platform: "linkedin",
      posts,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error);
    res.status(500).json({ error: "Failed to fetch LinkedIn posts" });
  }
}
