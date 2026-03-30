# Standardized Stats API Implementation

## Overview

All four stats endpoints (`/api/data/{platform}/stats`) now return a standardized response structure with consistent field names and nested metrics organization.

## Standardized Response Structure

All platforms now return:

```typescript
{
  platform: string;                    // 'facebook' | 'instagram' | 'linkedin' | 'x'
  accountInfo: {
    id: string;
    name: string;
    profilePicture: string | null;   // All platforms
    biography: string | null;         // Instagram, X
    creationDate: string | null;      // Facebook
    verified: boolean | null;         // X
  };
  metrics: {                          // Simplified - values directly under each metric
    // Facebook: page_likes, page_reach, page_actions, page_post_engagements
    // Instagram: followers, reach, total_interactions, website_clicks, etc.
    // LinkedIn: page_follows, impression_count, engagement, click_count, etc.
    // X: followers, following, tweet_count, like_count, etc.
    [metricName]: {
      values: Array<{ date: string | null; value: any }>;
      title: string;
      description: string;
    }
  };
  dateRange: {                        // Time-series data for metrics
    // Facebook: ALL metrics included
    //   - page_likes, page_reach: contain time-series arrays
    //   - page_follows, page_post_engagements, page_actions: null
    // Other platforms: All metrics set to null (no time-series data)
    [metricName]: Array<{ date: string; value: any }> | null;
  };
  recentPost: any | null;            // All platforms (null if N/A)
  rawPageStats: any | null;          // LinkedIn specific, null for others
  cache: {
    cached: boolean;
    fetchStatus: 'SUCCESS' | 'ERROR' | 'PENDING';
    lastFetchedAt: string | null;
    message?: string;
  };
}
```

## Files Created

### 1. Type Definitions

- **`src/types/shared-stats.ts`** - Shared standardized types and Zod schemas
  - `StandardStatsResponse` - Main response interface
  - `AccountInfo` - Standardized account/profile info
  - `MetricPeriodData` - Metric data structure
  - `DateRange` - Date range parameters
  - `CacheMetadata` - Cache status metadata

- **`src/types/instagram.ts`** - Instagram-specific types extending standard structure
  - `InstagramStatsResponse` schema with validation
  - Platform-specific metric names
  - Legacy format support

- **`src/types/x.ts`** - X (Twitter)-specific types extending standard structure
  - `XStatsResponse` schema with validation
  - Platform-specific metric names
  - Legacy format support

### 2. Utility Functions

- **`src/lib/stats-utils.ts`** - Helper functions for building standardized responses
  - `createAccountInfo()` - Build standardized account info
  - `createDateRange()` - Build date range from query params
  - `createCacheMetadata()` - Generate cache metadata
  - `wrapMetric()` - Convert flat values to metric structure (simplified)
  - `extractMetricValue()` - Extract values from metric structure
  - `getFlatMetricValue()` - Extract from either standardized or legacy format
  - `getAccountName()` - Get account name from any format
  - `getAccountId()` - Get account ID from any format
  - `getCacheStatus()` - Get cache metadata from any format

## Files Modified

### 1. Type Files

- **`src/types/facebook.ts`**
  - Added `FacebookStatsResponse` for standardized format
  - Kept `LegacyFacebookStatsResponseSchema` for backward compatibility
  - Extended with `FacebookAccountInfo`

- **`src/types/linkedin.ts`**
  - Added `LinkedInStatsResponse` for standardized format
  - Kept `LegacyLinkedInStatsResponseSchema` for backward compatibility
  - Extended with `LinkedInAccountInfo`

### 2. API Endpoints

All four stats endpoints updated to return standardized structure:

- **`src/pages/api/data/facebook/stats.ts`**
  - Returns `accountInfo` instead of `pageInfo`
  - Added `dateRange` object
  - Added `cache` object with metadata
  - Set `rawPageStats: null`
  - Validates with Zod schema

- **`src/pages/api/data/instagram/stats.ts`**
  - Returns `accountInfo` instead of `userInfo`
  - Restructured flat metrics to nested by period
  - Added `dateRange` object
  - Added `cache` object with metadata
  - Set `rawPageStats: null`
  - Validates with Zod schema

- **`src/pages/api/data/linkedin/stats.ts`**
  - Returns `accountInfo` instead of `organizationInfo`
  - Restructured metrics to be nested by period
  - Moved `since`, `until`, `datePreset` into `dateRange` object
  - Added `cache` object with metadata
  - Keeps `rawPageStats` (LinkedIn-specific)
  - Set `recentPost: null`
  - Validates with Zod schema

- **`src/pages/api/data/x/stats.ts`**
  - Returns `accountInfo` instead of `userInfo`
  - Restructured flat metrics to nested by period
  - Added `dateRange` object
  - Updated cache metadata to use standardized structure
  - Set `recentPost: null` and `rawPageStats: null`
  - Validates with Zod schema

### 3. Services

- **`src/services/dataTransformationService.ts`**
  - Added `isStandardizedFormat()` - Detect standardized vs legacy format
  - Added `getMetricValue()` - Extract from either format
  - Added `transformStandardizedData()` - Transform standardized data to PlatformOverview
  - Updated `transformInstagramData()` - Handle both formats
  - Imports utility functions from `stats-utils.ts`
  - Maintains backward compatibility with legacy formats

## Backward Compatibility

### DataTransformationService

The service now:
1. Automatically detects standardized vs legacy formats
2. Transforms both formats correctly
3. Falls back to legacy behavior when needed

### Redux Reducers

All reducers maintain backward compatibility:
- Flexible typing with `[key: string]: any` allows both formats
- No breaking changes to existing state structure
- Can accept and store standardized responses

## Platform-Specific Differences

### Facebook
- **Unique fields**: `creationDate` in accountInfo
- **Metrics**: Uses 'day' period by default, 'lifetime' for cumulative metrics like page_likes
  - **Renamed for clarity**: `page_fans` → `page_likes`, `page_impressions` → `page_reach`, `page_total_actions` → `page_actions`
  - **Format**: `metrics.values` uses `{date, value}` format
  - **Optimization**: `page_likes` and `page_reach` only store last value in `metrics.values` (full history in `dateRange`)
- **Date range**: Contains ALL metrics
  - `page_likes` - Time-series array with full historical values
  - `page_reach` - Time-series array with full historical values
  - `page_follows`, `page_post_engagements`, `page_actions` - Set to `null` (no time-series data)
- **Recent posts**: Included when available
- **Raw stats**: Set to null

### Instagram
- **Unique fields**: `biography` in accountInfo
- **Metrics**: Simplified structure, no period nesting
- **Date range**: All metrics set to `null` (no time-series data available)
- **Recent posts**: Included when available
- **Raw stats**: Set to null

### LinkedIn
- **Unique fields**: None specific
- **Metrics**: Simplified structure, no period nesting
- **Date range**: All metrics set to `null` (aggregated data only)
- **Recent posts**: Set to null
- **Raw stats**: Included (LinkedIn-specific detailed breakdown)

### X (Twitter)
- **Unique fields**: `verified` and `biography` in accountInfo
- **Metrics**: Simplified structure, no period nesting
- **Date range**: All metrics set to `null` (no time-series data available)
- **Recent posts**: Set to null
- **Raw stats**: Set to null

## Usage Examples

### Extracting Metric Values

```typescript
import { extractMetricValue, getFlatMetricValue } from '@/lib/stats-utils';

// From standardized response (recommended)
const followers = extractMetricValue(
  response.metrics,
  'followers',
  0  // default value
);

// From either standardized or legacy format (with fallback)
const reach = getFlatMetricValue(
  response,
  'page_reach',
  'post_impressions'  // legacy fallback key
);
```

### Building Standardized Response

```typescript
import {
  createAccountInfo,
  createDateRange,
  createCacheMetadata,
  wrapMetric
} from '@/lib/stats-utils';

const response = {
  platform: 'instagram',
  accountInfo: createAccountInfo({
    id: accountId,
    name: username,
    biography: bio,
  }),
  metrics: {
    followers: wrapMetric(1234, 'followers'),
  },
  dateRange: createDateRange({
    since: req.query.since,
    until: req.query.until,
  }),
  recentPost: null,
  rawPageStats: null,
  cache: createCacheMetadata({
    cached: false,
    fetchStatus: 'SUCCESS',
  }),
};
```

### Using DataTransformationService

```typescript
import DataTransformationService from '@/services/dataTransformationService';
import { getFlatMetricValue, getAccountName } from '@/lib/stats-utils';

const service = DataTransformationService.getInstance();

// Automatically handles both standardized and legacy formats
const platformOverview = service.transformStandardizedData(response);

// Or extract specific values
const accountName = getAccountName(response);
const followers = getFlatMetricValue(response, 'followers');
```

## Testing Recommendations

1. **API Response Validation**
   - Verify all endpoints return proper schema
   - Check Zod validation catches invalid data
   - Test with missing optional fields

2. **Backward Compatibility**
   - Test existing frontend code with new responses
   - Verify DataTransformationService handles both formats
   - Check Redux reducers accept standardized responses

3. **Cache Metadata**
   - Verify cache status is correctly reflected
   - Test fallback to cached data on errors
   - Check cache timestamps are accurate

4. **Date Range Parameters**
   - Test with various date ranges
   - Verify datePreset values work correctly
   - Check empty/missing date parameters

## Migration Notes

### For Frontend Developers

- **No breaking changes** - The DataTransformationService maintains backward compatibility
- **New cache metadata** - The `cache` object is always present with fetch status
- **Consistent field names** - Use `accountInfo` instead of platform-specific names
- **Nested metrics** - Use `extractMetricValue()` utility to get values from nested structure

### For API Consumers

- Update to use `accountInfo` for all platforms
- Access date parameters from `dateRange` object
- Check `cache.cached` to see if data is from cache
- Use utility functions to extract metric values

## Future Enhancements

1. **Additional Platforms** - Template for adding new platforms with standardized structure
2. **Metric Aggregation** - Utilities for combining metrics across periods
3. **Time Series Support** - Enhanced support for historical data with multiple time points
4. **Type Guards** - Runtime type checking for standardized responses
5. **Performance Optimization** - Caching strategies for transformed data

## Summary

The standardization provides:
- ✅ Consistent API responses across all platforms
- ✅ Type-safe with Zod validation
- ✅ Backward compatible with existing code
- ✅ Cache metadata always available
- ✅ Utility functions for common operations
- ✅ Platform-specific fields with null defaults
- ✅ Nested metrics structure for better organization

