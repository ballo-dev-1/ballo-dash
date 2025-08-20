// src/pages/api/debug/integrations.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";
import { integrations, companies } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user session to find company ID
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      console.log("❌ Debug API: No session or user email found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get company ID from session
    const companyId = session.user.companyId;
    if (!companyId) {
      console.log("❌ Debug API: No company ID found in session");
      return res.status(400).json({ error: "Company ID not found in session" });
    }

    console.log("🔍 Debug API: Processing request for company:", companyId);

    // Get company details
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId));

    console.log("🔍 Debug API: Company found:", company.length > 0 ? company[0] : 'None');

    // Get all integrations for the company
    const integrationsResult = await db
      .select()
      .from(integrations)
      .where(eq(integrations.companyId, companyId));

    console.log("🔍 Debug API: Integrations found:", integrationsResult.length);
    console.log("🔍 Debug API: Integration details:", integrationsResult.map(i => ({
      id: i.id,
      type: i.type,
      status: i.status,
      companyId: i.companyId,
      hasAccessToken: !!i.accessToken
    })));

    // Get all integrations in the system (for debugging)
    const allIntegrations = await db
      .select()
      .from(integrations);

    console.log("🔍 Debug API: Total integrations in system:", allIntegrations.length);

    return res.status(200).json({
      company: company[0] || null,
      companyIntegrations: integrationsResult,
      totalIntegrations: allIntegrations.length,
      session: {
        user: {
          email: session.user.email,
          companyId: session.user.companyId,
          role: session.user.role
        }
      }
    });

  } catch (error: any) {
    console.error("❌ Debug API: Unexpected error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
