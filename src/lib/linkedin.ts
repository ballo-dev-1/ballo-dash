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
      return null;
    }

    const accessToken = linkedInIntegration[0].accessToken;
    
    if (!accessToken) {
      return null;
    }

    // Cache the token for future use
    tokenCache.cacheToken(companyId, 'LINKEDIN', accessToken);
    
    return accessToken;
  } catch (error) {
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
    return false;
  }
}

/**
 * Fetches stored LinkedIn organization ID from database for a given company
 * @param companyId - The company ID to fetch the organization ID for
 * @returns The LinkedIn organization ID or null if not found
 */
export async function getStoredLinkedInOrganizationId(companyId: string): Promise<string | null> {
  try {
    const linkedInIntegration = await db
      .select({ accountId: integrations.accountId })
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'LINKEDIN')
        )
      )
      .limit(1);

    if (!linkedInIntegration || linkedInIntegration.length === 0) {
      return null;
    }

    return linkedInIntegration[0]?.accountId || null;
  } catch (error) {
    console.error("Error fetching LinkedIn organization ID:", error);
    return null;
  }
}
