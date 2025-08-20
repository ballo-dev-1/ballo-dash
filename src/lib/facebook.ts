import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { tokenCache } from "./tokenCache";

/**
 * Fetches Facebook/Meta access token from database for a given company
 * @param companyId - The company ID to fetch the token for
 * @returns The Facebook access token or null if not found
 */
export async function getFacebookAccessToken(companyId: string): Promise<string | null> {
  try {
    // First, check if we have a cached token
    const cachedToken = tokenCache.getCachedToken(companyId, 'FACEBOOK');
    if (cachedToken) {
      return cachedToken;
    }

    console.log("Fetching Facebook access token from database for company:", companyId);
    
    const facebookIntegration = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'FACEBOOK')
        )
      )
      .limit(1);

    if (!facebookIntegration || facebookIntegration.length === 0) {
      console.error("❌ Facebook integration not found in database for company:", companyId);
      return null;
    }

    const accessToken = facebookIntegration[0].accessToken;
    
    if (!accessToken) {
      console.error("❌ Facebook access token is empty for company:", companyId);
      return null;
    }

    // Cache the token for future use
    tokenCache.cacheToken(companyId, 'FACEBOOK', accessToken);

    console.log("✅ Facebook access token fetched successfully for company:", companyId);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");
    
    return accessToken;
  } catch (error) {
    console.error("❌ Error fetching Facebook access token from database:", error);
    return null;
  }
}

/**
 * Validates if a Facebook integration exists for a company
 * @param companyId - The company ID to check
 * @returns True if integration exists, false otherwise
 */
export async function hasFacebookIntegration(companyId: string): Promise<boolean> {
  try {
    const integration = await db
      .select({ id: integrations.id })
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'FACEBOOK')
        )
      )
      .limit(1);

    return integration.length > 0;
  } catch (error) {
    console.error("❌ Error checking Facebook integration:", error);
    return false;
  }
}

/**
 * Fetches Instagram access token from database for a given company
 * @param companyId - The company ID to fetch the token for
 * @returns The Instagram access token or null if not found
 */
export async function getInstagramAccessToken(companyId: string): Promise<string | null> {
  try {
    // First, check if we have a cached token
    const cachedToken = tokenCache.getCachedToken(companyId, 'INSTAGRAM');
    if (cachedToken) {
      return cachedToken;
    }

    console.log("Fetching Instagram access token from database for company:", companyId);
    
    const instagramIntegration = await db
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM')
        )
      )
      .limit(1);

    if (!instagramIntegration || instagramIntegration.length === 0) {
      console.error("❌ Instagram integration not found in database for company:", companyId);
      return null;
    }

    const accessToken = instagramIntegration[0].accessToken;
    
    if (!accessToken) {
      console.error("❌ Instagram access token is empty for company:", companyId);
      return null;
    }

    // Cache the token for future use
    tokenCache.cacheToken(companyId, 'INSTAGRAM', accessToken);

    console.log("✅ Instagram access token fetched successfully for company:", companyId);
    console.log("   Token preview:", accessToken.substring(0, 20) + "...");
    
    return accessToken;
  } catch (error) {
    console.error("❌ Error fetching Instagram access token from database:", error);
    return null;
  }
}
