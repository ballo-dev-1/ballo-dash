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
    // Check cache first
    const cachedToken = tokenCache.getCachedToken(companyId, 'INSTAGRAM');
    if (cachedToken) {
      return cachedToken;
    }

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

    if (instagramIntegration.length === 0) {
      return null;
    }

    const token = instagramIntegration[0].accessToken;
    if (token) {
      // Cache the token
      tokenCache.cacheToken(companyId, 'INSTAGRAM', token);
      return token;
    }

    return null;
  } catch (error) {
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
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return null;
    }

    const data = await response.json();

    const instagramAccount = data.data?.find((account: any) => 
      account.instagram_business_account?.id
    );

    if (instagramAccount?.instagram_business_account?.id) {
      return instagramAccount.instagram_business_account.id;
    } else {     
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
    // First, let's check what integrations exist for this company
    const existingIntegrations = await db
      .select({ id: integrations.id, type: integrations.type, status: integrations.status })
      .from(integrations)
      .where(eq(integrations.companyId, companyId));
 
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

/**
 * Get Instagram username from account ID
 */
export async function getInstagramUsername(accountId: string, accessToken: string): Promise<string | null> {
  try {
    console.log(`🔍 getInstagramUsername: Fetching username for account ID: ${accountId}`);
    
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${accountId}?fields=username&access_token=${accessToken}`,
      {
        headers: {
          'User-Agent': 'Ballo-Dashboard/1.0'
        }
      }
    );
    console.log(`🤖🤖🤖getInstagramUsername: Request: https://graph.facebook.com/v23.0/${accountId}?fields=username&access_token=${accessToken}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ getInstagramUsername: API error:`, errorText);
      return null;
    }

    const data = await response.json();
    const username = data.username;

    if (username) {
      console.log(`✅ getInstagramUsername: Found username: ${username}`);
      return username;
    } else {
      console.log(`❌ getInstagramUsername: No username found in response`);
      return null;
    }
  } catch (error) {
    console.error(`❌ getInstagramUsername: Error:`, error);
    return null;
  }
}
