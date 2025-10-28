import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "..";
import { fetchIntegrations } from "../Integrations/reducer";
import type { FacebookStatsResponse } from "@/types/facebook";

interface FacebookStats {
  pageId: string;
  impressions: number;
  reach: number;
  engagement: number;
  likes: number;
  followers: number;
  since: string;
  until: string;
  datePreset: string;
  [key: string]: any;
}

// Standardized stats format
interface StandardizedFacebookStats extends FacebookStatsResponse {
  pageId?: string; // For backward compatibility
}

// New interface for progressive updates - UPDATED TO FLAT STRUCTURE
interface ProgressiveFacebookStats {
  pageId: string;
  pageInfo?: { name: string; id: string };
  accountInfo?: { name: string; id: string }; // NEW standardized field
  platform?: string;
  metrics: {
    [metricName: string]: {
      values: Array<{ date: string | null; value: number }>;
      title: string;
      description: string;
    };
  };
  recentPost?: any;
  since: string;
  until: string;
  datePreset: string;
  loadingMetrics: string[]; // Track which metrics are still loading
  completedMetrics: string[]; // Track which metrics are completed
}

interface Post {
  id: string;
  message?: string;
  created_time: string;
}

interface PostsResponse {
  pageInfo: { name: string; id: string };
  platform: string;
  posts: Post[];
}

interface FacebookState {
  stats: StandardizedFacebookStats | FacebookStats | null;
  progressiveStats: ProgressiveFacebookStats | null; // New progressive stats
  posts: PostsResponse | null;
  pageName: string | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  statusProgressiveStats: "idle" | "loading" | "succeeded" | "failed"; // New status
  statusPosts: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
  errorProgressiveStats: string | null; // New error
  errorPosts: string | null;
}

const initialState: FacebookState = {
  stats: null,
  progressiveStats: null,
  posts: null,
  pageName: null,
  statusStats: "idle",
  statusProgressiveStats: "idle",
  statusPosts: "idle",
  errorStats: null,
  errorProgressiveStats: null,
  errorPosts: null,
};

/**
 * Thunk for fetching Facebook stats
 * Fetches all metrics in a single request (non-progressive)
 * Uses official Facebook date_preset values
 * Reference: https://developers.facebook.com/docs/graph-api/reference/v23.0/insights
 */
export const fetchFacebookStats = createAsyncThunk<
  FacebookStats,
  {
    pageId: string;
    platform: string;
    since?: string;
    until?: string;
    datePreset?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "facebook/fetchStats",
  async (
    { pageId, platform, since = "", until = "", datePreset = "maximum" },
    { dispatch, getState }
  ) => {
    let state = getState();

    // Ensure integrations are loaded
    if (
      state.integrations.integrations.length === 0 &&
      state.integrations.loading !== true
    ) {
      const companyId = state.company?.id;
      if (!companyId) {
        throw new Error("Company ID not found in state");
      }
      await dispatch(fetchIntegrations(companyId));
      state = getState();
    }

    // Find Facebook integration
    const facebookIntegration = state.integrations.integrations.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!facebookIntegration) {
      console.error(`[Facebook Stats] No ${platform} integration found`);
      throw new Error("No Facebook integration found");
    }

    // Build API URL
    const params = new URLSearchParams({
      platform: platform.toLowerCase(),
      pageId,
      datePreset,
    });
    
    if (since) params.append('since', since);
    if (until) params.append('until', until);

    const url = `/api/data/facebook/stats?${params.toString()}`;
    
    // Fetch data
      const res = await fetch(url);
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch Facebook stats: ${errText}`);
      }

      const result = await res.json();
      return result;
  }
);

/**
 * Progressive thunk for fetching metrics individually
 * Useful for showing loading states per metric
 * Uses official Facebook date_preset values
 * Reference: https://developers.facebook.com/docs/graph-api/reference/v23.0/insights
 */
export const fetchFacebookStatsProgressive = createAsyncThunk<
  void,
  {
    pageId: string;
    platform: string;
    since?: string;
    until?: string;
    datePreset?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "facebook/fetchStatsProgressive",
  async (
    { pageId, platform, since = "", until = "", datePreset = "maximum" },
    { dispatch, getState }
  ) => {
    let state = getState();

    // Ensure integrations are loaded
    if (state.integrations.integrations.length === 0 && !state.integrations.loading) {
      const companyId = state.company?.id;
      if (!companyId) {
        throw new Error("Company ID not found");
      }
      await dispatch(fetchIntegrations(companyId));
      state = getState();
    }

    // Wait for integrations to finish loading
    while (state.integrations.loading) {
      await new Promise(resolve => setTimeout(resolve, 100));
        state = getState();
    }

    // Check for Facebook integration
    const facebookIntegration = state.integrations.integrations.find(
      (integration: { type: string }) => integration.type === 'FACEBOOK'
    );
    
    if (!facebookIntegration || !facebookIntegration.accessToken) {
      throw new Error("Facebook integration not found or missing access token");
    }

    // Initialize progressive stats
            dispatch(initializeProgressiveFacebookStats({
      pageId,
      platform,
      since,
      until,
      datePreset
    }));

    // Fetch page info first
    const pageInfoRes = await fetch(
      `/api/data/facebook/pageInfo?platform=${platform.toLowerCase()}&pageId=${pageId}`
    );
    
    if (pageInfoRes.ok) {
      const pageInfo = await pageInfoRes.json();
      dispatch(updatePageInfo(pageInfo));
    }

    // Define core metrics to fetch
    const metricList = [
      "page_likes",
      "page_follows", 
      "page_reach",
      "page_post_engagements",
      "page_actions"
    ];

    // Fetch each metric individually
    for (const metric of metricList) {
      try {
        dispatch(startMetricFetch(metric));
        
        const res = await fetch(
          `/api/data/facebook/metric?platform=${platform.toLowerCase()}&pageId=${pageId}&metric=${metric}&since=${since}&until=${until}&datePreset=${datePreset}`
        );

        if (res.ok) {
          const metricData = await res.json();
          dispatch(updateMetric({ metric, data: metricData }));
        } else {
          dispatch(failMetric({ metric, error: `Failed to fetch ${metric}` }));
        }
      } catch (error) {
        dispatch(failMetric({ metric, error: error instanceof Error ? error.message : 'Unknown error' }));
      }
    }

    // Fetch recent post
    try {
      const recentPostRes = await fetch(
        `/api/data/facebook/recentPost?platform=${platform.toLowerCase()}&pageId=${pageId}`
      );
      
      if (recentPostRes.ok) {
        const recentPost = await recentPostRes.json();
        dispatch(updateRecentPost(recentPost));
      }
    } catch (error) {
      console.error("[Facebook Progressive] Failed to fetch recent post:", error);
    }
  }
);

// Thunk for fetching Facebook posts
export const fetchFacebookPosts = createAsyncThunk<
  PostsResponse,
  {
    pageId: string;
    platform: string;
    since?: string;
    until?: string;
    datePreset?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "facebook/fetchPosts",
  async (
    { pageId, platform, since = "", until = "", datePreset = "" },
    { dispatch, getState }
  ) => {
    let state = getState();

    if (
      state.integrations.integrations.length === 0 &&
      state.integrations.loading !== true
    ) {
      const companyId = state.company?.id;
      if (companyId) {
        await dispatch(fetchIntegrations(companyId));
        state = getState();
      } else {
        console.error("❌ No company ID found in state");
        throw new Error("Company ID not found");
      }
    }

    const facebookIntegration = state.integrations.integrations.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!facebookIntegration) throw new Error("No Facebook integration found");

    const accessToken = facebookIntegration.accessToken;

    const res = await fetch(
      `/api/data/facebook/posts?platform=${platform.toLowerCase()}&pageId=${pageId}&since=${since}&until=${until}&date_preset=${datePreset}&limit=100`
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch Facebook posts: ${errText}`);
    }

    return await res.json();
  }
);

const facebookSlice = createSlice({
  name: "facebook",
  initialState,
  reducers: {
    // Progressive update actions
    initializeProgressiveFacebookStats: (state, action) => {
      const { pageId, platform, since, until, datePreset } = action.payload;
      state.progressiveStats = {
        pageId,
        platform,
        metrics: {},
        since,
        until,
        datePreset,
        loadingMetrics: [],
        completedMetrics: []
      };
      state.statusProgressiveStats = "loading";
      state.errorProgressiveStats = null;
    },
    updatePageInfo: (state, action) => {
      if (state.progressiveStats) {
        state.progressiveStats.pageInfo = action.payload;
      }
    },
    updateFacebookUserInfo: (state, action) => {
      if (state.progressiveStats) {
        state.progressiveStats.pageInfo = action.payload;
      }
    },
    startMetricFetch: (state, action) => {
      const metric = action.payload;
      if (state.progressiveStats) {
        state.progressiveStats.loadingMetrics.push(metric);
      }
    },
    startFacebookMetricFetch: (state, action) => {
      const metric = action.payload;
      if (state.progressiveStats) {
        state.progressiveStats.loadingMetrics.push(metric);
      }
    },
    updateMetric: (state, action) => {
      const { metric, data } = action.payload;
      // console.log(`Updating metric ${metric} with data:`, data);
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
        // Add to completed
        if (!state.progressiveStats.completedMetrics.includes(metric)) {
          state.progressiveStats.completedMetrics.push(metric);
        }
        // Update metrics data
        state.progressiveStats.metrics[metric] = data;
        // console.log(`Updated progressive stats for ${metric}:`, state.progressiveStats.metrics[metric]);
      }
    },
    updateFacebookMetric: (state, action) => {
      const { metric, data } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
        // Add to completed
        if (!state.progressiveStats.completedMetrics.includes(metric)) {
          state.progressiveStats.completedMetrics.push(metric);
        }
        // Update metrics data
        state.progressiveStats.metrics[metric] = data;
      }
    },
    failMetric: (state, action) => {
      const { metric, error } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
        console.error(`Failed to fetch metric ${metric}:`, error);
      }
    },
    failFacebookMetric: (state, action) => {
      const { metric, error } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
      }
    },
    updateRecentPost: (state, action) => {
      if (state.progressiveStats) {
        state.progressiveStats.recentPost = action.payload;
      }
    },
    completeProgressiveFetch: (state) => {
      if (state.progressiveStats) {
        state.statusProgressiveStats = "succeeded";
      }
    },
    completeProgressiveFacebookFetch: (state) => {
      if (state.progressiveStats) {
        state.statusProgressiveStats = "succeeded";
      }
    },
    resetProgressiveFacebookStats: (state) => {
      state.progressiveStats = null;
      state.statusProgressiveStats = "idle";
      state.errorProgressiveStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Facebook Stats (non-progressive)
      .addCase(fetchFacebookStats.pending, (state) => {
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchFacebookStats.fulfilled, (state, action) => {
        state.statusStats = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchFacebookStats.rejected, (state, action) => {
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to load Facebook stats";
        console.error("[Facebook Reducer] Stats fetch failed:", action.error.message);
      })

      // Progressive Facebook Stats
      .addCase(fetchFacebookStatsProgressive.pending, (state) => {
        state.statusProgressiveStats = "loading";
        state.errorProgressiveStats = null;
      })
      .addCase(fetchFacebookStatsProgressive.fulfilled, (state) => {
        state.statusProgressiveStats = "succeeded";
      })
      .addCase(fetchFacebookStatsProgressive.rejected, (state, action) => {
        state.statusProgressiveStats = "failed";
        state.errorProgressiveStats = action.error.message || "Failed to load Facebook stats progressively";
        console.error("[Facebook Reducer] Progressive stats fetch failed:", action.error.message);
      })

      // Facebook Posts
      .addCase(fetchFacebookPosts.pending, (state) => {
        state.statusPosts = "loading";
        state.errorPosts = null;
      })
      .addCase(fetchFacebookPosts.fulfilled, (state, action) => {
        state.statusPosts = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchFacebookPosts.rejected, (state, action) => {
        state.statusPosts = "failed";
        state.errorPosts = action.error.message || "Failed to load Facebook posts";
        console.error("[Facebook Reducer] Posts fetch failed:", action.error.message);
      });
  },
});

// Export actions
export const {
  initializeProgressiveFacebookStats,
  updatePageInfo,
  updateFacebookUserInfo,
  startMetricFetch,
  startFacebookMetricFetch,
  updateMetric,
  updateFacebookMetric,
  failMetric,
  failFacebookMetric,
  updateRecentPost,
  completeProgressiveFetch,
  completeProgressiveFacebookFetch,
  resetProgressiveFacebookStats
} = facebookSlice.actions;

// Selectors
export const selectFacebookStats = (state: RootState) => state.facebook.stats;
export const selectFacebookPosts = (state: RootState) => state.facebook.posts;

// New progressive selectors
export const selectProgressiveFacebookStats = (state: RootState) => state.facebook.progressiveStats;
export const selectProgressiveFacebookStatus = (state: RootState) => state.facebook.statusProgressiveStats;
export const selectProgressiveFacebookError = (state: RootState) => state.facebook.errorProgressiveStats;

export const selectFacebookStatusStats = (state: RootState) =>
  state.facebook.statusStats;
export const selectFacebookStatusPosts = (state: RootState) =>
  state.facebook.statusPosts;

export const selectFacebookErrorStats = (state: RootState) => state.facebook.errorStats;
export const selectFacebookErrorPosts = (state: RootState) => state.facebook.errorPosts;

export default facebookSlice.reducer;
