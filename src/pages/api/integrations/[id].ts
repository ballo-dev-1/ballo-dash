import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const integrationId = Array.isArray(id) ? id[0] : id;

  if (!integrationId) {
    return res.status(400).json({ error: "Integration ID is required" });
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

    if (req.method === "PUT") {
      // Update integration
      const { accessToken, refreshToken, status, handle, expiresAt } = req.body;

      console.log("Updating integration:", {
        integrationId,
        companyId,
        accessToken: accessToken ? "***" : "not provided",
        refreshToken: refreshToken ? "***" : "not provided",
        status,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : "not provided"
      });

      // Validate required fields
      if (!accessToken && !refreshToken && !status && expiresAt === undefined) {
        console.log("❌ Validation failed: No fields provided for update");
        return res.status(400).json({ error: "At least one field must be provided for update" });
      }

      // Build update object with only provided fields
      const updateData: any = {};
      if (accessToken !== undefined) updateData.accessToken = accessToken;
      if (refreshToken !== undefined) updateData.refreshToken = refreshToken;
      if (status !== undefined) updateData.status = status;
      if (handle !== undefined) updateData.handle = handle;
      if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      updateData.updatedAt = new Date();

      console.log("Update data to be applied:", updateData);

      try {
        // Update the integration
        const result = await db
          .update(integrations)
          .set(updateData)
          .where(
            and(
              eq(integrations.id, integrationId),
              eq(integrations.companyId, companyId)
            )
          )
          .returning();

        console.log("Database update result:", result);

        if (result.length === 0) {
          console.log("❌ No rows updated - integration not found or access denied");
          return res.status(404).json({ error: "Integration not found or access denied" });
        }

        console.log("✅ Integration updated successfully:", result[0].id);
        
        // Return the updated integration (without sensitive data)
        const { accessToken: _, refreshToken: __, ...safeIntegration } = result[0];
        return res.status(200).json(safeIntegration);
      } catch (dbError: any) {
        console.error("❌ Database error during update:", dbError);
        console.error("❌ Database error message:", dbError.message);
        console.error("❌ Database error code:", dbError.code);
        return res.status(500).json({
          error: "Database error during update",
          details: dbError.message,
        });
      }

    } else if (req.method === "GET") {
      // Get integration details
      const result = await db
        .select()
        .from(integrations)
        .where(
          and(
            eq(integrations.id, integrationId),
            eq(integrations.companyId, companyId)
          )
        );

      if (result.length === 0) {
        return res.status(404).json({ error: "Integration not found or access denied" });
      }

      // Return integration without sensitive data
      const { accessToken, refreshToken, ...safeIntegration } = result[0];
      return res.status(200).json(safeIntegration);

    } else if (req.method === "DELETE") {
      // Delete integration
      const result = await db
        .delete(integrations)
        .where(
          and(
            eq(integrations.id, integrationId),
            eq(integrations.companyId, companyId)
          )
        )
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: "Integration not found or access denied" });
      }

      console.log("✅ Integration deleted successfully:", integrationId);
      return res.status(200).json({ message: "Integration deleted successfully" });

    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }

  } catch (error: any) {
    console.error("❌ Error in integration API:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}

