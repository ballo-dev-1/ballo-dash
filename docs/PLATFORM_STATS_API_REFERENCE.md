# Platform Stats API Reference

> **Universal Standard for All Social Media Platform Stats APIs**
> 
> Version: 2.0 | Last Updated: October 29, 2025
> 
> This document defines the canonical structure for all platform stats API responses in BalloDash.
> All platforms (Facebook, Instagram, LinkedIn, X) conform to this standard.

---

## Table of Contents

1. [Overview](#overview)
2. [Standardized Response Structure](#standardized-response-structure)
3. [Field Definitions](#field-definitions)
4. [Platform-Specific Implementations](#platform-specific-implementations)
5. [Metric Definitions](#metric-definitions)
6. [Usage Examples](#usage-examples)
7. [Type Definitions](#type-definitions)
8. [Migration Guide](#migration-guide)

---

## Overview

### Endpoints

All platform stats are accessed via standardized endpoints:

```
GET /api/data/facebook/stats?pageId={pageId}&platform=facebook
GET /api/data/instagram/stats?accountId={accountId}
GET /api/data/linkedin/stats?organizationId={orgId}&since={date}&until={date}
GET /api/data/x/stats?userId={userId}
```

### Design Principles

- **Single Response Schema**: All platforms return the same top-level structure
- **Type Safety**: All responses validated with Zod schemas
- **Backward Compatibility**: Legacy formats supported via transformation utilities
- **Cache-First**: Built-in cache metadata for optimal performance
- **Extensible**: Platform-specific fields supported via nullable optionals

---

## Standardized Response Structure

### Complete Response Object

```typescript
{
  platform: 'facebook' | 'instagram' | 'linkedin' | 'x';
  
  accountInfo: {
    id: string;
    name: string;
    profilePicture: string | null;
    biography: string | null;       // Instagram, X only
    creationDate: string | null;     // Facebook only
    verified: boolean | null;        // X only
  };
  
  metrics: {
    [metricName: string]: {
      values: Array<{
        date: string | null;
        value: number | string | Record<string, any>;
      }>;
      title: string;
      description: string;
    };
  };
  
  dateRange: {
    [metricName: string]: Array<{
      date: string;
      value: number | string;
    }> | null;
  };
  
  recentPost: any | null;
  
  rawPageStats: any | null;          // LinkedIn only
  
  cache: {
    cached: boolean;
    fetchStatus: 'SUCCESS' | 'ERROR' | 'PENDING';
    lastFetchedAt: string | null;
    message?: string;
  };
}
```

---

## Field Definitions

### `platform`
- **Type**: `'facebook' | 'instagram' | 'linkedin' | 'x'`
- **Required**: Yes
- **Description**: Identifies which social media platform this data represents

### `accountInfo`
Standardized account/profile information across all platforms.

| Field | Type | Required | Platforms | Description |
|-------|------|----------|-----------|-------------|
| `id` | `string` | Yes | All | Platform-specific account ID |
| `name` | `string` | Yes | All | Account display name or username |
| `profilePicture` | `string \| null` | No | All | URL to profile picture (if available) |
| `biography` | `string \| null` | No | Instagram, X | Account bio/description |
| `creationDate` | `string \| null` | No | Facebook | Page creation date (YYYY-MM-DD) |
| `verified` | `boolean \| null` | No | X | Verification status |

### `metrics`
Simplified flat structure containing all platform metrics.

**Structure**:
```typescript
{
  [metricName]: {
    values: [{ date: string | null, value: any }],
    title: string,
    description: string
  }
}
```

**Key Characteristics**:
- **No period nesting**: Values are stored directly under each metric
- **Flexible values**: Support numbers, strings, or complex objects
- **Date association**: Each value can have an associated date
- **Self-documenting**: Title and description included

**Example**:
```json
{
  "page_likes": {
    "values": [{ "date": "2025-10-29", "value": 15234 }],
    "title": "Page Likes",
    "description": "Total number of page likes"
  }
}
```

### `dateRange`
Time-series historical data for metrics that support date breakdowns.

**Structure**:
```typescript
{
  [metricName]: [{ date: string, value: any }] | null
}
```

**Platform Support**:
- **Facebook**: Contains time-series for `page_likes` and `page_reach` only
- **Instagram, LinkedIn, X**: All metrics set to `null` (no time-series available)

**Purpose**: Separates full historical data from current snapshot values

**Example**:
```json
{
  "page_likes": [
    { "date": "2025-10-01", "value": 14850 },
    { "date": "2025-10-02", "value": 14892 },
    { "date": "2025-10-29", "value": 15234 }
  ],
  "page_reach": [
    { "date": "2025-10-01", "value": 5420 },
    { "date": "2025-10-02", "value": 6123 }
  ],
  "page_follows": null,
  "page_post_engagements": null
}
```

### `recentPost`
Most recent post/content from the platform.

- **Type**: `any | null`
- **Required**: No
- **Platforms**: Facebook (available), Others (set to null)
- **Description**: Contains the latest post data when available

### `rawPageStats`
Platform-specific detailed statistics.

- **Type**: `any | null`
- **Required**: No
- **Platforms**: LinkedIn only (contains detailed page view breakdown)
- **Description**: Raw platform API response for additional context

### `cache`
Metadata about cache status and data freshness.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cached` | `boolean` | Yes | Whether this response came from cache |
| `fetchStatus` | `'SUCCESS' \| 'ERROR' \| 'PENDING'` | Yes | Status of last fetch attempt |
| `lastFetchedAt` | `string \| null` | Yes | ISO timestamp of last successful fetch |
| `message` | `string` | No | Optional status message or error detail |

---

## Platform-Specific Implementations

### Facebook

**API Route**: `/api/data/facebook/stats`

**Query Parameters**:
- `pageId` (required): Facebook Page ID
- `platform` (required): Must be 'facebook'

**Unique Features**:
- ✅ `accountInfo.creationDate`: Page creation date
- ✅ `dateRange`: Contains full time-series for `page_likes` and `page_reach`
- ✅ `recentPost`: Most recent post included
- ❌ `rawPageStats`: Set to null

**Metrics**:
```typescript
{
  page_likes: number;           // Total page likes (lifetime, cumulative)
  page_follows: number;         // Total page followers
  page_reach: number;           // Total impressions/reach
  page_post_engagements: number; // Total post engagements
  page_actions: number;         // Total CTA/action clicks
}
```

**Optimization Note**: 
- `page_likes` and `page_reach` store only the **last value** in `metrics.values`
- Full historical data available in `dateRange` to avoid duplication

**Example**:
```json
{
  "platform": "facebook",
  "accountInfo": {
    "id": "123456789",
    "name": "My Business Page",
    "profilePicture": null,
    "biography": null,
    "creationDate": "2020-01-15",
    "verified": null
  },
  "metrics": {
    "page_likes": {
      "values": [{ "date": "2025-10-29", "value": 15234 }],
      "title": "Page Likes",
      "description": "Total page likes"
    }
  },
  "dateRange": {
    "page_likes": [
      { "date": "2025-10-01", "value": 14850 },
      { "date": "2025-10-29", "value": 15234 }
    ]
  }
}
```

---

### Instagram

**API Route**: `/api/data/instagram/stats`

**Query Parameters**:
- `accountId` (required): Instagram Business Account ID

**Unique Features**:
- ✅ `accountInfo.biography`: Account bio
- ✅ `accountInfo.profilePicture`: Profile picture URL
- ❌ `dateRange`: All metrics set to null
- ❌ `rawPageStats`: Set to null

**Metrics**:
```typescript
{
  followers: number;
  reach: number;
  total_interactions: number;
  website_clicks: number;
  profile_views: number;
  // ... additional Instagram-specific metrics
}
```

**Data Source**: Instagram Graph API

---

### LinkedIn

**API Route**: `/api/data/linkedin/stats`

**Query Parameters**:
- `organizationId` (required): LinkedIn Organization ID
- `since` (optional): Start date (YYYY-MM-DD)
- `until` (optional): End date (YYYY-MM-DD)
- `datePreset` (optional): Date preset value

**Unique Features**:
- ✅ `rawPageStats`: Contains detailed LinkedIn page statistics
- ❌ `dateRange`: All metrics set to null (aggregated data only)
- ❌ `recentPost`: Set to null

**Metrics**:
```typescript
{
  page_follows: number;              // Follower count (scraped)
  page_views: number;                // Page views
  impression_count: number;          // Total impressions
  unique_impressions_count: number;  // Unique impressions
  click_count: number;               // Total clicks
  like_count: number;                // Total likes
  comment_count: number;             // Total comments
  share_count: number;               // Total shares
  share_mentions_count: number;      // Share mentions
  comment_mentions_count: number;    // Comment mentions
  engagement: number;                // Total engagement (calculated)
}
```

**Engagement Calculation**:
```typescript
engagement = like_count + comment_count + share_count
```

**Data Source**: LinkedIn Marketing API + Web scraping for follower count

---

### X (Twitter)

**API Route**: `/api/data/x/stats`

**Query Parameters**:
- `userId` (required): X/Twitter User ID

**Unique Features**:
- ✅ `accountInfo.verified`: Verification badge status
- ✅ `accountInfo.biography`: Profile bio
- ❌ `dateRange`: All metrics set to null
- ❌ `recentPost`: Set to null
- ❌ `rawPageStats`: Set to null

**Metrics**:
```typescript
{
  followers: number;
  following: number;
  tweet_count: number;
  like_count: number;
  // ... additional X-specific metrics
}
```

**Data Source**: X API v2

---

## Metric Definitions

### Metric Naming Conventions

All metrics follow these conventions:
- **Snake case**: `page_likes`, `impression_count`
- **Descriptive**: Clear indication of what's measured
- **Consistent prefixes**: 
  - `page_` for page-level metrics (Facebook)
  - Count suffixes: `_count`, `_views`, `_follows`

### Common Metrics Across Platforms

| Standardized Name | Facebook | Instagram | LinkedIn | X | Description |
|-------------------|----------|-----------|----------|---|-------------|
| Followers/Likes | `page_likes` | `followers` | `page_follows` | `followers` | Total follower/like count |
| Reach/Impressions | `page_reach` | `reach` | `impression_count` | N/A | Content reach or impressions |
| Engagement | `page_post_engagements` | `total_interactions` | `engagement` | N/A | Total user interactions |

---

## Usage Examples

### Extracting Metric Values

#### Using Utility Functions

```typescript
import { 
  extractMetricValue, 
  getFlatMetricValue,
  getAccountName 
} from '@/lib/stats-utils';

// From standardized response
const response = await fetch('/api/data/facebook/stats?pageId=123');
const data = await response.json();

// Extract specific metric (recommended)
const followers = extractMetricValue(data.metrics, 'page_likes', 0);

// Get account name (works with any platform)
const name = getAccountName(data);

// Extract with legacy fallback
const reach = getFlatMetricValue(
  data,
  'page_reach',         // standardized key
  'post_impressions'    // legacy fallback key
);
```

#### Manual Extraction

```typescript
// Get latest value from a metric
const pageLikes = data.metrics.page_likes?.values[0]?.value || 0;

// Get time-series data
const timeSeriesData = data.dateRange.page_likes || [];

// Check cache status
const isCached = data.cache.cached;
const isSuccess = data.cache.fetchStatus === 'SUCCESS';
```

### Building Standardized Responses

```typescript
import {
  createAccountInfo,
  createDateRange,
  createCacheMetadata,
  wrapMetric,
  createEmptyDateRange
} from '@/lib/stats-utils';

// In your API handler
const response = {
  platform: 'instagram',
  
  accountInfo: createAccountInfo({
    id: accountId,
    name: username,
    profilePicture: profilePicUrl,
    biography: bio,
  }),
  
  metrics: {
    followers: wrapMetric(12345, 'followers'),
    reach: wrapMetric(54321, 'reach'),
  },
  
  dateRange: createEmptyDateRange(['followers', 'reach']),
  
  recentPost: null,
  rawPageStats: null,
  
  cache: createCacheMetadata({
    cached: false,
    fetchStatus: 'SUCCESS',
    lastFetchedAt: new Date().toISOString(),
  }),
};

// Validate with Zod
const validated = InstagramStatsResponseSchema.parse(response);
```

### Working with DataTransformationService

```typescript
import DataTransformationService from '@/services/dataTransformationService';

const service = DataTransformationService.getInstance();

// Automatically handles both standardized and legacy formats
const platformOverview = service.transformStandardizedData(response);

// Result includes:
// - platform: string
// - accountName: string
// - accountId: string
// - metrics: standardized key-value pairs
// - cacheStatus: cache metadata
```

### Consuming in Components

```typescript
// Example: Displaying Facebook stats
function FacebookStats({ pageId }: { pageId: string }) {
  const [stats, setStats] = useState<FacebookStatsResponse | null>(null);
  
  useEffect(() => {
    fetch(`/api/data/facebook/stats?pageId=${pageId}&platform=facebook`)
      .then(res => res.json())
      .then(setStats);
  }, [pageId]);
  
  if (!stats) return <Loading />;
  
  const pageLikes = extractMetricValue(stats.metrics, 'page_likes', 0);
  const pageReach = extractMetricValue(stats.metrics, 'page_reach', 0);
  
  return (
    <div>
      <h2>{stats.accountInfo.name}</h2>
      <p>Likes: {pageLikes.toLocaleString()}</p>
      <p>Reach: {pageReach.toLocaleString()}</p>
      
      {stats.cache.cached && (
        <small>Cached data from {stats.cache.lastFetchedAt}</small>
      )}
      
      {/* Time-series chart */}
      <LineChart data={stats.dateRange.page_likes} />
    </div>
  );
}
```

---

## Type Definitions

### Core Type References

All types are defined in `/src/types/shared-stats.ts`:

```typescript
// Main response type
export type StandardStatsResponse = {
  platform: string;
  accountInfo: AccountInfo;
  metrics: Metrics;
  dateRange: DateRange;
  recentPost: any | null;
  rawPageStats: any | null;
  cache: CacheMetadata;
};

// Platform-specific extensions
import type { FacebookStatsResponse } from '@/types/facebook';
import type { InstagramStatsResponse } from '@/types/instagram';
import type { LinkedInStatsResponse } from '@/types/linkedin';
import type { XStatsResponse } from '@/types/x';
```

### Zod Schemas

All responses are validated using Zod schemas:

```typescript
import { 
  StandardStatsResponseSchema,
  FacebookStatsResponseSchema,
  InstagramStatsResponseSchema,
  LinkedInStatsResponseSchema,
  XStatsResponseSchema
} from '@/types/*';

// Validate at runtime
const validated = FacebookStatsResponseSchema.parse(apiResponse);
```

### Type Guards

```typescript
function isFacebookStats(data: any): data is FacebookStatsResponse {
  return data.platform === 'facebook';
}

function isStandardizedFormat(data: any): boolean {
  return 'accountInfo' in data && 'metrics' in data && 'cache' in data;
}
```

---

## Migration Guide

### From Legacy to Standardized Format

#### Field Mapping

| Legacy Field | Standardized Field | Notes |
|--------------|-------------------|-------|
| `pageInfo` | `accountInfo` | All platforms |
| `userInfo` | `accountInfo` | Instagram, X |
| `organizationInfo` | `accountInfo` | LinkedIn |
| `metrics.<metric>.<period>` | `metrics.<metric>` | No period nesting |
| `since`, `until`, `datePreset` | `dateRange` | Nested object |
| N/A | `cache` | New required field |

#### Code Migration

**Before** (Legacy):
```typescript
// Old approach
const pageName = data.pageInfo?.name || data.userInfo?.name;
const followers = data.metrics?.page_fans?.lifetime?.values[0]?.value;
```

**After** (Standardized):
```typescript
// New approach with utilities
import { getAccountName, extractMetricValue } from '@/lib/stats-utils';

const pageName = getAccountName(data);
const followers = extractMetricValue(data.metrics, 'page_likes', 0);
```

#### Backward Compatibility

The `DataTransformationService` automatically detects and transforms both formats:

```typescript
// Automatically works with both formats
const service = DataTransformationService.getInstance();
const transformed = service.transformStandardizedData(apiResponse);
```

### Adding New Platforms

To add a new platform following this standard:

1. **Create type definition** (`/src/types/newplatform.ts`):
```typescript
import { StandardStatsResponseSchema } from './shared-stats';

export const NewPlatformStatsResponseSchema = StandardStatsResponseSchema.extend({
  platform: z.literal('newplatform'),
  // platform-specific fields
});
```

2. **Create API endpoint** (`/src/pages/api/data/newplatform/stats.ts`):
```typescript
import { createAccountInfo, createCacheMetadata, wrapMetric } from '@/lib/stats-utils';

export default async function handler(req, res) {
  // ... fetch data from platform API
  
  const response = {
    platform: 'newplatform',
    accountInfo: createAccountInfo({ ... }),
    metrics: { ... },
    dateRange: { ... },
    recentPost: null,
    rawPageStats: null,
    cache: createCacheMetadata({ ... }),
  };
  
  const validated = NewPlatformStatsResponseSchema.parse(response);
  return res.status(200).json(validated);
}
```

3. **Update DataTransformationService** if needed

---

## Validation & Error Handling

### Zod Validation

All responses are validated before being returned:

```typescript
try {
  const validated = FacebookStatsResponseSchema.parse(response);
  return res.status(200).json(validated);
} catch (validationError) {
  console.error("Validation failed:", validationError);
  // Optionally return anyway with warning
  return res.status(200).json(response);
}
```

### Error Response Format

When stats fetching fails:

```json
{
  "error": "Failed to fetch Facebook stats",
  "details": "Access token expired"
}
```

### Cache Fallback

When API fails but cache exists:

```json
{
  "platform": "facebook",
  "accountInfo": { ... },
  "metrics": { ... },
  "cache": {
    "cached": true,
    "fetchStatus": "ERROR",
    "lastFetchedAt": "2025-10-28T10:30:00Z",
    "message": "Using cached data due to API error"
  }
}
```

---

## Best Practices

### 1. Always Use Utility Functions

✅ **DO**:
```typescript
import { extractMetricValue, getAccountName } from '@/lib/stats-utils';
const followers = extractMetricValue(data.metrics, 'followers', 0);
```

❌ **DON'T**:
```typescript
const followers = data.metrics?.followers?.values[0]?.value || 0;
```

### 2. Check Cache Status

```typescript
if (data.cache.fetchStatus !== 'SUCCESS') {
  console.warn('Data may be stale or incomplete');
}

if (data.cache.cached) {
  // Show "last updated" timestamp
  console.log(`Data from cache: ${data.cache.lastFetchedAt}`);
}
```

### 3. Handle Missing Metrics Gracefully

```typescript
const reach = extractMetricValue(data.metrics, 'page_reach', 0);
// Returns 0 if metric doesn't exist (default value)
```

### 4. Validate with Zod in API Handlers

Always validate responses before returning them:

```typescript
const validated = PlatformStatsResponseSchema.parse(response);
return res.status(200).json(validated);
```

### 5. Use Type Guards

```typescript
if (isStandardizedFormat(data)) {
  // Use standardized accessors
  const name = getAccountName(data);
} else {
  // Legacy format handling
  const name = data.pageInfo?.name;
}
```

---

## Related Files

### Type Definitions
- `/src/types/shared-stats.ts` - Base schemas and types
- `/src/types/facebook.ts` - Facebook-specific types
- `/src/types/instagram.ts` - Instagram-specific types
- `/src/types/linkedin.ts` - LinkedIn-specific types
- `/src/types/x.ts` - X-specific types

### Utilities
- `/src/lib/stats-utils.ts` - Helper functions for building and extracting data

### API Endpoints
- `/src/pages/api/data/facebook/stats.ts`
- `/src/pages/api/data/instagram/stats.ts`
- `/src/pages/api/data/linkedin/stats.ts`
- `/src/pages/api/data/x/stats.ts`

### Services
- `/src/services/dataTransformationService.ts` - Transforms stats to component-friendly format
- `/src/services/socialMediaCacheService.ts` - Cache management

---

## Changelog

### Version 2.0 (October 2025)
- ✅ Standardized response structure across all platforms
- ✅ Simplified metrics structure (removed period nesting)
- ✅ Added `dateRange` for time-series data
- ✅ Unified `accountInfo` across platforms
- ✅ Added mandatory `cache` metadata
- ✅ Zod validation for all responses
- ✅ Backward compatibility maintained

### Version 1.0 (Legacy)
- Platform-specific response formats
- Inconsistent field naming
- Period-nested metrics
- No cache metadata

---

## Support

For questions or issues with platform stats APIs:

1. Check this reference document first
2. Review type definitions in `/src/types/`
3. Examine working examples in API handlers
4. Consult `DataTransformationService` for transformation logic

**Last Updated**: October 29, 2025  
**Maintained By**: BalloDash Engineering Team

