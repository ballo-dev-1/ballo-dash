// src/lib/facebookMetrics.ts
/**
 * Utility functions for extracting and processing Facebook metrics
 */

import type { 
  Metrics, 
  SimplifiedMetricValue, 
  ExtractedFacebookMetrics,
  FacebookMetricPeriod 
} from '@/types/facebook';

/**
 * Get the last value from a metric period
 * @param metrics - All metrics from the API response
 * @param metricName - Name of the metric (e.g., 'page_likes', 'page_reach')
 * @param period - Time period (e.g., 'day', 'week', 'days_28')
 * @param defaultValue - Default value if metric not found
 */
export function getMetricValue(
  metrics: Metrics,
  metricName: string,
  period: FacebookMetricPeriod,
  defaultValue: string | number = '-'
): SimplifiedMetricValue {
  try {
    const metric = metrics[metricName];
    if (!metric || !metric[period]) {
      return { value: defaultValue, date: null };
    }

    const values = metric[period].values;
    if (!Array.isArray(values) || values.length === 0) {
      return { value: defaultValue, date: null };
    }

    // Get the last (most recent) value
    const lastValue = values[values.length - 1];
    return {
      value: lastValue.value ?? defaultValue,
      date: lastValue.endTime,
    };
  } catch (error) {
    console.error(`Error extracting metric ${metricName}[${period}]:`, error);
    return { value: defaultValue, date: null };
  }
}

/**
 * Extract all Facebook metrics into a simplified structure
 * @param metrics - Raw metrics from Facebook API
 */
export function extractFacebookMetrics(metrics: Metrics): ExtractedFacebookMetrics {
  return {
    // Page likes - use lifetime to get cumulative total
    pageFans: getMetricValue(metrics, 'page_likes', 'lifetime'),
    
    // Page follows - use day to get current value
    pageFollows: getMetricValue(metrics, 'page_follows', 'day'),
    
    // Reach by period
    impressions: {
      day: getMetricValue(metrics, 'page_reach', 'day'),
      week: getMetricValue(metrics, 'page_reach', 'week'),
      month: getMetricValue(metrics, 'page_reach', 'days_28'),
    },
    
    // Engagement by period
    engagement: {
      day: getMetricValue(metrics, 'page_post_engagements', 'day'),
      week: getMetricValue(metrics, 'page_post_engagements', 'week'),
      month: getMetricValue(metrics, 'page_post_engagements', 'days_28'),
    },
    
    // CTA actions by period
    ctaClicks: {
      day: getMetricValue(metrics, 'page_actions', 'day'),
      week: getMetricValue(metrics, 'page_actions', 'week'),
      month: getMetricValue(metrics, 'page_actions', 'days_28'),
    },
  };
}

/**
 * Format recent post date
 * @param recentPost - Recent post data from API
 */
export function formatRecentPostDate(recentPost: any): string {
  try {
    if (!recentPost?.data?.[0]?.created_time) {
      return '-';
    }
    
    const rawDate = recentPost.data[0].created_time;
    const isoDateStr = rawDate.replace('+0000', 'Z');
    const parsedDate = new Date(isoDateStr);
    
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }
    
    return parsedDate.toLocaleString();
  } catch (error) {
    console.error('Error formatting recent post date:', error);
    return '-';
  }
}

/**
 * Format a metric value for display
 * @param value - The value to format
 * @param type - Type of formatting ('number', 'percentage', 'currency')
 */
export function formatMetricValue(
  value: number | string,
  type: 'number' | 'percentage' | 'currency' = 'number'
): string {
  if (value === '-' || value === 'Loading...' || value === null || value === undefined) {
    return String(value);
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return String(value);
  }

  switch (type) {
    case 'number':
      return numValue.toLocaleString();
    case 'percentage':
      return `${numValue.toFixed(2)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(numValue);
    default:
      return String(value);
  }
}

/**
 * Check if a metric is currently loading
 * @param loadingMetrics - Array of metric names currently being loaded
 * @param metricName - Name of the metric to check
 */
export function isMetricLoading(
  loadingMetrics: string[] | undefined,
  metricName: string
): boolean {
  return Array.isArray(loadingMetrics) && loadingMetrics.includes(metricName);
}

/**
 * Calculate percentage change between two metric values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (positive or negative)
 */
export function calculatePercentageChange(
  current: number | string,
  previous: number | string
): number | null {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;

  if (isNaN(currentNum) || isNaN(previousNum) || previousNum === 0) {
    return null;
  }

  return ((currentNum - previousNum) / previousNum) * 100;
}

