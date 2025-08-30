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
      return null;
    }

    const accessToken = xIntegration[0].accessToken;
    
    if (!accessToken) {
      return null;
    }

    // Cache the token for future use
    tokenCache.cacheToken(companyId, 'X', accessToken);
    
    return accessToken;
  } catch (error) {
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
    return false;
  }
}
