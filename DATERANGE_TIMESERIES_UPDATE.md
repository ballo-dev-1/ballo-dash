# DateRange Time-Series Structure Update

## Overview

The `dateRange` field has been restructured from query parameters to contain actual time-series data for metrics that support historical breakdowns.

## What Changed

### Before

```typescript
{
  dateRange: {
    since?: string;      // Query parameter
    until?: string;      // Query parameter
    datePreset?: string; // Query parameter
  }
}
```

### After

```typescript
{
  dateRange: {
    page_likes: [
      { date: "2024-01-01", value: 10000 },
      { date: "2024-01-02", value: 10050 },
      { date: "2024-01-03", value: 10100 }
    ],
    page_reach: [
      { date: "2024-01-01", value: 5000 },
      { date: "2024-01-02", value: 5200 },
      { date: "2024-01-03", value: 5400 }
    ],
    followers: null,  // No time-series data
    // ... other metrics set to null
  }
}
```

## Rationale

1. **Actual Data vs Parameters** - `dateRange` now contains actual time-series data, not just query params
2. **Historical Trends** - Frontend can easily plot charts without additional API calls
3. **Conditional Data** - Platforms without time-series data clearly show `null`
4. **Consistent Structure** - Same format across all platforms (array or null)
5. **No Duplication** - Metrics with time-series store only latest value in `metrics.values`, avoiding redundant data
6. **Optimized Payload** - Smaller response size while maintaining all necessary information

## Platform-Specific Behavior

### Facebook ✅ Time-Series Data

**Metrics with date breakdowns:**
- `page_likes` - Historical page likes data
- `page_reach` - Historical reach/impressions data

**Format:**
```typescript
dateRange: {
  // Metrics with time-series data
  page_likes: [
    { date: "2024-01-01", value: 10000 },
    { date: "2024-01-02", value: 10050 }
  ],
  page_reach: [
    { date: "2024-01-01", value: 5000 },
    { date: "2024-01-02", value: 5200 }
  ],
  // Metrics without time-series data (set to null)
  page_follows: null,
  page_post_engagements: null,
  page_actions: null
}
```

**Note:** All metrics are included in `dateRange`, but only `page_likes` and `page_reach` have actual historical arrays. The rest are explicitly set to `null`.

### Instagram ⚠️ No Time-Series Data

Instagram API doesn't provide historical breakdowns for most metrics.

**Format:**
```typescript
dateRange: {
  followers: null,
  reach: null,
  total_interactions: null,
  // ... all metrics set to null
}
```

### LinkedIn ⚠️ No Time-Series Data

LinkedIn API provides aggregated data for the specified time range.

**Format:**
```typescript
dateRange: {
  page_follows: null,
  impression_count: null,
  engagement: null,
  // ... all metrics set to null
}
```

### X (Twitter) ⚠️ No Time-Series Data

X API provides current snapshot values only.

**Format:**
```typescript
dateRange: {
  followers: null,
  following: null,
  tweet_count: null,
  // ... all metrics set to null
}
```

## Implementation Details

### Type Definitions

**File:** `src/types/shared-stats.ts`

```typescript
// Time-series data point
export const TimeSeriesDataPointSchema = z.object({
  date: z.string(),
  value: z.union([z.number(), z.string()]),
});

// DateRange now contains time-series arrays
export const DateRangeSchema = z.record(
  z.string(), // metric name
  z.array(TimeSeriesDataPointSchema).nullable()
);
```

### Utility Functions

**File:** `src/lib/stats-utils.ts`

```typescript
// Build time-series from Facebook API values
buildTimeSeriesFromValues(
  values: Array<{ value: any; endTime: string | null }>
): Array<{ date: string; value: any }> | null

// Create empty dateRange for platforms without time-series
createEmptyDateRange(metricNames: string[]): DateRange

// Create dateRange with actual time-series data
createDateRange(
  metricsWithDates?: Record<string, Array<{ date: string; value: any }> | null>
): DateRange
```

### Facebook Stats API

**File:** `src/pages/api/data/facebook/stats.ts`

```typescript
// Build time-series data for metrics with historical data
const timeSeriesData: Record<string, Array<{ date: string; value: any }> | null> = {};

// Process each metric
if (standardizedName === 'page_likes' || standardizedName === 'page_reach') {
  // These metrics have time-series data
  const timeSeries = buildTimeSeriesFromValues(formattedValues);
  if (timeSeries && timeSeries.length > 0) {
    timeSeriesData[standardizedName] = timeSeries;
  } else {
    timeSeriesData[standardizedName] = null;
  }
} else {
  // Other metrics don't have time-series data - set to null
  timeSeriesData[standardizedName] = null;
}

// Use in response - contains ALL metrics with null for those without time-series
dateRange: createDateRange(timeSeriesData)
```

**Result:** 
- The `dateRange` object includes all Facebook metrics
- `page_likes` and `page_reach` contain full time-series arrays
- Other metrics (`page_follows`, `page_post_engagements`, `page_actions`) are set to `null`
- In `metrics` object, `page_likes` and `page_reach` only store the **last value** (not the full array) to avoid duplication

### Other Platforms

All other platforms use `createEmptyDateRange()`:

```typescript
// Instagram
dateRange: createEmptyDateRange(Array.from(INSTAGRAM_METRICS))

// LinkedIn
dateRange: createEmptyDateRange(linkedInMetrics)

// X
dateRange: createEmptyDateRange(Array.from(X_METRICS))
```

## Usage Examples

### Accessing Time-Series Data (Facebook)

```typescript
// Get current/latest value from metrics
const currentLikes = response.metrics.page_likes.values[0].value;
const currentLikesDate = response.metrics.page_likes.values[0].date;

// Get historical page likes from dateRange
const pageLikesHistory = response.dateRange.page_likes;

if (pageLikesHistory) {
  pageLikesHistory.forEach(point => {
    console.log(`${point.date}: ${point.value} likes`);
  });
}

// Plot on a chart
const chartData = {
  labels: response.dateRange.page_likes?.map(p => p.date) || [],
  values: response.dateRange.page_likes?.map(p => p.value) || []
};
```

### Checking for Time-Series Data

```typescript
// Check if metric has historical data
const hasTimeSeriesData = (response: any, metricName: string): boolean => {
  return response.dateRange[metricName] !== null && 
         Array.isArray(response.dateRange[metricName]) &&
         response.dateRange[metricName].length > 0;
};

if (hasTimeSeriesData(facebookStats, 'page_reach')) {
  // Show chart
} else {
  // Show single value
}
```

### Building Charts

```typescript
import { Chart } from 'react-chartjs-2';

const PageLikesChart = ({ stats }) => {
  const timeSeries = stats.dateRange.page_likes;
  
  if (!timeSeries || timeSeries.length === 0) {
    return <p>No historical data available</p>;
  }
  
  const chartData = {
    labels: timeSeries.map(point => point.date),
    datasets: [{
      label: 'Page Likes',
      data: timeSeries.map(point => point.value),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  
  return <Chart type="line" data={chartData} />;
};
```

## Benefits

### 1. **No Additional API Calls**
- Historical data included in initial response
- Frontend can immediately render charts
- Reduced latency for trend visualizations

### 2. **No Data Duplication**
- Metrics with time-series only store latest value in `metrics`
- Full historical data only in `dateRange`
- Optimized payload size

### 3. **Clear Data Availability**
- `null` explicitly shows no time-series data
- Easy to check if charting is possible
- Consistent interface across platforms

### 4. **Simple Chart Integration**
- Data already formatted for charting libraries
- Date and value pairs ready to use
- No transformation needed

### 5. **Flexible for Future**
- Easy to add time-series for other platforms
- Extensible structure
- Backward compatible (can check for null)

## Migration Notes

### For Components Using dateRange

**Before:**
```typescript
// Old - accessing query params
const since = response.dateRange?.since;
const until = response.dateRange?.until;
```

**After:**
```typescript
// New - accessing time-series data
const pageLikesHistory = response.dateRange?.page_likes;

// For metrics without time-series
if (response.dateRange?.followers === null) {
  // Platform doesn't support time-series for this metric
}
```

### Type Changes

```typescript
// Old DateRange type
type DateRange = {
  since?: string;
  until?: string;
  datePreset?: string;
};

// New DateRange type
type DateRange = Record<
  string,  // metric name
  Array<{ date: string; value: any }> | null
>;
```

## Files Modified

✅ `src/types/shared-stats.ts` - Updated DateRange schema  
✅ `src/lib/stats-utils.ts` - Updated helper functions  
✅ `src/pages/api/data/facebook/stats.ts` - Builds time-series for page_likes and page_reach  
✅ `src/pages/api/data/instagram/stats.ts` - Uses empty dateRange  
✅ `src/pages/api/data/linkedin/stats.ts` - Uses empty dateRange  
✅ `src/pages/api/data/x/stats.ts` - Uses empty dateRange  
✅ Documentation files updated  

## Example Response

### Facebook (with time-series)

```json
{
  "platform": "facebook",
  "accountInfo": { "id": "123", "name": "My Page" },
  "metrics": {
    "page_likes": {
      "values": [{ "date": "2024-01-03", "value": 10100 }],  // Last value only (full history in dateRange)
      "title": "Page Likes",
      "description": "Page Likes metric"
    },
    "page_reach": {
      "values": [{ "date": "2024-01-03", "value": 5400 }],  // Last value only (full history in dateRange)
      "title": "Page Reach",
      "description": "Page Reach metric"
    },
    "page_follows": { 
      "values": [{ "date": "2024-01-03", "value": 1200 }],  // Single value
      "title": "Page Follows",
      "description": "Page Follows metric"
    },
    "page_post_engagements": { "values": [...], "title": "...", "description": "..." },
    "page_actions": { "values": [...], "title": "...", "description": "..." }
  },
  "dateRange": {
    "page_likes": [
      { "date": "2024-01-01", "value": 10000 },
      { "date": "2024-01-02", "value": 10050 },
      { "date": "2024-01-03", "value": 10100 }
    ],
    "page_reach": [
      { "date": "2024-01-01", "value": 5000 },
      { "date": "2024-01-02", "value": 5200 },
      { "date": "2024-01-03", "value": 5400 }
    ],
    "page_follows": null,
    "page_post_engagements": null,
    "page_actions": null
  },
  "cache": { "cached": false, "fetchStatus": "SUCCESS", ... }
}
```

**Note:** For metrics with time-series data (`page_likes`, `page_reach`), the `metrics` object contains only the **last value** to avoid duplication. The full historical array is in `dateRange`.

### Instagram (no time-series)

```json
{
  "platform": "instagram",
  "accountInfo": { "id": "456", "name": "my_account" },
  "metrics": {
    "followers": { "values": [{ "value": 1234, "endTime": null }], ... },
    "reach": { "values": [{ "value": 5678, "endTime": null }], ... }
  },
  "dateRange": {
    "followers": null,
    "reach": null,
    "total_interactions": null,
    // ... all set to null
  },
  "cache": { "cached": false, "fetchStatus": "SUCCESS", ... }
}
```

## Summary

The `dateRange` field now provides:

✅ **Time-series data** for Facebook metrics that support it  
✅ **Null values** for platforms/metrics without historical data  
✅ **Chart-ready format** with date/value pairs  
✅ **Clear data availability** indication  
✅ **Consistent structure** across all platforms  

This makes it easy to:
- Build trend charts for Facebook
- Know which metrics have historical data
- Handle missing data gracefully
- Render visualizations without transformation

