// src/services/dataTransformationService.ts

export interface PlatformOverview {
  platform: string;
  pageName: string;
  page_fans: any;
  page_follows: any;
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

export interface ProgressiveMetaData {
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

export interface MetaData {
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
   * Transform Meta/Facebook data to PlatformOverview format
   */
  public transformMetaData(metaData: MetaData): PlatformOverview | null {
    if (!metaData) return null;

    const { pageInfo, metrics, recentPost } = metaData;
    
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
      page_fans: getMetricValue("page_fans", "lifetime"),
      page_follows: getMetricValue("page_follows", "lifetime"),
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
   * Transform progressive Meta data to PlatformOverview format
   */
  public transformProgressiveMetaData(progressiveData: ProgressiveMetaData): PlatformOverview | null {
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
      page_fans: getMetricValue("page_fans", "day"),
      page_follows: getMetricValue("page_follows", "lifetime"),
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
}

export default DataTransformationService;
