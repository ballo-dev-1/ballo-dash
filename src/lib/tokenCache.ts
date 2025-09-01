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
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

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
  }

  /**
   * Clear a specific token from cache
   */
  public clearToken(companyId: string, integrationType: string): void {
    const cacheKey = this.getCacheKey(companyId, integrationType);
    this.cache.delete(cacheKey);
  }

  /**
   * Clear all tokens for a company
   */
  public clearCompanyTokens(companyId: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (value.companyId === companyId) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all expired tokens
   */
  public clearExpiredTokens(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      if (now > value.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { total: number; expired: number; valid: number } {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    this.cache.forEach((value) => {
      if (now > value.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    });

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
  }
}

export const tokenCache = TokenCacheService.getInstance();
