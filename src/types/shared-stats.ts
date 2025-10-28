/**
 * Shared type definitions for standardized stats API responses
 * All platform stats endpoints conform to this structure
 */

import { z } from 'zod';

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

/**
 * Schema for account/profile information (standardized across all platforms)
 */
export const AccountInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilePicture: z.string().nullable().optional(),
  biography: z.string().nullable().optional(),
  creationDate: z.string().nullable().optional(),
  verified: z.boolean().nullable().optional(),
});

/**
 * Schema for individual metric value with timestamp
 */
export const MetricValueSchema = z.object({
  date: z.string().nullable(),
  value: z.union([z.number(), z.string(), z.record(z.any())]),
});

/**
 * Schema for metric data (simplified - no period nesting)
 */
export const MetricDataSchema = z.object({
  values: z.array(MetricValueSchema),
  title: z.string(),
  description: z.string(),
});

/**
 * Schema for all metrics in the response
 * Example: { page_fans: { values: [...], title: "...", description: "..." }, followers: {...} }
 */
export const MetricsSchema = z.record(
  z.string(), // metric name
  MetricDataSchema
);

/**
 * Schema for time-series metric data point
 */
export const TimeSeriesDataPointSchema = z.object({
  date: z.string(),
  value: z.union([z.number(), z.string()]),
});

/**
 * Schema for date range with time-series data
 * Contains historical data for metrics that support date breakdowns
 */
export const DateRangeSchema = z.record(
  z.string(), // metric name
  z.array(TimeSeriesDataPointSchema).nullable()
);

/**
 * Schema for cache metadata
 */
export const CacheMetadataSchema = z.object({
  cached: z.boolean(),
  fetchStatus: z.enum(['SUCCESS', 'ERROR', 'PENDING']),
  lastFetchedAt: z.string().nullable(),
  message: z.string().optional(),
});

/**
 * Main schema for standardized stats API response
 * All platform stats endpoints should return data matching this structure
 */
export const StandardStatsResponseSchema = z.object({
  platform: z.string(),
  accountInfo: AccountInfoSchema,
  metrics: MetricsSchema,
  dateRange: DateRangeSchema,
  recentPost: z.any().nullable().optional(),
  rawPageStats: z.any().nullable().optional(),
  cache: CacheMetadataSchema,
});

// ============================================================================
// TYPESCRIPT TYPES (inferred from Zod schemas)
// ============================================================================

export type AccountInfo = z.infer<typeof AccountInfoSchema>;
export type MetricValue = z.infer<typeof MetricValueSchema>;
export type MetricData = z.infer<typeof MetricDataSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
export type TimeSeriesDataPoint = z.infer<typeof TimeSeriesDataPointSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type CacheMetadata = z.infer<typeof CacheMetadataSchema>;
export type StandardStatsResponse = z.infer<typeof StandardStatsResponseSchema>;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Supported platform types
 */
export type PlatformType = 'facebook' | 'instagram' | 'linkedin' | 'x';

/**
 * Fetch status for cache metadata
 */
export type FetchStatus = 'SUCCESS' | 'ERROR' | 'PENDING';

/**
 * Common metric periods
 */
export type MetricPeriod = 'day' | 'week' | 'days_28' | 'month' | 'lifetime' | 'total';

/**
 * Generic stats request parameters
 */
export interface StatsRequestParams {
  platform: PlatformType;
  since?: string;
  until?: string;
  datePreset?: string;
}

