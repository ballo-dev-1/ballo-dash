// src/pages/api/debug/tables-check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user session to verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check what tables exist in the database
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    const tablesResult = await db.execute(tablesQuery);
    const tables = tablesResult.rows?.map((row: any) => row.table_name) || [];

    // Check if our specific table exists
    const hasCacheTable = tables.includes('social_media_data_cache');
    const hasIntegrationsTable = tables.includes('integrations');
    const hasCompaniesTable = tables.includes('companies');

    // Check table structure if it exists
    let cacheTableStructure = null;
    if (hasCacheTable) {
      const structureQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'social_media_data_cache' 
        ORDER BY ordinal_position;
      `;
      const structureResult = await db.execute(structureQuery);
      cacheTableStructure = structureResult.rows || [];
    }

    return res.status(200).json({
      tables: tables,
      hasCacheTable: hasCacheTable,
      hasIntegrationsTable: hasIntegrationsTable,
      hasCompaniesTable: hasCompaniesTable,
      cacheTableStructure: cacheTableStructure,
      message: "Database tables check completed"
    });

  } catch (error: any) {
    console.error("Tables check error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}
