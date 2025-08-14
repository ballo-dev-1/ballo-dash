// src/pages/api/social-profiles/routes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { socialProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // GET: Retrieve social profiles for the authenticated user's company
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session?.user?.companyId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const companyId = session.user.companyId;
      
      const profiles = await db
        .select()
        .from(socialProfiles)
        .where(eq(socialProfiles.companyId, companyId));

      return res.status(200).json(profiles);
    } catch (error) {
      console.error("❌ Error fetching social profiles:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    // POST: Create/update social profile (keeping the original logic)
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session?.user?.companyId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { platform, profileId } = req.body;
      const companyId = session.user.companyId;

      if (!platform || !profileId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if profile already exists
      const [existingProfile] = await db
        .select()
        .from(socialProfiles)
        .where(
          and(
            eq(socialProfiles.companyId, companyId),
            eq(socialProfiles.platform, platform)
          )
        );

      if (existingProfile) {
        // Update existing profile
        await db
          .update(socialProfiles)
          .set({ 
            profileId
          })
          .where(eq(socialProfiles.id, existingProfile.id));
      } else {
        // Create new profile
        await db.insert(socialProfiles).values({
          companyId,
          platform,
          profileId,
          connectedAt: new Date(),
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error creating/updating social profile:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
