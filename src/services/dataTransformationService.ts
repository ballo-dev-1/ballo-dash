// src/services/dataTransformationService.ts

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
   * Transform Facebook data to PlatformOverview format
   */
  public transformFacebookData(facebookData: FacebookData): PlatformOverview | null {
    if (!facebookData) return null;

    const { pageInfo, metrics, recentPost } = facebookData;
    
    // Defensive check for metrics
    if (!metrics || typeof metrics !== 'object') {
      return null;
    }
    
    const pageName = pageInfo?.name ?? "-";

    // Helper function to get metric value
    const getMetricValue = (metricName: string, period: string, defaultValue: any = "-") => {
      if (!metrics || !metrics[metricName]) {
        return defaultValue;
      }
      
      const metricData = metrics[metricName] as any;
      if (!metricData || !metricData[period]) {
        return defaultValue;
      }
      
      const values = metricData[period].values;
      return values && values.length > 0 ? values[values.length - 1].value : defaultValue;
    };

    // Helper function to format recent post date
    const getRecentPostDate = () => {
      if (!recentPost?.data?.[0]?.created_time) return "-";
      
      const rawDate = recentPost.data[0].created_time;
      const isoDateStr = rawDate.replace("+0000", "Z");
      const parsedDate = new Date(isoDateStr);
      
      return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
    };

    return {
      platform: "Facebook",
      pageName,
      page_fans: getMetricValue("page_fans", "day"),
      page_follows: getMetricValue("page_follows", "day"),
      page_status: getMetricValue("page_status", "day"),
      "Reach (day)": getMetricValue("page_impressions", "day"),
      "Reach (week)": getMetricValue("page_impressions", "week"),
      "Reach (month)": getMetricValue("page_impressions", "days_28"),
      "Engagement (day)": getMetricValue("page_post_engagements", "day"),
      "Engagement (week)": getMetricValue("page_post_engagements", "week"),
      "Engagement (month)": getMetricValue("page_post_engagements", "days_28"),
      "CTA Clicks (day)": getMetricValue("page_total_actions", "day"),
      "CTA Clicks (week)": getMetricValue("page_total_actions", "week"),
      "CTA Clicks (month)": getMetricValue("page_total_actions", "days_28"),
      engagement: getMetricValue("page_impressions", "days_28"),
      last_post_date: getRecentPostDate(),
    };
  }

  /**
   * Transform progressive Facebook data to PlatformOverview format
   */
  public transformProgressiveFacebookData(progressiveData: ProgressiveFacebookData): PlatformOverview | null {
    if (!progressiveData) return null;

    const { pageInfo, metrics, recentPost, loadingMetrics } = progressiveData;
    
    // Defensive check for metrics
    if (!metrics || typeof metrics !== 'object') {
      return null;
    }
    
    const pageName = pageInfo?.name ?? "-";

    // Helper function to get metric value with loading state
    const getMetricValue = (metricName: string, period: string, defaultValue: any = "-") => {
      if (loadingMetrics?.includes(metricName)) {
        return "Loading...";
      }
      
      if (!metrics || !metrics[metricName]) {
        return defaultValue;
      }
      
      const metricData = metrics[metricName] as any;
      if (!metricData || !metricData[period]) {
        return defaultValue;
      }
      
      const values = metricData[period].values;
      return values && values.length > 0 ? values[values.length - 1].value : defaultValue;
    };

    // Helper function to format recent post date
    const getRecentPostDate = () => {
      if (!recentPost?.data?.[0]?.created_time) return "-";
      
      const rawDate = recentPost.data[0].created_time;
      const isoDateStr = rawDate.replace("+0000", "Z");
      const parsedDate = new Date(isoDateStr);
      
      return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : "-";
    };

    return {
      platform: progressiveData.platform || "Facebook",
      pageName,
      page_fans: getMetricValue("page_fans", "lifetime"),
      page_follows: getMetricValue("page_follows", "day"),
      page_status: getMetricValue("page_status", "day"),
      "Reach (day)": getMetricValue("page_impressions", "day"),
      "Reach (week)": getMetricValue("page_impressions", "week"),
      "Reach (month)": getMetricValue("page_impressions", "days_28"),
      "Engagement (day)": getMetricValue("page_post_engagements", "day"),
      "Engagement (week)": getMetricValue("page_post_engagements", "week"),
      "Engagement (month)": getMetricValue("page_post_engagements", "days_28"),
      "CTA Clicks (day)": getMetricValue("page_total_actions", "day"),
      "CTA Clicks (week)": getMetricValue("page_total_actions", "week"),
      "CTA Clicks (month)": getMetricValue("page_total_actions", "days_28"),
      engagement: getMetricValue("page_impressions", "days_28"),
      last_post_date: getRecentPostDate(),
    };
  }

  /**
   * Transform LinkedIn data to PlatformOverview format
   */
  public transformLinkedInData(linkedInData: LinkedInData): PlatformOverview | null {
    if (!linkedInData) return null;

    // Defensive check for required fields
    if (!linkedInData.organizationName) {
      return null;
    }

    return {
      platform: "LinkedIn",
      pageName: linkedInData.organizationName || "LinkedIn Company",
      page_fans: linkedInData.followers || "-",
      page_follows: linkedInData.followers || "-",
      "Reach (day)": linkedInData.impressionCount || "-",
      "Reach (week)": linkedInData.impressionCount || "-",
      "Reach (month)": linkedInData.impressionCount || "-",
      "Engagement (day)": linkedInData.engagement || "-",
      "Engagement (week)": linkedInData.engagement || "-",
      "Engagement (month)": linkedInData.engagement || "-",
      "CTA Clicks (day)": linkedInData.clickCount || "-",
      "CTA Clicks (week)": linkedInData.clickCount || "-",
      "CTA Clicks (month)": linkedInData.clickCount || "-",
      engagement: linkedInData.engagement || "-",
      last_post_date: "-", // LinkedIn posts are fetched separately
    };
  }

  /**
   * Transform progressive LinkedIn data to PlatformOverview format
   */
  public transformProgressiveLinkedInData(progressiveLinkedInData: ProgressiveLinkedInData): PlatformOverview | null {
    if (!progressiveLinkedInData) return null;

    // Defensive check for required fields
    if (!progressiveLinkedInData.organizationName) {
      return null;
    }

    return {
      platform: "LinkedIn",
      pageName: progressiveLinkedInData.organizationName || "LinkedIn Company",
      page_fans: progressiveLinkedInData.followers || "-",
      page_follows: progressiveLinkedInData.followers || "-",
      "Reach (day)": progressiveLinkedInData.impressionCount || "-",
      "Reach (week)": progressiveLinkedInData.impressionCount || "-",
      "Reach (month)": progressiveLinkedInData.impressionCount || "-",
      "Engagement (day)": progressiveLinkedInData.engagement || "-",
      "Engagement (week)": progressiveLinkedInData.engagement || "-",
      "Engagement (month)": progressiveLinkedInData.engagement || "-",
      "CTA Clicks (day)": progressiveLinkedInData.clickCount || "-",
      "CTA Clicks (week)": progressiveLinkedInData.clickCount || "-",
      "CTA Clicks (month)": progressiveLinkedInData.clickCount || "-",
      engagement: progressiveLinkedInData.engagement || "-",
      last_post_date: "-", // LinkedIn posts are fetched separately
    };
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
   */
  public transformInstagramData(instagramData: InstagramData): PlatformOverview | null {
    if (!instagramData) return null;

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
}

export default DataTransformationService;
