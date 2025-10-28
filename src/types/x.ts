/**
 * Type definitions for X (Twitter) API responses
 * Extends standardized stats structure
 * Reference: https://developer.twitter.com/en/docs/twitter-api
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
 * X-specific account info extends base with verified status and description
 */
export const XAccountInfoSchema = AccountInfoSchema.extend({
  description: z.string().nullable().optional(),
  verified: z.boolean().nullable().optional(),
});

/**
 * Main schema for X Stats API response
 */
export const XStatsResponseSchema = z.object({
  platform: z.literal('x'),
  accountInfo: XAccountInfoSchema,
  metrics: StandardMetricsSchema,
  dateRange: DateRangeSchema,
  recentPost: z.null().optional(),
  rawPageStats: z.null().optional(),
  cache: CacheMetadataSchema,
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from Zod schemas)
// ============================================================================

export type XAccountInfo = z.infer<typeof XAccountInfoSchema>;
export type XStatsResponse = z.infer<typeof XStatsResponseSchema>;

// ============================================================================
// ADDITIONAL TYPES FOR INTERNAL USE
// ============================================================================

/**
 * X API request parameters
 */
export interface XStatsParams {
  username: string;
  platform: 'x';
  since?: string;
  until?: string;
  date_preset?: string;
}

/**
 * X metric names
 */
export const X_METRICS = [
  'followers',
  'following',
  'tweet_count',
  'listed_count',
  'like_count',
  'media_count',
] as const;

export type XMetric = typeof X_METRICS[number];

/**
 * Legacy X data structure (for backward compatibility)
 */
export interface LegacyXData {
  platform: string;
  userInfo: {
    username: string;
    id: string;
    name: string;
    description: string;
    profileImageUrl: string;
    verified: boolean;
  };
  metrics: {
    followers: number;
    following: number;
    tweetCount: number;
    listedCount: number;
    likeCount: number;
    mediaCount: number;
  };
  since?: string;
  until?: string;
  datePreset?: string;
}

