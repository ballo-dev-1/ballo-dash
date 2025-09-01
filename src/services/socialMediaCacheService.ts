// src/services/socialMediaCacheService.ts
import { db } from "@/db/db";
import { socialMediaDataCache } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";

interface CacheEntry {
  id: string;
  companyId: string;
  platform: string;
  profileId: string;
  data: any;
  lastFetchedAt: Date;
  expiresAt: Date;
  fetchStatus: 'SUCCESS' | 'ERROR' | 'PENDING';
  errorMessage?: string;
}

class SocialMediaCacheService {
  private static instance: SocialMediaCacheService;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private constructor() {}

  public static getInstance(): SocialMediaCacheService {
    if (!SocialMediaCacheService.instance) {
      SocialMediaCacheService.instance = new SocialMediaCacheService();
    }
    return SocialMediaCacheService.instance;
  }

  /**
   * Store social media data in cache
   */
  public async storeData(
    companyId: string,
    platform: string,
    profileId: string,
    data: any,
    fetchStatus: 'SUCCESS' | 'ERROR' | 'PENDING' = 'SUCCESS',
    errorMessage?: string
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.CACHE_DURATION);
      
      // Use upsert to either insert new or update existing
      await db
        .insert(socialMediaDataCache)
        .values({
          companyId,
          platform: platform.toUpperCase(),
          profileId,
          data,
          lastFetchedAt: new Date(),
          expiresAt,
          fetchStatus,
          errorMessage,
        })
        .onConflictDoUpdate({
          target: [socialMediaDataCache.companyId, socialMediaDataCache.platform, socialMediaDataCache.profileId],
          set: {
            data,
            lastFetchedAt: new Date(),
            expiresAt,
            fetchStatus,
            errorMessage,
            updatedAt: new Date(),
          },
        });

      // Data stored successfully
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieve cached social media data
   */
  public async getData(
    companyId: string,
    platform: string,
    profileId: string
  ): Promise<CacheEntry | null> {
    try {
      const result = await db
        .select()
        .from(socialMediaDataCache)
        .where(
          and(
            eq(socialMediaDataCache.companyId, companyId),
            eq(socialMediaDataCache.platform, platform.toUpperCase()),
            eq(socialMediaDataCache.profileId, profileId)
          )
        )
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const entry = result[0];
      
      // Check if cache has expired
      if (new Date() > entry.expiresAt) {
        return null;
      }

      return entry;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all cached data for a company and platform
   */
  public async getCompanyPlatformData(
    companyId: string,
    platform: string
  ): Promise<CacheEntry[]> {
    try {
      const result = await db
        .select()
        .from(socialMediaDataCache)
        .where(
          and(
            eq(socialMediaDataCache.companyId, companyId),
            eq(socialMediaDataCache.platform, platform.toUpperCase())
          )
        );

      // Filter out expired entries
      const validEntries = result.filter(entry => new Date() <= entry.expiresAt);
      
      return validEntries;
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if we have fresh data (fetched within last 5 minutes)
   */
  public async hasFreshData(
    companyId: string,
    platform: string,
    profileId: string
  ): Promise<boolean> {
    try {
      const entry = await this.getData(companyId, platform, profileId);
      if (!entry) return false;

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return entry.lastFetchedAt > fiveMinutesAgo;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clean up expired cache entries
   */
  public async cleanupExpired(): Promise<number> {
    try {
      const result = await db
        .delete(socialMediaDataCache)
        .where(lt(socialMediaDataCache.expiresAt, new Date()));

      return result.rowCount || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  public async getCacheStats(companyId?: string): Promise<{
    total: number;
    expired: number;
    valid: number;
    byPlatform: Record<string, number>;
  }> {
    try {
      let query = db.select().from(socialMediaDataCache);
      
      if (companyId) {
        query = query.where(eq(socialMediaDataCache.companyId, companyId));
      }

      const result = await query;
      const now = new Date();
      
      let expired = 0;
      let valid = 0;
      const byPlatform: Record<string, number> = {};

      result.forEach(entry => {
        if (now > entry.expiresAt) {
          expired++;
        } else {
          valid++;
        }
        
        byPlatform[entry.platform] = (byPlatform[entry.platform] || 0) + 1;
      });

      return {
        total: result.length,
        expired,
        valid,
        byPlatform,
      };
    } catch (error) {
      return { total: 0, expired: 0, valid: 0, byPlatform: {} };
    }
  }
}

export const socialMediaCacheService = SocialMediaCacheService.getInstance();
