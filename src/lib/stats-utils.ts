/**
 * Utility functions for building standardized stats API responses
 */

import type {
  AccountInfo,
  CacheMetadata,
  DateRange,
  MetricData,
  MetricValue,
  FetchStatus,
} from '@/types/shared-stats';

/**
 * Create cache metadata object with default values
 */
export function createCacheMetadata(options: {
  cached?: boolean;
  fetchStatus?: FetchStatus;
  lastFetchedAt?: string | null;
  message?: string;
}): CacheMetadata {
  return {
    cached: options.cached ?? false,
    fetchStatus: options.fetchStatus ?? 'SUCCESS',
    lastFetchedAt: options.lastFetchedAt ?? new Date().toISOString(),
    message: options.message,
  };
}

/**
 * Create standardized account info object
 */
export function createAccountInfo(options: {
  id: string;
  name: string;
  profilePicture?: string | null;
  biography?: string | null;
  creationDate?: string | null;
  verified?: boolean | null;
}): AccountInfo {
  return {
    id: options.id,
    name: options.name,
    profilePicture: options.profilePicture ?? null,
    biography: options.biography ?? null,
    creationDate: options.creationDate ?? null,
    verified: options.verified ?? null,
  };
}

/**
 * Create date range object with time-series data for metrics
 * For platforms without date-specific data, sets metrics to null
 */
export function createDateRange(
  metricsWithDates?: Record<string, Array<{ date: string; value: any }> | null>
): DateRange {
  return metricsWithDates || {};
}

/**
 * Build time-series data from Facebook API values array
 */
export function buildTimeSeriesFromValues(
  values: Array<{ value: any; endTime: string | null }>
): Array<{ date: string; value: any }> | null {
  if (!values || values.length === 0) return null;
  
  return values
    .filter(v => v.endTime !== null)
    .map(v => ({
      date: v.endTime as string,
      value: v.value
    }));
}

/**
 * Create empty date range for platforms without time-series data
 */
export function createEmptyDateRange(metricNames: string[]): DateRange {
  const dateRange: DateRange = {};
  
  for (const metricName of metricNames) {
    dateRange[metricName] = null;
  }
  
  return dateRange;
}

/**
 * Wrap a flat metric value into the metric structure (no period nesting)
 * 
 * @example
 * wrapMetric(1234, 'followers')
 * // Returns: { values: [{ date: null, value: 1234 }], title: 'Followers', description: 'Followers metric' }
 */
export function wrapMetric(
  value: number | string,
  metricName: string,
  date: string | null = null
): MetricData {
  const title = formatMetricTitle(metricName);
  const description = `${title} metric`;

  return {
    values: [
      {
        date,
        value,
      },
    ],
    title,
    description,
  };
}

/**
 * Wrap multiple values into a single metric structure
 * 
 * @example
 * wrapMetricWithValues([100, 200, 300], 'impressions', ['2024-01-01', '2024-01-02', '2024-01-03'])
 */
export function wrapMetricWithValues(
  values: (number | string)[],
  metricName: string,
  dates?: (string | null)[]
): MetricData {
  const title = formatMetricTitle(metricName);
  
  return {
    values: values.map((value, index) => ({
      date: dates?.[index] || null,
      value,
    })),
    title,
    description: `${title} metric`,
  };
}

/**
 * Extract a single metric value from metric structure
 * Returns the last value in the values array
 * 
 * @example
 * extractMetricValue(metrics, 'page_fans')
 * // Returns: 1234 or null if not found
 */
export function extractMetricValue(
  metrics: Record<string, MetricData>,
  metricName: string,
  defaultValue: any = null
): any {
  const metric = metrics[metricName];
  if (!metric || !metric.values || metric.values.length === 0) {
    return defaultValue;
  }

  // Return the last value in the array
  return metric.values[metric.values.length - 1].value;
}

/**
 * Extract all metric values
 * 
 * @example
 * extractAllMetricValues(metrics, 'page_impressions')
 * // Returns: [100, 200, 300]
 */
export function extractAllMetricValues(
  metrics: Record<string, MetricData>,
  metricName: string
): any[] {
  const metric = metrics[metricName];
  if (!metric || !metric.values) return [];

  return metric.values.map(v => v.value);
}

/**
 * Get latest metric value from a MetricData object
 * Returns the last value in the values array
 */
export function getLatestMetricValue(metric: MetricData | undefined, defaultValue: any = null): any {
  if (!metric || !metric.values || metric.values.length === 0) {
    return defaultValue;
  }
  return metric.values[metric.values.length - 1].value;
}

/**
 * Get metric value by specific date
 */
export function getMetricValueByDate(metric: MetricData | undefined, date: string, defaultValue: any = null): any {
  if (!metric || !metric.values || metric.values.length === 0) {
    return defaultValue;
  }
  const found = metric.values.find(v => v.date === date);
  return found ? found.value : defaultValue;
}

/**
 * Calculate sum for last N days from dateRange data
 */
export function calculatePeriodSum(
  dateRangeData: Array<{ date: string; value: any }> | null,
  days: number
): number {
  if (!dateRangeData || dateRangeData.length === 0) {
    return 0;
  }
  
  // Get the most recent date
  const sortedData = [...dateRangeData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate the date N days ago
  const endDate = new Date(sortedData[0].date);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);
  
  // Sum values within the period
  return sortedData
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    })
    .reduce((sum, item) => {
      const value = typeof item.value === 'number' ? item.value : 0;
      return sum + value;
    }, 0);
}

/**
 * Format metric name into human-readable title
 * Converts snake_case to Title Case
 */
export function formatMetricTitle(metricName: string): string {
  return metricName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Create a default empty metrics object
 */
export function createEmptyMetrics(
  metricNames: string[]
): Record<string, MetricData> {
  const metrics: Record<string, MetricData> = {};

  for (const metricName of metricNames) {
    metrics[metricName] = wrapMetric(0, metricName);
  }

  return metrics;
}

/**
 * Merge cache metadata from existing cached data
 */
export function mergeCacheMetadata(
  options: {
    cached?: boolean;
    fetchStatus?: FetchStatus;
    lastFetchedAt?: string | null;
    message?: string;
  },
  existingData?: any
): CacheMetadata {
  if (existingData?._cached || existingData?.cache?.cached) {
    return {
      cached: options.cached ?? existingData._cached ?? existingData.cache?.cached ?? true,
      fetchStatus: options.fetchStatus ?? existingData._fetchStatus ?? existingData.cache?.fetchStatus ?? 'SUCCESS',
      lastFetchedAt: options.lastFetchedAt ?? existingData._lastFetchedAt ?? existingData.cache?.lastFetchedAt ?? null,
      message: options.message ?? existingData._message ?? existingData.cache?.message,
    };
  }

  return createCacheMetadata(options);
}

/**
 * Validate and normalize date string to YYYY-MM-DD format
 */
export function normalizeDateString(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return undefined;

    return date.toISOString().split('T')[0];
  } catch {
    return undefined;
  }
}

/**
 * Check if data is in standardized format
 */
export function isStandardizedFormat(data: any): boolean {
  return data && data.accountInfo && data.metrics && data.cache && data.dateRange;
}

/**
 * Get account name from either standardized or legacy format
 */
export function getAccountName(data: any): string {
  if (!data) return '';
  
  // Standardized format
  if (data.accountInfo) {
    return data.accountInfo.name;
  }
  
  // Legacy formats
  if (data.pageInfo) return data.pageInfo.name || '';
  if (data.userInfo) return data.userInfo.username || '';
  if (data.organizationInfo) return data.organizationInfo.name || '';
  if (data.organizationName) return data.organizationName;
  if (data.username) return data.username;
  if (data.name) return data.name;
  
  return '';
}

/**
 * Get account ID from either standardized or legacy format
 */
export function getAccountId(data: any): string {
  if (!data) return '';
  
  // Standardized format
  if (data.accountInfo) {
    return data.accountInfo.id;
  }
  
  // Legacy formats
  if (data.pageInfo) return data.pageInfo.id || '';
  if (data.userInfo) return data.userInfo.id || '';
  if (data.organizationInfo) return data.organizationInfo.id || '';
  if (data.organizationId) return data.organizationId;
  if (data.userId) return data.userId;
  if (data.id) return data.id;
  
  return '';
}

/**
 * Get flat metric value from either standardized or legacy flat format
 * Works with both standardized structure (values array) and legacy flat metrics
 */
export function getFlatMetricValue(
  data: any,
  metricName: string,
  fallbackKey?: string
): any {
  if (!data) return null;
  
  // Try standardized format first (has values array)
  if (data.metrics && typeof data.metrics === 'object') {
    const metric = data.metrics[metricName];
    
    if (metric && typeof metric === 'object') {
      // Check if it has values array (standardized format)
      if (metric.values && Array.isArray(metric.values) && metric.values.length > 0) {
        return metric.values[metric.values.length - 1].value;
      }
      
      // Check if it's old nested by period format (for backward compatibility during transition)
      const firstKey = Object.keys(metric)[0];
      if (firstKey && metric[firstKey]?.values) {
        const values = metric[firstKey].values;
        if (values && values.length > 0) {
          return values[values.length - 1].value;
        }
      }
    } else if (metric !== undefined) {
      // It's flat legacy format - return directly
      return metric;
    }
  }
  
  // Try fallback key (legacy direct access)
  if (fallbackKey && data[fallbackKey] !== undefined) {
    return data[fallbackKey];
  }
  
  // Try direct access on data
  if (data[metricName] !== undefined) {
    return data[metricName];
  }
  
  return null;
}

/**
 * Get cache status from either standardized or legacy format
 */
export function getCacheStatus(data: any): { cached: boolean; lastFetchedAt: string | null; message?: string } {
  if (!data) return { cached: false, lastFetchedAt: null };
  
  // Standardized format
  if (data.cache) {
    return {
      cached: data.cache.cached || false,
      lastFetchedAt: data.cache.lastFetchedAt || null,
      message: data.cache.message
    };
  }
  
  // Legacy format (underscore prefixed)
  if (data._cached !== undefined) {
    return {
      cached: data._cached || false,
      lastFetchedAt: data._lastFetchedAt || null,
      message: data._message
    };
  }
  
  return { cached: false, lastFetchedAt: null };
}

