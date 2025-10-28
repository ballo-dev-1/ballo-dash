/**
 * Type definitions for Instagram API responses
 * Extends standardized stats structure
 * Reference: https://developers.facebook.com/docs/instagram-api
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
 * Instagram-specific account info extends base with biography
 */
export const InstagramAccountInfoSchema = AccountInfoSchema.extend({
  biography: z.string().nullable().optional(),
  followers_count: z.number().optional(),
});

/**
 * Schema for Instagram post
 */
export const InstagramPostSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  timestamp: z.string(),
  media_type: z.string().optional(),
  permalink: z.string().optional(),
});

/**
 * Schema for recent Instagram post data
 */
export const InstagramRecentPostSchema = z.object({
  data: z.array(InstagramPostSchema).optional(),
});

/**
 * Main schema for Instagram Stats API response
 */
export const InstagramStatsResponseSchema = z.object({
  platform: z.literal('instagram'),
  accountInfo: InstagramAccountInfoSchema,
  metrics: StandardMetricsSchema,
  dateRange: DateRangeSchema,
  recentPost: InstagramRecentPostSchema.nullable().optional(),
  rawPageStats: z.null().optional(),
  cache: CacheMetadataSchema,
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from Zod schemas)
// ============================================================================

export type InstagramAccountInfo = z.infer<typeof InstagramAccountInfoSchema>;
export type InstagramPost = z.infer<typeof InstagramPostSchema>;
export type InstagramRecentPost = z.infer<typeof InstagramRecentPostSchema>;
export type InstagramStatsResponse = z.infer<typeof InstagramStatsResponseSchema>;

// ============================================================================
// ADDITIONAL TYPES FOR INTERNAL USE
// ============================================================================

/**
 * Instagram API request parameters
 */
export interface InstagramStatsParams {
  platform: 'instagram';
  since?: string;
  until?: string;
  datePreset?: string;
}

/**
 * Instagram metric names
 */
export const INSTAGRAM_METRICS = [
  'followers',
  'reach',
  'threads_views',
  'website_clicks',
  'profile_views',
  'accounts_engaged',
  'total_interactions',
  'likes',
  'comments',
  'shares',
  'saves',
  'replies',
  'follows_and_unfollows',
  'profile_links_taps',
  'views',
  'content_views',
] as const;

export type InstagramMetric = typeof INSTAGRAM_METRICS[number];

/**
 * Legacy Instagram data structure (for backward compatibility)
 */
export interface LegacyInstagramData {
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

