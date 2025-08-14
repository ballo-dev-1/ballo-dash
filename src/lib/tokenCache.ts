interface CachedToken {
  token: string;
  expiresAt: number;
  companyId: string;
  integrationType: string;
}

class TokenCacheService {
  private static instance: TokenCacheService;
  private cache: Map<string, CachedToken> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): TokenCacheService {
    if (!TokenCacheService.instance) {
      TokenCacheService.instance = new TokenCacheService();
    }
    return TokenCacheService.instance;
  }

  /**
   * Generate a cache key for a token
   */
  private getCacheKey(companyId: string, integrationType: string): string {
    return `${companyId}:${integrationType}`;
  }

  /**
   * Get a cached token if it exists and is still valid
   */
  public getCachedToken(companyId: string, integrationType: string): string | null {
    const cacheKey = this.getCacheKey(companyId, integrationType);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      console.log(`🔍 TokenCache: No cached token for ${integrationType} (${companyId})`);
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      console.log(`🔍 TokenCache: Cached token for ${integrationType} (${companyId}) has expired`);
      this.cache.delete(cacheKey);
      return null;
    }

    console.log(`✅ TokenCache: Using cached token for ${integrationType} (${companyId})`);
    return cached.token;
  }

  /**
   * Store a token in the cache
   */
  public cacheToken(companyId: string, integrationType: string, token: string): void {
    const cacheKey = this.getCacheKey(companyId, integrationType);
    const expiresAt = Date.now() + this.CACHE_DURATION;

    this.cache.set(cacheKey, {
      token,
      expiresAt,
      companyId,
      integrationType
    });

    console.log(`💾 TokenCache: Stored ${integrationType} token for company ${companyId} (expires in 5 minutes)`);
  }

  /**
   * Clear a specific token from cache
   */
  public clearToken(companyId: string, integrationType: string): void {
    const cacheKey = this.getCacheKey(companyId, integrationType);
    this.cache.delete(cacheKey);
    console.log(`🗑️ TokenCache: Cleared ${integrationType} token for company ${companyId}`);
  }

  /**
   * Clear all tokens for a company
   */
  public clearCompanyTokens(companyId: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (value.companyId === companyId) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🗑️ TokenCache: Cleared all tokens for company ${companyId}`);
  }

  /**
   * Clear all expired tokens
   */
  public clearExpiredTokens(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🧹 TokenCache: Cleaned up ${keysToDelete.length} expired tokens`);
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { total: number; expired: number; valid: number } {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    for (const value of this.cache.values()) {
      if (now > value.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      expired,
      valid
    };
  }

  /**
   * Clear entire cache
   */
  public clearAll(): void {
    this.cache.clear();
    console.log(`🗑️ TokenCache: Cleared entire cache`);
  }
}

export const tokenCache = TokenCacheService.getInstance();
