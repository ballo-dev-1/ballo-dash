// src/lib/instagram.ts

import { db } from "@/db/db";
import { integrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { tokenCache } from "./tokenCache";

/**
 * Get Instagram access token for a company
 */
export async function getInstagramAccessToken(companyId: string): Promise<string | null> {
  try {
    console.log(`🔍 getInstagramAccessToken called with companyId: ${companyId}`);
    
    // Check cache first
    const cachedToken = tokenCache.getCachedToken(companyId, 'INSTAGRAM');
    if (cachedToken) {
      console.log(`✅ Found cached Instagram token, length: ${cachedToken.length}`);
      return cachedToken;
    }

    console.log(`🔍 No cached token, querying database...`);

    // Query database for Instagram integration
    const instagramIntegration = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM'),
          eq(integrations.status, 'CONNECTED')
        )
      )
      .limit(1);

    console.log(`📊 Database query result:`, {
      found: instagramIntegration.length > 0,
      integration: instagramIntegration[0] ? {
        id: instagramIntegration[0].id,
        type: instagramIntegration[0].type,
        status: instagramIntegration[0].status,
        hasAccessToken: !!instagramIntegration[0].accessToken,
        accessTokenLength: instagramIntegration[0].accessToken?.length
      } : null
    });

    if (instagramIntegration.length === 0) {
      console.log(`❌ No Instagram integration found in database`);
      return null;
    }

    const token = instagramIntegration[0].accessToken;
    if (token) {
      console.log(`✅ Found Instagram access token, length: ${token.length}`);
      // Cache the token
      tokenCache.cacheToken(companyId, 'INSTAGRAM', token);
      return token;
    }

    console.log(`❌ Instagram integration found but no access token`);
    return null;
  } catch (error) {
    console.error(`❌ Error in getInstagramAccessToken:`, error);
    return null;
  }
}

/**
 * Check if company has Instagram integration
 */
export async function hasInstagramIntegration(companyId: string): Promise<boolean> {
  try {
    const instagramIntegration = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM'),
          eq(integrations.status, 'CONNECTED')
        )
      )
      .limit(1);

    return instagramIntegration.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get Instagram account ID from access token
 */
export async function getInstagramAccountId(accessToken: string): Promise<string | null> {
  try {
    console.log(`🔍 getInstagramAccountId: Fetching account ID from Instagram API...`);
    
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
    );

    console.log(`🔍 getInstagramAccountId: API response status: ${response.status}`);

    if (!response.ok) {
      console.log(`❌ getInstagramAccountId: API request failed with status: ${response.status}`);
      const errorText = await response.text();
      console.log(`❌ getInstagramAccountId: Error response:`, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`🔍 getInstagramAccountId: API response data:`, data);

    const instagramAccount = data.data?.find((account: any) => 
      account.instagram_business_account?.id
    );

    if (instagramAccount?.instagram_business_account?.id) {
      console.log(`✅ getInstagramAccountId: Found Instagram business account ID: ${instagramAccount.instagram_business_account.id}`);
      return instagramAccount.instagram_business_account.id;
    } else {
      console.log(`❌ getInstagramAccountId: No Instagram business account found in API response`);
      console.log(`🔍 getInstagramAccountId: Available accounts:`, data.data?.map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        hasInstagram: !!acc.instagram_business_account
      })));
      return null;
    }
  } catch (error) {
    console.error(`❌ getInstagramAccountId: Error:`, error);
    return null;
  }
}

/**
 * Store Instagram account ID in the database
 */
export async function storeInstagramAccountId(companyId: string, accountId: string): Promise<void> {
  try {
    console.log(`🔍 storeInstagramAccountId: Starting database update...`);
    console.log(`🔍 storeInstagramAccountId: Company ID: ${companyId}`);
    console.log(`🔍 storeInstagramAccountId: Account ID to store: ${accountId}`);
    
    // First, let's check what integrations exist for this company
    const existingIntegrations = await db
      .select({ id: integrations.id, type: integrations.type, status: integrations.status })
      .from(integrations)
      .where(eq(integrations.companyId, companyId));
    
    console.log(`🔍 storeInstagramAccountId: Found ${existingIntegrations.length} total integrations for company`);
    console.log(`🔍 storeInstagramAccountId: Integrations:`, existingIntegrations);
    
    // Now update the Instagram integration
    const result = await db
      .update(integrations)
      .set({ 
        accountId,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM'),
          eq(integrations.status, 'CONNECTED')
        )
      );
    
    console.log(`🔍 storeInstagramAccountId: Database update result:`, result);
    console.log(`✅ storeInstagramAccountId: Successfully stored Instagram account ID: ${accountId} for company: ${companyId}`);
    
    // Verify the update worked
    const verification = await db
      .select({ accountId: integrations.accountId })
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM'),
          eq(integrations.status, 'CONNECTED')
        )
      )
      .limit(1);
    
    console.log(`🔍 storeInstagramAccountId: Verification query result:`, verification);
    
  } catch (error: any) {
    console.error(`❌ storeInstagramAccountId: Failed to store Instagram account ID:`, error);
    console.error(`❌ storeInstagramAccountId: Error details:`, {
      message: error.message,
      stack: error.stack,
      companyId,
      accountId
    });
    throw error; // Re-throw to let caller handle it
  }
}

/**
 * Get Instagram account ID from database
 */
export async function getStoredInstagramAccountId(companyId: string): Promise<string | null> {
  try {
    console.log(`🔍 getStoredInstagramAccountId: Looking for stored account ID for company: ${companyId}`);
    
    const integration = await db
      .select({ accountId: integrations.accountId })
      .from(integrations)
      .where(
        and(
          eq(integrations.companyId, companyId),
          eq(integrations.type, 'INSTAGRAM'),
          eq(integrations.status, 'CONNECTED')
        )
      )
      .limit(1);

    console.log(`🔍 getStoredInstagramAccountId: Query result:`, {
      found: integration.length > 0,
      accountId: integration[0]?.accountId || null
    });

    if (integration[0]?.accountId) {
      console.log(`✅ getStoredInstagramAccountId: Found stored account ID: ${integration[0].accountId}`);
    } else {
      console.log(`❌ getStoredInstagramAccountId: No stored account ID found`);
    }

    return integration[0]?.accountId || null;
  } catch (error) {
    console.error(`❌ getStoredInstagramAccountId: Error:`, error);
    return null;
  }
}
