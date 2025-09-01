interface FacebookPageInfo {
  id: string;
  name: string;
  category?: string;
  fanCount?: number;
  profilePictureUrl?: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  insights?: Record<string, any>;
}

interface FacebookMetrics {
  pageImpressions?: number;
  pageEngagedUsers?: number;
  pagePostEngagements?: number;
  pageActionsPostReactionsTotal?: number;
}

class FacebookService {
  private static instance: FacebookService;
  private pageInfo: Record<string, FacebookPageInfo> = {};
  private posts: Record<string, FacebookPost[]> = {};
  private metrics: Record<string, FacebookMetrics> = {};
  private isLoading: Record<string, boolean> = {};
  private lastFetch: Record<string, number> = {};
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  private constructor() {}

  public static getInstance(): FacebookService {
    if (!FacebookService.instance) {
      FacebookService.instance = new FacebookService();
    }
    return FacebookService.instance;
  }

  public async getPageInfo(pageId: string, platform: string = 'facebook'): Promise<MetaPageInfo | null> {
    const cacheKey = `pageInfo_${platform}_${pageId}`;
    
    if (this.pageInfo[cacheKey] && this.isDataFresh(cacheKey)) {
      console.log('FacebookService: Returning cached page info');
      return this.pageInfo[cacheKey];
    }

    if (this.isLoading[cacheKey]) {
      console.log('FacebookService: Page info request already in progress, waiting...');
      while (this.isLoading[cacheKey]) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.pageInfo[cacheKey];
    }

    try {
      console.log('FacebookService: Fetching page info...');
      this.isLoading[cacheKey] = true;
      
      const response = await fetch(`/api/data/facebook/pageInfo?pageId=${pageId}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page info: ${response.status}`);
      }

      const data = await response.json();
      this.pageInfo[cacheKey] = data;
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('FacebookService: Page info stored in cache');
      return this.pageInfo[cacheKey];
    } catch (error) {
      console.error('❌ FacebookService: Error fetching page info:', error);
      return null;
    } finally {
      this.isLoading[cacheKey] = false;
    }
  }

  public async getPosts(pageId: string, platform: string = 'facebook'): Promise<MetaPost[] | null> {
    const cacheKey = `posts_${platform}_${pageId}`;
    
    if (this.posts[cacheKey] && this.isDataFresh(cacheKey)) {
      console.log('FacebookService: Returning cached posts');
      return this.posts[cacheKey];
    }

    if (this.isLoading[cacheKey]) {
      console.log('FacebookService: Posts request already in progress, waiting...');
      while (this.isLoading[cacheKey]) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.posts[cacheKey];
    }

    try {
      console.log('FacebookService: Fetching posts...');
      this.isLoading[cacheKey] = true;
      
      const response = await fetch(`/api/data/facebook/posts?pageId=${pageId}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      this.posts[cacheKey] = data.posts || [];
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('FacebookService: Posts stored in cache');
      return this.posts[cacheKey];
    } catch (error) {
      console.error('❌ FacebookService: Error fetching posts:', error);
      return null;
    } finally {
      this.isLoading[cacheKey] = false;
    }
  }

  public async getMetrics(pageId: string, metric: string, platform: string = 'facebook'): Promise<MetaMetrics | null> {
    const cacheKey = `metrics_${platform}_${pageId}_${metric}`;
    
    if (this.metrics[cacheKey] && this.isDataFresh(cacheKey)) {
      console.log(`FacebookService: Returning cached ${metric} metrics`);
      return this.metrics[cacheKey];
    }

    try {
      console.log(`FacebookService: Fetching ${metric} metrics...`);
      
      const response = await fetch(`/api/data/facebook/metric?pageId=${pageId}&metric=${metric}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${metric} metrics: ${response.status}`);
      }

      const data = await response.json();
      this.metrics[cacheKey] = data;
      this.lastFetch[cacheKey] = Date.now();
      
      console.log(`FacebookService: ${metric} metrics stored in cache`);
      return this.metrics[cacheKey];
    } catch (error) {
      console.error(`❌ FacebookService: Error fetching ${metric} metrics:`, error);
      return null;
    }
  }

    public async getMultipleMetrics(pageId: string, metrics: string[], platform: string = 'facebook'): Promise<Record<string, FacebookMetrics>> {
    console.log(`FacebookService: Fetching multiple metrics: ${metrics.join(', ')}`);
    
    const results: Record<string, FacebookMetrics> = {};
    
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
      console.log('FacebookService: Returning cached stats');
      return null; // Stats are usually not cached for long
    }

    try {
      console.log('FacebookService: Fetching stats...');
      
      const response = await fetch(`/api/data/facebook/stats?pageId=${pageId}&platform=${platform}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      this.lastFetch[cacheKey] = Date.now();
      
      console.log('FacebookService: Stats fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ FacebookService: Error fetching stats:', error);
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

export const facebookService = FacebookService.getInstance();
