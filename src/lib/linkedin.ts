import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { tokenCache } from "./tokenCache";

/**
 * Fetches LinkedIn access token from database for a given company
 * @param companyId - The company ID to fetch the token for
 * @returns The LinkedIn access token or null if not found
 */
export async function getLinkedInAccessToken(companyId: string): Promise<string | null> {
  try {
    // First, check if we have a cached token
    const cachedToken = tokenCache.getCachedToken(companyId, 'LINKEDIN');
    if (cachedToken) {
      return cachedToken;
    }

    console.log("Fetching LinkedIn access token from database for company:", companyId);
    
    const linkedInIntegration = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'LINKEDIN')
        )
      )
      .limit(1);

    if (!linkedInIntegration || linkedInIntegration.length === 0) {
      console.error("❌ LinkedIn integration not found in database for company:", companyId);
      return null;
    }

    const accessToken = linkedInIntegration[0].accessToken;
    
    if (!accessToken) {
      console.error("❌ LinkedIn access token is empty for company:", companyId);
      return null;
    }

    // Cache the token for future use
    tokenCache.cacheToken(companyId, 'LINKEDIN', accessToken);

    console.log("✅ LinkedIn access token fetched successfully for company:", companyId);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");
    
    return accessToken;
  } catch (error) {
    console.error("❌ Error fetching LinkedIn access token from database:", error);
    return null;
  }
}

/**
 * Validates if a LinkedIn integration exists for a company
 * @param companyId - The company ID to check
 * @returns True if integration exists, false otherwise
 */
export async function hasLinkedInIntegration(companyId: string): Promise<boolean> {
  try {
    const integration = await db
      .select({ id: integrations.id })
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'LINKEDIN')
        )
      )
      .limit(1);

    return integration.length > 0;
  } catch (error) {
    console.error("❌ Error checking LinkedIn integration:", error);
    return false;
  }
}
