// src/services/dataTransformationService.ts

import { extractMetricValue } from '@/lib/stats-utils';
import type { StandardStatsResponse } from '@/types/shared-stats';

export interface PlatformOverview {
  platform: string;
  pageName: string;
  page_fans: any;
  page_follows: any;
  page_status?: any;
  "Reach (day)"?: any;
  "Reach (week)"?: any;
  "Reach (month)"?: any;
  "Engagement (day)"?: any;
  "Engagement (week)"?: any;
  "Engagement (month)"?: any;
  "CTA Clicks (day)"?: any;
  "CTA Clicks (week)"?: any;
  "CTA Clicks (month)"?: any;
  engagement?: any;
  last_post_date?: any;
}

export interface PlatformAudienceOverview {
  platform: string;
  pageName: string;
  pageFollowersCity?: any;
  pageFollowersCountry?: any;
  pageLikesValue?: any;
}

export interface ProgressiveFacebookData {
  pageInfo: any;
  metrics: Record<string, any>;
  recentPost: any;
  loadingMetrics: any;
  platform: string;
  datePreset?: string;
}

export interface ProgressiveLinkedInData {
  organizationId: string;
  organizationName: string;
  followers: number | null;
  impressionCount: number;
  uniqueImpressionsCount: number;
  clickCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  shareMentionsCount: number;
  commentMentionsCount: number;
  engagement: number;
  since: string;
  until: string;
  datePreset: string;
}

export interface XData {
  username: string;
  userId: string;
  name: string;
  description: string;
  profileImageUrl: string;
  verified: boolean;
  followers: number;
  following: number;
  tweetCount: number;
  listedCount: number;
  likeCount: number;
  mediaCount: number;
  since: string;
  until: string;
  datePreset: string;
}

export interface ProgressiveXData {
  username: string;
  platform: string;
  userId: string;
  name: string;
  description: string;
  profileImageUrl: string;
  verified: boolean;
  followers: number;
  following: number;
  tweetCount: number;
  listedCount: number;
  likeCount: number;
  mediaCount: number;
  since: string;
  until: string;
  datePreset: string;
  loadingMetrics: string[];
  completedMetrics: string[];
}

export interface InstagramData {
  userInfo: {
    username: string;
    id: string;
    platform: string;
    biography?: string;
    followers_count?: number;
  };
  metrics: {
    followers: number;
    reach: number;
    threadsViews: number;
    websiteClicks: number;
    profileViews: number;
    accountsEngaged: number;
    totalInteractions: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    replies: number;
    followsAndUnfollows: number;
    profileLinksTaps: number;
    views: number;
    contentViews: number;
  };
  recentPost?: any;
  since?: string;
  until?: string;
  datePreset?: string;
}

export interface ProgressiveInstagramData {
  userInfo: {
    username: string;
    id: string;
    platform: string;
    biography?: string;
    followers_count?: number;
  };
  metrics: {
    followers: number;
    reach: number;
    threadsViews: number;
    websiteClicks: number;
    profileViews: number;
    accountsEngaged: number;
    totalInteractions: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    replies: number;
    followsAndUnfollows: number;
    profileLinksTaps: number;
    views: number;
    contentViews: number;
  };
  since?: string;
  until?: string;
  datePreset?: string;
  loadingMetrics: string[];
  completedMetrics: string[];
}

export interface LinkedInData {
  organizationId: string;
  organizationName: string;
  followers: number | null;
  impressionCount: number;
  uniqueImpressionsCount: number;
  clickCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  shareMentionsCount: number;
  commentMentionsCount: number;
  engagement: number;
  since: string;
  until: string;
  datePreset: string;
}

export interface FacebookData {
  platform: string;
  pageInfo: any;
  metrics: Record<string, any>;
  recentPost: any;
}

class DataTransformationService {
  private static instance: DataTransformationService;

  private constructor() {}

  public static getInstance(): DataTransformationService {
    if (!DataTransformationService.instance) {
      DataTransformationService.instance = new DataTransformationService();
    }
    return DataTransformationService.instance;
  }

  /**
   * Check if data is in standardized format (has accountInfo and nested metrics)
   */
  private isStandardizedFormat(data: any): data is StandardStatsResponse {
    return data && data.accountInfo && data.metrics && data.cache && data.dateRange;
  }

  /**
   * Extract metric value from either standardized or legacy format
   */
  private getMetricValue(
    data: any,
    metricName: string,
    fallbackPath?: string[]
  ): any {
    // Try standardized format first
    if (this.isStandardizedFormat(data)) {
      return extractMetricValue(data.metrics, metricName, '-');
    }

    // Fallback to legacy format
    if (fallbackPath && data) {
      let value = data;
      for (const key of fallbackPath) {
        value = value?.[key];
        if (value === undefined) return '-';
      }
      return value;
    }

    return '-';
  }

  /**
   * Transform Facebook data to PlatformOverview format
   * Uses the new simplified structure with proper typing
   */
  public transformFacebookData(facebookData: FacebookData | any): PlatformOverview | null {
    if (!facebookData) return null;

    const { pageInfo, accountInfo, metrics, recentPost } = facebookData;
    
    // Defensive check for metrics
    if (!metrics || typeof metrics !== 'object') {
      console.warn('[DataTransform] Invalid metrics structure in Facebook data');
      return null;
    }
    
    // Use accountInfo if available (new format), otherwise fall back to pageInfo (old format)
    const pageName = accountInfo?.name ?? pageInfo?.name ?? "-";

    // Handle both FLAT and PERIOD-NESTED formats
    const getMetricValue = (metricName: string, defaultValue: any = "-") => {
      if (!metrics || !metrics[metricName]) {
        return defaultValue;
      }
      
      const metricData = metrics[metricName] as any;
      
      // NEW FORMAT: Flat structure with values array directly
      if (metricData.values && Array.isArray(metricData.values)) {
        return metricData.values.length > 0 ? metricData.values[metricData.values.length - 1].value : defaultValue;
      }
      
      // OLD FORMAT: Period-nested structure (backward compatibility)
      const periods = ['lifetime', 'day', 'week', 'days_28'];
      for (const period of periods) {
        if (metricData[period]?.values && Array.isArray(metricData[period].values)) {
      const values = metricData[period].values;
          if (values.length > 0) {
            return values[values.length - 1].value;
          }
        }
      }
      
      return defaultValue;
    };

    // Helper function to format recent post date
    const getRecentPostDate = () => {
      if (!recentPost?.data?.[0]?.created_time) return "-";
      
      const rawDate = recentPost.data[0].created_time;
      const isoDateStr = rawDate.replace("+0000", "Z");
      const parsedDate = new Date(isoDateStr);
      
      return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
    };

    const likes = getMetricValue("page_likes");
    const follows = getMetricValue("page_follows");
    const reach = getMetricValue("page_reach");
    const engagement = getMetricValue("page_post_engagements");
    const actions = getMetricValue("page_actions");

    return {
      platform: "Facebook",
      pageName,
      page_fans: likes,
      page_follows: follows,
      page_status: getMetricValue("page_status"),
      "Reach (day)": reach,
      "Reach (week)": reach, // Flat structure doesn't have periods
      "Reach (month)": reach,
      "Engagement (day)": engagement,
      "Engagement (week)": engagement,
      "Engagement (month)": engagement,
      "CTA Clicks (day)": actions,
      "CTA Clicks (week)": actions,
      "CTA Clicks (month)": actions,
      engagement: engagement,
      last_post_date: getRecentPostDate(),
    };
  }

  /**
   * Transform progressive Facebook data to PlatformOverview format
   * Simplified version without complex quarter logic
   */
  public transformProgressiveFacebookData(progressiveData: ProgressiveFacebookData | any): PlatformOverview | null {
    if (!progressiveData) return null;

    const { pageInfo, accountInfo, metrics, recentPost, loadingMetrics } = progressiveData;
    
    // Defensive check for metrics
    if (!metrics || typeof metrics !== 'object') {
      console.warn('[DataTransform] Invalid metrics structure in progressive Facebook data');
      return null;
    }
    
    // Use accountInfo if available (new format), otherwise fall back to pageInfo (old format)
    const pageName = accountInfo?.name ?? pageInfo?.name ?? "-";

    // Handle both FLAT and PERIOD-NESTED formats with loading state
    const getMetricValue = (metricName: string, defaultValue: any = "-") => {
      // Check if this metric is still loading
      if (loadingMetrics?.includes(metricName)) {
        return "Loading...";
      }
      
      if (!metrics || !metrics[metricName]) {
        return defaultValue;
      }
      
      const metricData = metrics[metricName] as any;
      
      // NEW FORMAT: Flat structure with values array directly
      if (metricData.values && Array.isArray(metricData.values)) {
        return metricData.values.length > 0 ? metricData.values[metricData.values.length - 1].value : defaultValue;
      }
      
      // OLD FORMAT: Period-nested structure (backward compatibility)
      const periods = ['lifetime', 'day', 'week', 'days_28'];
      for (const period of periods) {
        if (metricData[period]?.values && Array.isArray(metricData[period].values)) {
          const values = metricData[period].values;
          if (values.length > 0) {
            return values[values.length - 1].value;
          }
        }
      }
      
      return defaultValue;
    };

    // Helper function to format recent post date
    const getRecentPostDate = () => {
      if (!recentPost?.data?.[0]?.created_time) return "-";
      
      const rawDate = recentPost.data[0].created_time;
      const isoDateStr = rawDate.replace("+0000", "Z");
      const parsedDate = new Date(isoDateStr);
      
      return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
    };

    const likes = getMetricValue("page_likes");
    const follows = getMetricValue("page_follows");
    const reach = getMetricValue("page_reach");
    const engagement = getMetricValue("page_post_engagements");
    const actions = getMetricValue("page_actions");

    return {
      platform: progressiveData.platform || "Facebook",
      pageName,
      page_fans: likes,
      page_follows: follows,
      page_status: getMetricValue("page_status"),
      "Reach (day)": reach,
      "Reach (week)": reach, // Flat structure doesn't have periods
      "Reach (month)": reach,
      "Engagement (day)": engagement,
      "Engagement (week)": engagement,
      "Engagement (month)": engagement,
      "CTA Clicks (day)": actions,
      "CTA Clicks (week)": actions,
      "CTA Clicks (month)": actions,
      engagement: engagement,
      last_post_date: getRecentPostDate(),
    };
  }

  /**
   * Transform LinkedIn data to PlatformOverview format
   */
  public transformLinkedInData(linkedInData: LinkedInData | any): PlatformOverview | null {
    if (!linkedInData) return null;

    // Helper function to extract metric value from flat structure
    const getMetricValue = (metrics: any, metricName: string): number | null => {
      const metricData = metrics?.[metricName];
      if (!metricData || !metricData.values || metricData.values.length === 0) {
        return null;
      }
      return metricData.values[metricData.values.length - 1].value;
    };

    // Check if using new standardized format with accountInfo and flat metrics
    const isStandardized = linkedInData.accountInfo && linkedInData.metrics;
    
    let pageName, followers, impressions, engagement, clicks;
    
    if (isStandardized) {
      // NEW FORMAT: Use accountInfo and flat metrics
      pageName = linkedInData.accountInfo.name || "LinkedIn Company";
      followers = getMetricValue(linkedInData.metrics, "page_follows");
      impressions = getMetricValue(linkedInData.metrics, "impression_count");
      engagement = getMetricValue(linkedInData.metrics, "engagement");
      clicks = getMetricValue(linkedInData.metrics, "click_count");
    } else {
      // OLD FORMAT: Use flat structure
      pageName = linkedInData.organizationName || "LinkedIn Company";
      followers = linkedInData.followers;
      impressions = linkedInData.impressionCount;
      engagement = linkedInData.engagement;
      clicks = linkedInData.clickCount;
    }

    return {
      platform: "LinkedIn",
      pageName,
      page_fans: followers || "-",
      page_follows: followers || "-",
      "Reach (day)": impressions || "-",
      "Reach (week)": impressions || "-",
      "Reach (month)": impressions || "-",
      "Engagement (day)": engagement || "-",
      "Engagement (week)": engagement || "-",
      "Engagement (month)": engagement || "-",
      "CTA Clicks (day)": clicks || "-",
      "CTA Clicks (week)": clicks || "-",
      "CTA Clicks (month)": clicks || "-",
      engagement: engagement || "-",
      last_post_date: "-", // LinkedIn posts are fetched separately
    };
  }

  /**
   * Transform progressive LinkedIn data to PlatformOverview format
   */
  public transformProgressiveLinkedInData(progressiveLinkedInData: ProgressiveLinkedInData | any): PlatformOverview | null {
    console.log("🔄 [Transform] transformProgressiveLinkedInData called with:", progressiveLinkedInData);
    
    if (!progressiveLinkedInData) {
      console.log("❌ [Transform] No LinkedIn data provided");
      return null;
    }

    // Helper function to extract metric value from standardized structure
    const getMetricValueFromMetrics = (metricName: string): number | null => {
      const metricData = progressiveLinkedInData.metrics?.[metricName];
      if (!metricData || !metricData.values || metricData.values.length === 0) {
        return null;
      }
      return metricData.values[metricData.values.length - 1].value;
    };

    // Check if using new standardized format (has accountInfo and metrics with values arrays)
    const hasStandardizedFormat = progressiveLinkedInData.accountInfo && 
                                   progressiveLinkedInData.metrics &&
                                   typeof progressiveLinkedInData.metrics === 'object';
    
    console.log("📊 [Transform] Format detected:", hasStandardizedFormat ? "STANDARDIZED" : "LEGACY");
    
    let pageName, followers, impressions, engagement, clicks;
    
    if (hasStandardizedFormat) {
      // NEW STANDARDIZED FORMAT: Use accountInfo and metrics with values arrays
      console.log("✨ [Transform] Using standardized format transformation");
      pageName = progressiveLinkedInData.accountInfo?.name ?? progressiveLinkedInData.organizationName ?? "LinkedIn Company";
      
      // Try to extract from standardized metrics first, then fall back to flat properties
      followers = getMetricValueFromMetrics("page_follows") ?? progressiveLinkedInData.followers;
      impressions = getMetricValueFromMetrics("impression_count") ?? progressiveLinkedInData.impressionCount;
      engagement = getMetricValueFromMetrics("engagement") ?? progressiveLinkedInData.engagement;
      clicks = getMetricValueFromMetrics("click_count") ?? progressiveLinkedInData.clickCount;
      
      console.log("📈 [Transform] Extracted values:", {
        pageName,
        followers,
        impressions,
        engagement,
        clicks
      });
    } else {
      // OLD LEGACY FORMAT: Use flat structure
      console.log("🔙 [Transform] Using legacy format transformation");
      pageName = progressiveLinkedInData.organizationName || "LinkedIn Company";
      followers = progressiveLinkedInData.followers;
      impressions = progressiveLinkedInData.impressionCount;
      engagement = progressiveLinkedInData.engagement;
      clicks = progressiveLinkedInData.clickCount;
      
      console.log("📈 [Transform] Legacy values:", {
        pageName,
        followers,
        impressions,
        engagement,
        clicks
      });
    }

    const result = {
      platform: "LinkedIn",
      pageName,
      page_fans: followers || "-",
      page_follows: followers || "-",
      "Reach (day)": impressions || "-",
      "Reach (week)": impressions || "-",
      "Reach (month)": impressions || "-",
      "Engagement (day)": engagement || "-",
      "Engagement (week)": engagement || "-",
      "Engagement (month)": engagement || "-",
      "CTA Clicks (day)": clicks || "-",
      "CTA Clicks (week)": clicks || "-",
      "CTA Clicks (month)": clicks || "-",
      engagement: engagement || "-",
      last_post_date: "-", // LinkedIn posts are fetched separately
    };
    
    console.log("✅ [Transform] Final PlatformOverview:", result);
    return result;
  }

  /**
   * Transform X data to PlatformOverview format
   */
  public transformXData(xData: XData): PlatformOverview | null {
    if (!xData) return null;

    // Defensive check for required fields
    if (!xData.username) {
      return null;
    }

    const username = xData.username || "Unknown";
    const name = xData.name || username;
    
    // Extract metrics directly from the data structure
    const followers = xData.followers || 0;
    const following = xData.following || 0;
    const tweetCount = xData.tweetCount || 0;
    const likeCount = xData.likeCount || 0;
    const mediaCount = xData.mediaCount || 0;

    return {
      platform: "X (Twitter)",
      pageName: name || username || "X Account",
      page_fans: likeCount || "-",
      page_follows: followers || "-",
      "Reach (day)": followers || "-",
      "Reach (week)": followers || "-",
      "Reach (month)": followers || "-",
      "Engagement (day)": likeCount || "-",
      "Engagement (week)": likeCount || "-",
      "Engagement (month)": likeCount || "-",
      "CTA Clicks (day)": mediaCount || "-",
      "CTA Clicks (week)": mediaCount || "-",
      "CTA Clicks (month)": mediaCount || "-",
      engagement: likeCount || "-",
      last_post_date: "-", // X posts are fetched separately
    };
  }

  /**
   * Transform X data for Audience view
   */
  public transformXDataForAudience(xData: XData): PlatformAudienceOverview | null {
    if (!xData) return null;

    // Defensive check for required fields
    if (!xData.username) {
      return null;
    }

    const username = xData.username || "Unknown";
    const name = xData.name || username;
    const followers = xData.followers || 0;
    const likes = xData.likeCount || 0;

    return {
      platform: "X (Twitter)",
      pageName: name || username || "X Account",
      pageFollowersCity: "Global",
      pageFollowersCountry: "Global",
      pageLikesValue: likes ? likes.toLocaleString() : "-",
    };
  }

  /**
   * Transform progressive X data to PlatformOverview format
   */
  public transformProgressiveXData(progressiveData: ProgressiveXData): PlatformOverview | null {
    if (!progressiveData) return null;

    // Defensive check for required fields
    if (!progressiveData.username) {
      return null;
    }

    const username = progressiveData.username || "Unknown";
    const name = progressiveData.name || username;
    
    // Helper function to get metric value with loading state
    const getMetricValue = (metricName: string, defaultValue: any = "-") => {
      if (progressiveData.loadingMetrics?.includes(metricName)) {
        return "Loading...";
      }
      
      switch (metricName) {
        case "followers":
          return progressiveData.followers || defaultValue;
        case "following":
          return progressiveData.following || defaultValue;
        case "tweets":
          return progressiveData.tweetCount || defaultValue;
        case "likes":
          return progressiveData.likeCount || defaultValue;
        case "media":
          return progressiveData.mediaCount || defaultValue;
        default:
          return defaultValue;
      }
    };

    return {
      platform: "X (Twitter)",
      pageName: name || username || "X Account",
      page_fans: getMetricValue("likes"),
      page_follows: getMetricValue("followers"),
      "Reach (day)": getMetricValue("followers"),
      "Reach (week)": getMetricValue("followers"),
      "Reach (month)": getMetricValue("followers"),
      "Engagement (day)": getMetricValue("likes"),
      "Engagement (week)": getMetricValue("likes"),
      "Engagement (month)": getMetricValue("likes"),
      "CTA Clicks (day)": getMetricValue("media"),
      "CTA Clicks (week)": getMetricValue("media"),
      "CTA Clicks (month)": getMetricValue("media"),
      engagement: getMetricValue("likes"),
      last_post_date: "-", // X posts are fetched separately
    };
  }

  /**
   * Transform Instagram data to PlatformOverview format
   * Supports both legacy and standardized formats
   */
  public transformInstagramData(instagramData: InstagramData | any): PlatformOverview | null {
    if (!instagramData) return null;

    // Check if standardized format
    if (this.isStandardizedFormat(instagramData)) {
      return this.transformStandardizedData(instagramData);
    }

    // Legacy format handling
    // Defensive check for required fields
    if (!instagramData.userInfo?.username) {
      return null;
    }

    const username = instagramData.userInfo.username;
    const biography = instagramData.userInfo.biography || "";
    const profileFollowers = instagramData.userInfo.followers_count;
    const metrics = instagramData.metrics;

    // Create a more descriptive page name that includes bio if available
    const pageName = username;

    // Use profile follower count if available, otherwise fallback to insights follower count
    const followers = profileFollowers || metrics.followers || 0;

    // Helper function to format recent post date
    const getRecentPostDate = () => {
      if (!instagramData.recentPost?.data?.[0]?.timestamp) return "-";
      
      const rawDate = instagramData.recentPost.data[0].timestamp;
      const parsedDate = new Date(rawDate);
      
      return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
    };

    return {
      platform: "Instagram",
      pageName: pageName || "Instagram Account",
      page_fans: followers || "-",
      page_follows: followers || "-",
      "Reach (day)": metrics.reach || "-",
      "Reach (week)": metrics.reach || "-",
      "Reach (month)": metrics.reach || "-",
      "Engagement (day)": metrics.totalInteractions || "-",
      "Engagement (week)": metrics.totalInteractions || "-",
      "Engagement (month)": metrics.totalInteractions || "-",
      "CTA Clicks (day)": metrics.websiteClicks || "-",
      "CTA Clicks (week)": metrics.websiteClicks || "-",
      "CTA Clicks (month)": metrics.websiteClicks || "-",
      engagement: metrics.totalInteractions || "-",
      last_post_date: getRecentPostDate(),
    };
  }

  /**
   * Transform Instagram data for Audience view
   */
  public transformInstagramDataForAudience(instagramData: InstagramData): PlatformAudienceOverview | null {
    if (!instagramData) return null;

    // Defensive check for required fields
    if (!instagramData.userInfo?.username) {
      return null;
    }

    const username = instagramData.userInfo.username;
    const profileFollowers = instagramData.userInfo.followers_count;
    const metrics = instagramData.metrics;

    // Use profile follower count if available, otherwise fallback to insights follower count
    const followers = profileFollowers || metrics.followers || 0;

    return {
      platform: "Instagram",
      pageName: username || "Instagram Account",
      pageFollowersCity: "Global",
      pageFollowersCountry: "Global",
      pageLikesValue: followers ? followers.toLocaleString() : "-",
    };
  }

  /**
   * Transform progressive Instagram data to PlatformOverview format
   */
  public transformProgressiveInstagramData(progressiveData: ProgressiveInstagramData): PlatformOverview | null {
    if (!progressiveData) return null;

    // Defensive check for required fields
    if (!progressiveData.userInfo?.username) {
      return null;
    }

    const username = progressiveData.userInfo.username;
    const biography = progressiveData.userInfo.biography || "";
    const profileFollowers = progressiveData.userInfo.followers_count;
    const metrics = progressiveData.metrics;

    // Helper function to get metric value with loading state
    const getMetricValue = (metricName: string, defaultValue: any = "-") => {
      if (progressiveData.loadingMetrics?.includes(metricName)) {
        return "Loading...";
      }
      
      switch (metricName) {
        case "followers":
          return profileFollowers || metrics.followers || defaultValue;
        case "reach":
          return metrics.reach || defaultValue;
        case "engagement":
          return metrics.totalInteractions || defaultValue;
        case "website_clicks":
          return metrics.websiteClicks || defaultValue;
        default:
          return defaultValue;
      }
    };

    // Create a more descriptive page name that includes bio if available
    const pageName = username;

    // Use profile follower count if available, otherwise fallback to insights follower count
    const followers = profileFollowers || metrics.followers || 0;

    return {
      platform: "Instagram",
      pageName: pageName || "Instagram Account",
      page_fans: getMetricValue("followers"),
      page_follows: getMetricValue("followers"),
      "Reach (day)": getMetricValue("reach"),
      "Reach (week)": getMetricValue("reach"),
      "Reach (month)": getMetricValue("reach"),
      "Engagement (day)": getMetricValue("engagement"),
      "Engagement (week)": getMetricValue("engagement"),
      "Engagement (month)": getMetricValue("engagement"),
      "CTA Clicks (day)": getMetricValue("website_clicks"),
      "CTA Clicks (week)": getMetricValue("website_clicks"),
      "CTA Clicks (month)": getMetricValue("website_clicks"),
      engagement: getMetricValue("engagement"),
      last_post_date: "-", // Instagram posts are fetched separately
    };
  }

  /**
   * Transform standardized stats response to PlatformOverview format
   * Works with any platform in standardized format
   */
  public transformStandardizedData(data: StandardStatsResponse): PlatformOverview | null {
    if (!data || !data.accountInfo) return null;

    const platform = data.platform.charAt(0).toUpperCase() + data.platform.slice(1);
    const pageName = data.accountInfo.name;

    // Helper function to format recent post date
    const getRecentPostDate = () => {
      if (!data.recentPost?.data?.[0]) return "-";
      
      const post = data.recentPost.data[0];
      const timestamp = post.created_time || post.timestamp;
      
      if (!timestamp) return "-";
      
      const parsedDate = new Date(timestamp);
      return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
    };

    // Platform-specific metric extraction
    switch (data.platform.toLowerCase()) {
      case 'facebook':
        return {
          platform: "Facebook",
          pageName,
          page_fans: extractMetricValue(data.metrics, 'page_likes', '-'),
          page_follows: extractMetricValue(data.metrics, 'page_follows', '-'),
          page_status: extractMetricValue(data.metrics, 'page_status', '-'),
          "Reach (day)": extractMetricValue(data.metrics, 'page_reach', '-'),
          "Reach (week)": extractMetricValue(data.metrics, 'page_reach', '-'),
          "Reach (month)": extractMetricValue(data.metrics, 'page_reach', '-'),
          "Engagement (day)": extractMetricValue(data.metrics, 'page_post_engagements', '-'),
          "Engagement (week)": extractMetricValue(data.metrics, 'page_post_engagements', '-'),
          "Engagement (month)": extractMetricValue(data.metrics, 'page_post_engagements', '-'),
          "CTA Clicks (day)": extractMetricValue(data.metrics, 'page_actions', '-'),
          "CTA Clicks (week)": extractMetricValue(data.metrics, 'page_actions', '-'),
          "CTA Clicks (month)": extractMetricValue(data.metrics, 'page_actions', '-'),
          engagement: extractMetricValue(data.metrics, 'page_post_engagements', '-'),
          last_post_date: getRecentPostDate(),
        };

      case 'instagram':
        const followers = extractMetricValue(data.metrics, 'followers', 0);
        return {
          platform: "Instagram",
          pageName,
          page_fans: followers || "-",
          page_follows: followers || "-",
          "Reach (day)": extractMetricValue(data.metrics, 'reach', '-'),
          "Reach (week)": extractMetricValue(data.metrics, 'reach', '-'),
          "Reach (month)": extractMetricValue(data.metrics, 'reach', '-'),
          "Engagement (day)": extractMetricValue(data.metrics, 'total_interactions', '-'),
          "Engagement (week)": extractMetricValue(data.metrics, 'total_interactions', '-'),
          "Engagement (month)": extractMetricValue(data.metrics, 'total_interactions', '-'),
          "CTA Clicks (day)": extractMetricValue(data.metrics, 'website_clicks', '-'),
          "CTA Clicks (week)": extractMetricValue(data.metrics, 'website_clicks', '-'),
          "CTA Clicks (month)": extractMetricValue(data.metrics, 'website_clicks', '-'),
          engagement: extractMetricValue(data.metrics, 'total_interactions', '-'),
          last_post_date: getRecentPostDate(),
        };

      case 'linkedin':
        return {
          platform: "LinkedIn",
          pageName,
          page_fans: extractMetricValue(data.metrics, 'page_follows', '-'),
          page_follows: extractMetricValue(data.metrics, 'page_follows', '-'),
          "Reach (day)": extractMetricValue(data.metrics, 'impression_count', '-'),
          "Reach (week)": extractMetricValue(data.metrics, 'impression_count', '-'),
          "Reach (month)": extractMetricValue(data.metrics, 'impression_count', '-'),
          "Engagement (day)": extractMetricValue(data.metrics, 'engagement', '-'),
          "Engagement (week)": extractMetricValue(data.metrics, 'engagement', '-'),
          "Engagement (month)": extractMetricValue(data.metrics, 'engagement', '-'),
          "CTA Clicks (day)": extractMetricValue(data.metrics, 'click_count', '-'),
          "CTA Clicks (week)": extractMetricValue(data.metrics, 'click_count', '-'),
          "CTA Clicks (month)": extractMetricValue(data.metrics, 'click_count', '-'),
          engagement: extractMetricValue(data.metrics, 'engagement', '-'),
          last_post_date: "-",
        };

      case 'x':
        const xFollowers = extractMetricValue(data.metrics, 'followers', 0);
        const xLikes = extractMetricValue(data.metrics, 'like_count', 0);
        return {
          platform: "X (Twitter)",
          pageName,
          page_fans: xLikes || "-",
          page_follows: xFollowers || "-",
          "Reach (day)": xFollowers || "-",
          "Reach (week)": xFollowers || "-",
          "Reach (month)": xFollowers || "-",
          "Engagement (day)": xLikes || "-",
          "Engagement (week)": xLikes || "-",
          "Engagement (month)": xLikes || "-",
          "CTA Clicks (day)": extractMetricValue(data.metrics, 'media_count', '-'),
          "CTA Clicks (week)": extractMetricValue(data.metrics, 'media_count', '-'),
          "CTA Clicks (month)": extractMetricValue(data.metrics, 'media_count', '-'),
          engagement: xLikes || "-",
          last_post_date: "-",
        };

      default:
        return null;
    }
  }
}

export default DataTransformationService;
