interface MetaPageInfo {
  id: string;
  name: string;
  category?: string;
  fanCount?: number;
  profilePictureUrl?: string;
}

interface MetaPost {
  id: string;
  message?: string;
  created_time: string;
  insights?: Record<string, any>;
}

interface MetaMetrics {
  pageImpressions?: number;
  pageEngagedUsers?: number;
  pagePostEngagements?: number;
  pageActionsPostReactionsTotal?: number;
}

class MetaService {
  private static instance: MetaService;
  private pageInfo: Record<string, MetaPageInfo> = {};
  private posts: Record<string, MetaPost[]> = {};
  private metrics: Record<string, MetaMetrics> = {};
  private isLoading: Record<string, boolean> = {};
  private lastFetch: Record<string, number> = {};
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  private constructor() {}

  public static getInstance(): MetaService {
    if (!MetaService.instance) {
      MetaService.instance = new MetaService();
    }
    return MetaService.instance;
  }

  public async getPageInfo(pageId: string, platform: string = 'facebook'): Promise<MetaPageInfo | null> {
    const cacheKey = `pageInfo_${platform}_${pageId}`;
    
    if (this.pageInfo[cacheKey] && this.isDataFresh(cacheKey)) {
      console.log('🔍 MetaService: Returning cached page info');
      return this.pageInfo[cacheKey];
    }

    if (this.isLoading[cacheKey]) {
      console.log('🔍 MetaService: Page info request already in progress, waiting...');
      while (this.isLoading[cacheKey]) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.pageInfo[cacheKey];
    }

    try {
      console.log('🔍 MetaService: Fetching page info...');
      this.isLoading[cacheKey] = true;
      
      const response = await fetch(`/api/data/meta/pageInfo?pageId=${pageId}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page info: ${response.status}`);
      }

      const data = await response.json();
      this.pageInfo[cacheKey] = data;
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('🔍 MetaService: Page info stored in cache');
      return this.pageInfo[cacheKey];
    } catch (error) {
      console.error('❌ MetaService: Error fetching page info:', error);
      return null;
    } finally {
      this.isLoading[cacheKey] = false;
    }
  }

  public async getPosts(pageId: string, platform: string = 'facebook'): Promise<MetaPost[] | null> {
    const cacheKey = `posts_${platform}_${pageId}`;
    
    if (this.posts[cacheKey] && this.isDataFresh(cacheKey)) {
      console.log('🔍 MetaService: Returning cached posts');
      return this.posts[cacheKey];
    }

    if (this.isLoading[cacheKey]) {
      console.log('🔍 MetaService: Posts request already in progress, waiting...');
      while (this.isLoading[cacheKey]) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.posts[cacheKey];
    }

    try {
      console.log('🔍 MetaService: Fetching posts...');
      this.isLoading[cacheKey] = true;
      
      const response = await fetch(`/api/data/meta/posts?pageId=${pageId}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      this.posts[cacheKey] = data.posts || [];
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('🔍 MetaService: Posts stored in cache');
      return this.posts[cacheKey];
    } catch (error) {
      console.error('❌ MetaService: Error fetching posts:', error);
      return null;
    } finally {
      this.isLoading[cacheKey] = false;
    }
  }

  public async getMetrics(pageId: string, metric: string, platform: string = 'facebook'): Promise<MetaMetrics | null> {
    const cacheKey = `metrics_${platform}_${pageId}_${metric}`;
    
    if (this.metrics[cacheKey] && this.isDataFresh(cacheKey)) {
      console.log(`🔍 MetaService: Returning cached ${metric} metrics`);
      return this.metrics[cacheKey];
    }

    try {
      console.log(`🔍 MetaService: Fetching ${metric} metrics...`);
      
      const response = await fetch(`/api/data/meta/metric?pageId=${pageId}&metric=${metric}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${metric} metrics: ${response.status}`);
      }

      const data = await response.json();
      this.metrics[cacheKey] = data;
      this.lastFetch[cacheKey] = Date.now();
      
      console.log(`🔍 MetaService: ${metric} metrics stored in cache`);
      return this.metrics[cacheKey];
    } catch (error) {
      console.error(`❌ MetaService: Error fetching ${metric} metrics:`, error);
      return null;
    }
  }

  public async getMultipleMetrics(pageId: string, metrics: string[], platform: string = 'facebook'): Promise<Record<string, MetaMetrics>> {
    console.log(`🔍 MetaService: Fetching multiple metrics: ${metrics.join(', ')}`);
    
    const results: Record<string, MetaMetrics> = {};
    
    // Fetch metrics in parallel for better performance
    const promises = metrics.map(async (metric) => {
      const data = await this.getMetrics(pageId, metric, platform);
      if (data) {
        results[metric] = data;
      }
    });
    
    await Promise.all(promises);
    
    return results;
  }

  public async getStats(pageId: string, platform: string = 'facebook'): Promise<any | null> {
    const cacheKey = `stats_${platform}_${pageId}`;
    
    if (this.isDataFresh(cacheKey)) {
      console.log('🔍 MetaService: Returning cached stats');
      return null; // Stats are usually not cached for long
    }

    try {
      console.log('🔍 MetaService: Fetching stats...');
      
      const response = await fetch(`/api/data/meta/stats?pageId=${pageId}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('🔍 MetaService: Stats fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ MetaService: Error fetching stats:', error);
      return null;
    }
  }

  private isDataFresh(cacheKey: string): boolean {
    const lastFetch = this.lastFetch[cacheKey];
    return lastFetch && (Date.now() - lastFetch < this.CACHE_DURATION);
  }

  public clearCache(): void {
    this.pageInfo = {};
    this.posts = {};
    this.metrics = {};
    this.lastFetch = {};
  }

  public clearPageCache(platform: string, pageId: string): void {
    const keysToDelete = Object.keys(this.lastFetch).filter(key => 
      key.includes(`${platform}_${pageId}`)
    );
    
    keysToDelete.forEach(key => {
      delete this.lastFetch[key];
      if (key.startsWith('pageInfo_')) {
        delete this.pageInfo[key];
      } else if (key.startsWith('posts_')) {
        delete this.posts[key];
      } else if (key.startsWith('metrics_')) {
        delete this.metrics[key];
      }
    });
  }
}

export const metaService = MetaService.getInstance();
