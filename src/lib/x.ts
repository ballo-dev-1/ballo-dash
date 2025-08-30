import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { tokenCache } from "./tokenCache";

/**
 * Fetches X access token from database for a given company
 * @param companyId - The company ID to fetch the token for
 * @returns The X access token or null if not found
 */
export async function getXAccessToken(companyId: string): Promise<string | null> {
  try {
    // First, check if we have a cached token
    const cachedToken = tokenCache.getCachedToken(companyId, 'X');
    if (cachedToken) {
      return cachedToken;
    }

    console.log("Fetching X access token from database for company:", companyId);
    
    const xIntegration = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'X')
        )
      )
      .limit(1);

    if (!xIntegration || xIntegration.length === 0) {
      console.error("❌ X integration not found in database for company:", companyId);
      return null;
    }

    const accessToken = xIntegration[0].accessToken;
    
    if (!accessToken) {
      console.error("❌ X access token is empty for company:", companyId);
      return null;
    }

    // Cache the token for future use
    tokenCache.cacheToken(companyId, 'X', accessToken);

    console.log("✅ X access token fetched successfully for company:", companyId);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");
    
    return accessToken;
  } catch (error) {
    console.error("❌ Error fetching X access token from database:", error);
    return null;
  }
}

/**
 * Validates if an X integration exists for a company
 * @param companyId - The company ID to check
 * @returns True if integration exists, false otherwise
 */
export async function hasXIntegration(companyId: string): Promise<boolean> {
  try {
    const integration = await db
      .select({ id: integrations.id })
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'X')
        )
      )
      .limit(1);

    return integration.length > 0;
  } catch (error) {
    console.error("❌ Error checking X integration:", error);
    return false;
  }
}
