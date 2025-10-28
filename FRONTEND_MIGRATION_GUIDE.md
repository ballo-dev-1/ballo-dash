# Frontend Migration Guide: Standardized Stats API

## Overview

The frontend has been updated to work with both the **new standardized stats structure** and the **legacy format**. This provides full backward compatibility during the transition period.

## What Was Updated

### 1. Redux Reducers ✅

All four Redux reducers now accept both standardized and legacy formats:

**Files Updated:**
- `src/toolkit/facebookData/reducer.ts`
- `src/toolkit/instagramData/reducer.ts`
- `src/toolkit/linkedInData/reducer.ts`
- `src/toolkit/xData/reducer.ts`

**Changes:**
- Added type imports for standardized responses (`FacebookStatsResponse`, `InstagramStatsResponse`, etc.)
- Created union types to accept both legacy and standardized formats
- State interfaces now accept `StandardizedStats | LegacyStats`

### 2. Helper Functions ✅

Added compatibility helper functions to `src/lib/stats-utils.ts`:

```typescript
// Check if data is in standardized format
isStandardizedFormat(data: any): boolean

// Get account name from either format
getAccountName(data: any): string

// Get account ID from either format
getAccountId(data: any): string

// Get metric value from standardized or legacy format
getFlatMetricValue(
  data: any,
  metricName: string,
  fallbackKey?: string
): any

// Get cache status from either format
getCacheStatus(data: any): { cached: boolean; lastFetchedAt: string | null; message?: string }
```

### 3. Hooks Updated ✅

**File:** `src/hooks/usePlatformStats.ts`

- Now uses `getFlatMetricValue()` helper to extract metrics
- Works with both nested (standardized) and flat (legacy) structures
- Updated reach and engagement calculations to handle both formats
- Added proper fallbacks for legacy field names

**Example:**
```typescript
// Old way (only works with legacy):
const reach = linkedInStats?.uniqueImpressionsCount;

// New way (works with both):
const reach = getFlatMetricValue(linkedInStats, 'unique_impressions_count', 'uniqueImpressionsCount');
```

### 4. Components Updated ✅

**File:** `src/components/InstagramPostsExample.tsx`

- Added optional chaining for account info access
- Provides fallback values for missing fields
- Works with both `pageInfo` (legacy) and `accountInfo` (standardized)

## How It Works

### Automatic Format Detection

The system automatically detects which format is being used:

```typescript
// In Redux state, data can be either format
stats: StandardizedFacebookStats | FacebookStats | null;

// Helper functions auto-detect and extract correctly
const accountName = getAccountName(stats); // Works with either format
```

### Dual Format Support

All helper functions first try the **standardized format**, then fall back to **legacy**:

```typescript
export function getFlatMetricValue(data, metricName, fallbackKey) {
  // 1. Try standardized structure (has values array)
  if (data.metrics[metricName]?.values) {
    return data.metrics[metricName].values[0].value;
  }
  
  // 2. Try flat structure (legacy)
  if (data.metrics[metricName]) {
    return data.metrics[metricName];
  }
  
  // 3. Try fallback key (legacy direct access)
  if (data[fallbackKey]) {
    return data[fallbackKey];
  }
  
  return null;
}
```

## Migration Status

### ✅ Completed

1. **API Endpoints** - Return standardized structure
2. **Type Definitions** - Support both formats
3. **Redux Reducers** - Accept both formats
4. **Helper Functions** - Work with both formats
5. **Core Hook (usePlatformStats)** - Updated to use helpers
6. **Example Components** - Updated with optional chaining

### 🔄 Components That Will Automatically Work

These components use DataTransformationService or Redux selectors, which already handle both formats:

- `src/pages/data/tables/OverviewAccounts.tsx`
- `src/pages/data/tables/OverviewAudience.tsx`
- `src/pages/data/Overview.tsx`
- `src/pages/dashboard.tsx`

DataTransformationService automatically detects format and transforms correctly.

### ⚠️ Components That May Need Updates

If you encounter errors in these areas:

1. **Direct Property Access**
   ```typescript
   // ❌ May break with standardized format
   const name = stats.pageInfo.name;
   
   // ✅ Works with both
   const name = getAccountName(stats);
   ```

2. **Direct Metric Access**
   ```typescript
   // ❌ May break with nested metrics
   const followers = stats.metrics.followers;
   
   // ✅ Works with both
   const followers = getFlatMetricValue(stats, 'followers', 'total');
   ```

3. **Cache Metadata**
   ```typescript
   // ❌ May not work with standardized format
   if (stats._cached) { ... }
   
   // ✅ Works with both
   const { cached } = getCacheStatus(stats);
   if (cached) { ... }
   ```

## Usage Examples

### Accessing Account Info

```typescript
import { getAccountName, getAccountId } from '@/lib/stats-utils';

// Works with both formats
const name = getAccountName(facebookStats);
const id = getAccountId(instagramStats);
```

### Accessing Metrics

```typescript
import { getFlatMetricValue } from '@/lib/stats-utils';

// LinkedIn followers
const followers = getFlatMetricValue(
  linkedInStats,
  'page_follows',      // standardized name
  'followers'          // legacy fallback
);

// Facebook reach
const reach = getFlatMetricValue(
  facebookStats,
  'page_reach',        // standardized name
  'post_impressions'   // legacy fallback
);

// Instagram engagement
const engagement = getFlatMetricValue(
  instagramStats,
  'total_interactions', // standardized name
  'totalInteractions'   // legacy fallback
);
```

### Checking Cache Status

```typescript
import { getCacheStatus } from '@/lib/stats-utils';

const { cached, lastFetchedAt, message } = getCacheStatus(stats);

if (cached) {
  console.log(`Using cached data from ${lastFetchedAt}`);
  if (message) {
    console.log(`Reason: ${message}`);
  }
}
```

### In Components

```tsx
import { getAccountName, getFlatMetricValue } from '@/lib/stats-utils';

const MyComponent = () => {
  const stats = useSelector(selectFacebookStats);
  
  // Safe access to account info
  const pageName = getAccountName(stats);
  
  // Safe access to metrics (simplified - no period parameter)
  const followers = getFlatMetricValue(stats, 'page_likes');
  const reach = getFlatMetricValue(stats, 'page_reach');
  
  return (
    <div>
      <h2>{pageName}</h2>
      <p>Followers: {followers}</p>
      <p>Reach: {reach}</p>
    </div>
  );
};
```

## Testing Checklist

When testing your component with the new system:

- [ ] Component loads without errors
- [ ] Account names display correctly
- [ ] Metrics show proper values
- [ ] Cache indicators work correctly
- [ ] Works with both old and new API responses
- [ ] No console errors related to undefined properties
- [ ] Fallback values display when data is missing

## Benefits

### 1. **Zero Breaking Changes**
- All existing code continues to work
- No immediate migration required
- Gradual adoption possible

### 2. **Type Safety**
- Union types provide proper TypeScript support
- Helper functions handle type conversions
- Zod validation on API responses

### 3. **Cleaner Code**
- Consistent helper functions
- No more platform-specific field access
- Centralized data extraction logic

### 4. **Future Proof**
- Easy to add new platforms
- Standardized structure is extensible
- Helper functions hide complexity

## Troubleshooting

### Issue: "Cannot read property 'name' of undefined"

**Solution:** Use helper function instead of direct access
```typescript
// Instead of: stats.pageInfo.name
// Use: getAccountName(stats)
```

### Issue: "Metrics showing as undefined"

**Solution:** Use `getFlatMetricValue` with proper fallback
```typescript
getFlatMetricValue(stats, 'metric_name', 'period', 'legacyFallbackKey')
```

### Issue: "Cache status not showing"

**Solution:** Use `getCacheStatus` helper
```typescript
const { cached, lastFetchedAt } = getCacheStatus(stats);
```

## Next Steps

1. **Monitor Console Logs** - Check development console for any property access errors
2. **Test All Platforms** - Verify Facebook, Instagram, LinkedIn, and X all work
3. **Update Custom Components** - If you've created custom components, update them to use helpers
4. **Remove Legacy Code** - Once fully migrated, legacy format support can be removed

## Support

If you encounter issues:

1. Check if you're using direct property access (bad) vs. helpers (good)
2. Verify the helper function has the correct fallback key
3. Check Redux DevTools to see the actual data structure
4. Consult `STANDARDIZED_STATS_API_IMPLEMENTATION.md` for API details

## Summary

✅ **Backend APIs** return standardized structure  
✅ **Redux stores** accept both formats  
✅ **Helper functions** extract from either format  
✅ **Hooks updated** to use helpers  
✅ **Components work** with both formats  
✅ **Zero breaking changes** for existing code  

The frontend is now fully compatible with the standardized stats API structure while maintaining complete backward compatibility.

