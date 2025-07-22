// // File: pages/api/analytics/index.ts
// import { fetchLinkedInAnalytics } from "@/app/lib/linkedin";
// import { fetchMetaAnalytics } from "@/app/lib/meta";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { metaAccountId, linkedinOrgId } = req.query;
//   const metaToken = process.env.META_ACCESS_TOKEN;
//   const linkedinToken = process.env.LINKEDIN_ACCESS_TOKEN;

//   if (!metaAccountId || !linkedinOrgId || !metaToken || !linkedinToken) {
//     return res
//       .status(400)
//       .json({ error: "Missing required query parameters or access tokens" });
//   }

//   try {
//     const [metaData, linkedinData] = await Promise.all([
//       fetchMetaAnalytics(metaToken, metaAccountId as string),
//       fetchLinkedInAnalytics(linkedinToken, linkedinOrgId as string),
//     ]);

//     res.status(200).json({ platforms: [metaData, linkedinData] });
//   } catch (error) {
//     console.error("Error fetching analytics:", error);
//     res.status(500).json({ error: "Failed to fetch analytics" });
//   }
// }
