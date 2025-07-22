// // src/pages/api/social-profiles/routes.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { db } from "@/db/db";
// import { integrations, socialProfiles } from "@/db/schema";
// import { eq, and } from "drizzle-orm";
// import { exchangeFacebookToken } from "@/app/lib/meta";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { companyId, platform, profileId, shortLivedToken } = req.body;

//   if (!companyId || !platform || !profileId || !shortLivedToken) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     // --- Step 1: Upsert Social Profile ---
//     const [existingProfile] = await db
//       .select()
//       .from(socialProfiles)
//       .where(
//         and(
//           eq(socialProfiles.companyId, companyId),
//           eq(socialProfiles.platform, platform)
//         )
//       );

//     if (existingProfile) {
//       await db
//         .update(socialProfiles)
//         .set({ profileId })
//         .where(eq(socialProfiles.id, existingProfile.id));
//     } else {
//       await db.insert(socialProfiles).values({
//         companyId,
//         platform,
//         profileId,
//       });
//     }

//     let accessToken: string = shortLivedToken;
//     let expiresAt: Date | null = null;

//     // --- Step 2: Try to get long-lived token ---
//     try {
//       console.log("Getting long lived token");
//       const fbTokenData = await exchangeFacebookToken({
//         shortLivedToken,
//         clientId: process.env.META_APP_ID!,
//         clientSecret: process.env.META_APP_SECRET!,
//       });

//       accessToken = fbTokenData.accessToken;
//       expiresAt = new Date(Date.now() + fbTokenData.expiresIn * 1000);
//       console.log("Long lived token success.");
//       console.log("Expires at: ", expiresAt);
//     } catch (err) {
//       console.warn(
//         "[FB_TOKEN_EXCHANGE_FAILED]: Falling back to short-lived token",
//         err
//       );
//     }

//     // --- Step 3: Upsert Integration ---
//     const [existingIntegration] = await db
//       .select()
//       .from(integrations)
//       .where(
//         and(
//           eq(integrations.companyId, companyId),
//           eq(integrations.type, platform)
//         )
//       );

//     if (existingIntegration) {
//       await db
//         .update(integrations)
//         .set({
//           accessToken,
//           refreshToken: null,
//           expiresAt,
//           updatedAt: new Date(),
//         })
//         .where(eq(integrations.id, existingIntegration.id));
//     } else {
//       await db.insert(integrations).values({
//         companyId,
//         type: platform,
//         status: "CONNECTED",
//         accessToken,
//         refreshToken: null,
//         expiresAt,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("[SOCIAL_PROFILE_POST]", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }
