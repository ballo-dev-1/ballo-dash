// src/types/facebook.ts
/**
 * Type definitions for Facebook API responses
 * Following Meta Graph API v23.0 structure
 * Extends standardized stats structure
 */

import { z } from 'zod';
import {
  AccountInfoSchema,
  MetricsSchema as StandardMetricsSchema,
  DateRangeSchema,
  CacheMetadataSchema,
} from './shared-stats';

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

/**
 * Schema for individual metric value with timestamp
 */
export const MetricValueSchema = z.object({
  value: z.union([z.number(), z.string(), z.record(z.any())]),
  endTime: z.string().nullable(),
});

/**
 * Schema for metric data by period (day, week, days_28, lifetime)
 */
export const MetricPeriodSchema = z.object({
  values: z.array(MetricValueSchema),
  title: z.string(),
  description: z.string(),
});

/**
 * Schema for a single metric with all its periods
 */
export const MetricSchema = z.record(
  z.string(), // period name: 'day', 'week', 'days_28', 'lifetime'
  MetricPeriodSchema
);

/**
 * Schema for all metrics in the response
 */
export const MetricsSchema = z.record(
  z.string(), // metric name: 'page_fans', 'page_impressions', etc.
  MetricSchema
);

/**
 * Schema for page info (legacy)
 */
export const PageInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilePicture: z.string().optional(),
  creationDate: z.string().nullable().optional(),
});

/**
 * Facebook-specific account info extends base with creationDate
 */
export const FacebookAccountInfoSchema = AccountInfoSchema.extend({
  creationDate: z.string().nullable().optional(),
});

/**
 * Schema for recent post
 */
export const RecentPostSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    message: z.string().optional(),
    created_time: z.string(),
  })).optional(),
});

/**
 * Main schema for Facebook Stats API response (legacy)
 */
export const LegacyFacebookStatsResponseSchema = z.object({
  pageInfo: PageInfoSchema,
  platform: z.string(),
  metrics: MetricsSchema,
  recentPost: RecentPostSchema.nullable(),
});

/**
 * Main schema for standardized Facebook Stats API response
 */
export const FacebookStatsResponseSchema = z.object({
  platform: z.literal('facebook'),
  accountInfo: FacebookAccountInfoSchema,
  metrics: StandardMetricsSchema,
  dateRange: DateRangeSchema,
  recentPost: RecentPostSchema.nullable().optional(),
  rawPageStats: z.null().optional(),
  cache: CacheMetadataSchema,
});

/**
 * Schema for Facebook Post with insights
 */
export const FacebookPostSchema = z.object({
  id: z.string(),
  message: z.string().optional(),
  story: z.string().optional(),
  created_time: z.string(),
  insights: z.object({
    post_impressions: z.number().optional(),
    post_engaged_users: z.number().optional(),
    comment: z.number().optional(),
    share: z.number().optional(),
    post_reactions_like_total: z.number().optional(),
    post_reactions_love_total: z.number().optional(),
    post_reactions_wow_total: z.number().optional(),
    post_reactions_haha_total: z.number().optional(),
    post_reactions_sorry_total: z.number().optional(),
    post_reactions_anger_total: z.number().optional(),
  }).optional(),
});

/**
 * Schema for Facebook Posts API response
 */
export const FacebookPostsResponseSchema = z.object({
  pageInfo: PageInfoSchema,
  platform: z.string(),
  posts: z.array(FacebookPostSchema),
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from Zod schemas)
// ============================================================================

export type MetricValue = z.infer<typeof MetricValueSchema>;
export type MetricPeriod = z.infer<typeof MetricPeriodSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
export type PageInfo = z.infer<typeof PageInfoSchema>;
export type FacebookAccountInfo = z.infer<typeof FacebookAccountInfoSchema>;
export type RecentPost = z.infer<typeof RecentPostSchema>;
export type LegacyFacebookStatsResponse = z.infer<typeof LegacyFacebookStatsResponseSchema>;
export type FacebookStatsResponse = z.infer<typeof FacebookStatsResponseSchema>;
export type FacebookPost = z.infer<typeof FacebookPostSchema>;
export type FacebookPostsResponse = z.infer<typeof FacebookPostsResponseSchema>;

// ============================================================================
// ADDITIONAL TYPES FOR INTERNAL USE
// ============================================================================

/**
 * Facebook API request parameters
 */
export interface FacebookStatsParams {
  pageId: string;
  platform: 'facebook';
  since?: string;
  until?: string;
  datePreset?: FacebookDatePreset;
}

/**
 * Official Facebook date preset values
 * Reference: https://developers.facebook.com/docs/graph-api/reference/v23.0/insights
 */
export type FacebookDatePreset = 
  | 'today'
  | 'yesterday'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'maximum'
  | 'data_maximum'
  | 'last_3d'
  | 'last_7d'
  | 'last_14d'
  | 'last_28d'
  | 'last_30d'
  | 'last_90d'
  | 'last_week_mon_sun'
  | 'last_week_sun_sat'
  | 'last_quarter'
  | 'last_year'
  | 'this_week_mon_today'
  | 'this_week_sun_today'
  | 'this_year';

/**
 * Core metrics that we fetch from Facebook
 */
export const FACEBOOK_CORE_METRICS = [
  'page_likes',             // Total page likes (cumulative)
  'page_follows',           // Total page followers
  'page_reach',             // Total impressions (reach)
  'page_post_engagements',  // Total post engagements
  'page_actions',           // Total CTA clicks
] as const;

export type FacebookCoreMetric = typeof FACEBOOK_CORE_METRICS[number];

/**
 * Metric periods supported by Facebook API
 */
export const FACEBOOK_METRIC_PERIODS = ['day', 'week', 'days_28', 'lifetime'] as const;
export type FacebookMetricPeriod = typeof FACEBOOK_METRIC_PERIODS[number];

/**
 * Simplified metric value type (after extraction from API response)
 */
export interface SimplifiedMetricValue {
  value: number | string;
  date: string | null;
}

/**
 * Extracted metrics for easier consumption in components
 */
export interface ExtractedFacebookMetrics {
  pageFans: SimplifiedMetricValue;
  pageFollows: SimplifiedMetricValue;
  impressions: {
    day: SimplifiedMetricValue;
    week: SimplifiedMetricValue;
    month: SimplifiedMetricValue;
  };
  engagement: {
    day: SimplifiedMetricValue;
    week: SimplifiedMetricValue;
    month: SimplifiedMetricValue;
  };
  ctaClicks: {
    day: SimplifiedMetricValue;
    week: SimplifiedMetricValue;
    month: SimplifiedMetricValue;
  };
}

/**
 * Complete Facebook data structure with extracted metrics
 */
export interface FacebookData {
  pageInfo: PageInfo;
  platform: string;
  metrics: ExtractedFacebookMetrics;
  recentPost: RecentPost | null;
  lastFetched: string;
}

