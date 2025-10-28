// src/types/linkedin.ts
/**
 * Type definitions for LinkedIn Marketing API responses
 * Reference: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/page-statistics
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
 * Schema for page view statistics
 */
export const PageViewsSchema = z.object({
  allPageViews: z.object({
    pageViews: z.number(),
    uniquePageViews: z.number().optional(),
  }).optional(),
  overviewPageViews: z.object({
    pageViews: z.number(),
    uniquePageViews: z.number().optional(),
  }).optional(),
  allDesktopPageViews: z.object({
    pageViews: z.number(),
  }).optional(),
  allMobilePageViews: z.object({
    pageViews: z.number(),
  }).optional(),
  careersPageViews: z.object({
    pageViews: z.number(),
    uniquePageViews: z.number().optional(),
  }).optional(),
  jobsPageViews: z.object({
    pageViews: z.number(),
    uniquePageViews: z.number().optional(),
  }).optional(),
});

/**
 * Schema for organization share statistics
 */
export const ShareStatisticsSchema = z.object({
  impressionCount: z.number().optional(),
  uniqueImpressionsCount: z.number().optional(),
  clickCount: z.number().optional(),
  likeCount: z.number().optional(),
  commentCount: z.number().optional(),
  shareCount: z.number().optional(),
  shareMentionsCount: z.number().optional(),
  commentMentionsCount: z.number().optional(),
  engagement: z.number().optional(),
});

/**
 * Schema for organization info (legacy)
 */
export const OrganizationInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

/**
 * LinkedIn-specific account info (organization)
 */
export const LinkedInAccountInfoSchema = AccountInfoSchema;

/**
 * Main schema for LinkedIn Stats API response (legacy)
 */
export const LegacyLinkedInStatsResponseSchema = z.object({
  organizationInfo: OrganizationInfoSchema,
  platform: z.string(),
  metrics: z.object({
    page_follows: z.union([z.string(), z.number()]).nullable(),
    page_views: z.number().optional(),
    since: z.union([z.string(), z.undefined()]),
    until: z.union([z.string(), z.undefined()]),
    datePreset: z.union([z.string(), z.undefined()]),
    impressions: ShareStatisticsSchema,
  }),
  rawPageStats: z.any().optional(),
});

/**
 * Main schema for standardized LinkedIn Stats API response
 */
export const LinkedInStatsResponseSchema = z.object({
  platform: z.literal('linkedin'),
  accountInfo: LinkedInAccountInfoSchema,
  metrics: StandardMetricsSchema,
  dateRange: DateRangeSchema,
  recentPost: z.null().optional(),
  rawPageStats: z.any().nullable().optional(),
  cache: CacheMetadataSchema,
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from Zod schemas)
// ============================================================================

export type PageViews = z.infer<typeof PageViewsSchema>;
export type ShareStatistics = z.infer<typeof ShareStatisticsSchema>;
export type OrganizationInfo = z.infer<typeof OrganizationInfoSchema>;
export type LinkedInAccountInfo = z.infer<typeof LinkedInAccountInfoSchema>;
export type LegacyLinkedInStatsResponse = z.infer<typeof LegacyLinkedInStatsResponseSchema>;
export type LinkedInStatsResponse = z.infer<typeof LinkedInStatsResponseSchema>;

// ============================================================================
// ADDITIONAL TYPES FOR INTERNAL USE
// ============================================================================

/**
 * LinkedIn API request parameters
 */
export interface LinkedInStatsParams {
  organizationId: string;
  platform: 'linkedin';
  since?: string;
  until?: string;
  datePreset?: string;
}

/**
 * LinkedIn time intervals parameters
 * Used for time-bound statistics
 */
export interface LinkedInTimeIntervals {
  timeGranularityType: 'DAY' | 'MONTH';
  timeRange: {
    start: number; // milliseconds since epoch (exclusive)
    end: number;   // milliseconds since epoch (inclusive)
  };
}

/**
 * LinkedIn Page Statistics Element (from API response)
 */
export interface LinkedInPageStatisticsElement {
  organization: string; // URN format
  timeRange?: {
    start: number;
    end: number;
  };
  totalPageStatistics?: {
    views?: PageViews;
    clicks?: {
      desktopCustomButtonClickCounts?: any[];
      mobileCustomButtonClickCounts?: any[];
    };
  };
  pageStatisticsByGeoCountry?: any[];
  pageStatisticsByFunction?: any[];
  pageStatisticsByIndustryV2?: any[];
  pageStatisticsByRegion?: any[];
  pageStatisticsBySeniority?: any[];
  pageStatisticsByStaffCountRange?: any[];
}

/**
 * LinkedIn Page Statistics API response
 */
export interface LinkedInPageStatisticsResponse {
  elements: LinkedInPageStatisticsElement[];
  paging: {
    count: number;
    start: number;
    links?: any[];
  };
}

/**
 * Simplified metrics for easier consumption
 */
export interface ExtractedLinkedInMetrics {
  followers: number | string | null;
  pageViews: number;
  impressions: number;
  uniqueImpressions: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
  totalEngagement: number;
}

/**
 * Complete LinkedIn data structure
 */
export interface LinkedInData {
  organizationInfo: OrganizationInfo;
  platform: string;
  metrics: ExtractedLinkedInMetrics;
  since?: string;
  until?: string;
  datePreset?: string;
  lastFetched: string;
}

