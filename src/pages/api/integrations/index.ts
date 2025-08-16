// src/pages/api/integrations/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    if (req.method === "POST") {
      // Create new integration
      const { type, status, appId, appSecret, accessToken, refreshToken, expiresAt, metadata } = req.body;

      console.log("Creating new integration:", {
        companyId,
        type,
        status,
        accessToken: accessToken ? "***" : "not provided",
        refreshToken: refreshToken ? "***" : "not provided",
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : "not provided",
        metadata
      });

      // Validate required fields
      if (!type || !status || !accessToken) {
        console.log("❌ Validation failed: Missing required fields");
        return res.status(400).json({ 
          error: "Missing required fields: type, status, and accessToken are required" 
        });
      }

      // Check if integration already exists for this company and type
      const existingIntegration = await db
        .select()
        .from(integrations)
        .where(
          and(
            eq(integrations.companyId, companyId),
            eq(integrations.type, type)
          )
        );

      if (existingIntegration.length > 0) {
        console.log("❌ Integration already exists for this company and type");
        return res.status(409).json({ 
          error: `Integration for ${type} already exists for this company` 
        });
      }

      try {
        // Create the new integration
        const result = await db
          .insert(integrations)
          .values({
            companyId,
            type,
            status,
            appId: appId || null,
            appSecret: appSecret || null,
            accessToken,
            refreshToken: refreshToken || null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            metadata: metadata || {},
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();

        console.log("Database insert result:", result);

        if (result.length === 0) {
          console.log("❌ No rows inserted - creation failed");
          return res.status(500).json({ error: "Failed to create integration" });
        }

        console.log("✅ Integration created successfully:", result[0].id);
        
        // Return the created integration (without sensitive data)
        const { accessToken: _, refreshToken: __, ...safeIntegration } = result[0];
        return res.status(201).json(safeIntegration);
      } catch (dbError: any) {
        console.error("❌ Database error during creation:", dbError);
        console.error("❌ Database error message:", dbError.message);
        console.error("❌ Database error code:", dbError.code);
        return res.status(500).json({
          error: "Database error during creation",
          details: dbError.message,
        });
      }

    } else if (req.method === "GET") {
      // Get all integrations for the company
      const { companyId: queryCompanyId } = req.query;
      
      // Use query parameter if provided, otherwise use session company ID
      const targetCompanyId = Array.isArray(queryCompanyId) ? queryCompanyId[0] : queryCompanyId || companyId;

      console.log("Fetching integrations for company:", targetCompanyId);

      try {
        const result = await db
          .select()
          .from(integrations)
          .where(eq(integrations.companyId, targetCompanyId as string));

        console.log("Found integrations:", result.length);

        // Return integrations without sensitive data
        const safeIntegrations = result.map(({ accessToken: _, refreshToken: __, appSecret: ___, ...safe }) => safe);
        return res.status(200).json(safeIntegrations);
      } catch (dbError: any) {
        console.error("❌ Database error during fetch:", dbError);
        return res.status(500).json({
          error: "Database error during fetch",
          details: dbError.message,
        });
      }

    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
