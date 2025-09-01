import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "..";
import { fetchIntegrations } from "../Integrations/reducer";

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

// New interface for progressive updates
interface ProgressiveFacebookStats {
  pageId: string;
  pageInfo?: { name: string; id: string };
  platform?: string;
  metrics: {
    [metricName: string]: {
      [period: string]: {
        values: Array<{ value: number; endTime: string | null }>;
        title: string;
        description: string;
      };
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
  stats: FacebookStats | null;
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

// Thunk for fetching Facebook stats
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
    { pageId, platform, since = "", until = "", datePreset = "" },
    { dispatch, getState }
  ) => {
    console.log("\n" + "=".repeat(60));
    console.log("📘 FACEBOOK REDUX THUNK: fetchFacebookStats STARTED");
    console.log("=".repeat(60));
    console.log("📅 Timestamp:", new Date().toISOString());
    console.log("📋 Parameters:", { pageId, platform, since, until, datePreset });
    
    let state = getState();
    console.log("Current Redux state - integrations count:", state.integrations.integrations.length);
    console.log("Current Redux state - integration status:", state.integrations.loading);



    if (
      state.integrations.integrations.length === 0 &&
      state.integrations.loading !== true
    ) {
      console.log("No integrations in state, fetching integrations...");
      // Get company ID from company state
      const companyId = state.company?.id;
      if (companyId) {
        await dispatch(fetchIntegrations(companyId));
        state = getState();
        console.log("After fetching integrations - count:", state.integrations.integrations.length);
      } else {
        console.error("❌ No company ID found in state");
        throw new Error("Company ID not found");
      }
    }

    const facebookIntegration = state.integrations.integrations.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!facebookIntegration) {
      console.error("❌ No Facebook integration found in Redux state");
      console.log("Available integrations:", state.integrations.integrations.map((i: any) => ({ type: i.type, status: i.status })));
      console.log("Looking for platform:", platform.toUpperCase());
      console.log("=".repeat(60));
      throw new Error("No Facebook integration found");
    }

    console.log("✅ Facebook integration found:", facebookIntegration.type);
    console.log("🔑 Integration status:", facebookIntegration.status);
    console.log("🔑 Has access token:", !!facebookIntegration.accessToken);

    const accessToken = facebookIntegration.accessToken;

    const url = `/api/data/facebook/stats?platform=${platform.toLowerCase()}&pageId=${pageId}&since=${since}&until=${until}&date_preset=${datePreset}&limit=100`;
    console.log("🌐 About to call Facebook API endpoint:", url);
    
    try {
      const res = await fetch(url);
      console.log("📡 Facebook API response status:", res.status);
      console.log("📡 Facebook API response ok:", res.ok);

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Facebook stats fetch failed:", errText);
        console.log("=".repeat(60));
        throw new Error(`Failed to fetch Facebook stats: ${errText}`);
      }

      const result = await res.json();
      console.log("✅ Facebook API response received successfully");
      console.log("📊 Response data keys:", Object.keys(result));
      console.log("📊 Page info:", result.pageInfo);
      console.log("📊 Metrics available:", Object.keys(result.metrics || {}));
      console.log("📊 Recent post:", result.recentPost ? "Available" : "None");
      
      console.log("✅ SUCCESS: Facebook data fetched and ready");
      console.log("📊 Final result summary:", {
        platform: result.platform,
        pageName: result.pageInfo?.name,
        metricsCount: Object.keys(result.metrics || {}).length,
        hasRecentPost: !!result.recentPost
      });
      console.log("=".repeat(60));
      return result;
    } catch (error) {
      console.error("❌ ERROR in Facebook thunk:", error);
      console.log("=".repeat(60));
      throw error;
    }
  }
);

// New progressive thunk for fetching metrics individually
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
    { pageId, platform, since = "", until = "", datePreset = "" },
    { dispatch, getState }
  ) => {
    let state = getState();

    // Wait for integrations to be loaded if they're not already
    if (
      state.integrations.integrations.length === 0 &&
      state.integrations.loading !== true
    ) {
      // console.log("No integrations found, fetching integrations...");
      const companyId = state.company?.id;
      if (companyId) {
        await dispatch(fetchIntegrations(companyId));
        state = getState();
      } else {
        console.error("❌ No company ID found in state");
        throw new Error("Company ID not found");
      }
    }

    // Wait for integrations to finish loading if they're currently loading
    if (state.integrations.loading === true) {
      console.log("Waiting for integrations to finish loading...");
      // Wait for the integration status to change from loading
      while (state.integrations.loading === true) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        state = getState();
      }
      console.log("Integrations finished loading, status:", state.integrations.loading);
    }

    // Check if integrations loaded successfully
    if (state.integrations.error) {
      console.error("Failed to load integrations:", state.integrations.error);
      throw new Error("Failed to load integrations");
    }

    if (state.integrations.integrations.length === 0) {
      console.error("No integrations found after loading");
      throw new Error("No integrations found");
    }

    const integration = state.integrations.integrations.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    // console.log("Available integrations:", state.integration.items.map((i: any) => ({
    //   id: i.id,
    //   type: i.type,
    //   accessToken: i.accessToken ? `${i.accessToken.substring(0, 20)}...` : 'NO_TOKEN'
    // })));
    // console.log("Looking for integration with type:", platform.toUpperCase());
    // console.log("Found Facebook integration:", integration ? {
    //   id: integration.id,
    //   type: integration.type,
    //   accessToken: integration.accessToken ? `${integration.accessToken.substring(0, 20)}...` : 'NO_TOKEN'
    // } : 'NOT_FOUND');

    // Get company ID from state
    const companyId = state.company.data?.id;
    if (!companyId) {
      console.error("No company ID found in state");
      throw new Error("Company ID not found");
    }

    // Check if we have a Facebook integration
    const facebookIntegration = state.integrations.integrations.find(
      (integration: { type: string }) => integration.type === 'FACEBOOK'
    );
    
    if (!facebookIntegration) {
      console.error("No Facebook integration found for company:", companyId);
      throw new Error("Facebook integration not found");
    }

    const accessToken = facebookIntegration.accessToken;
    if (!accessToken) {
      console.error("Facebook access token not found in integration");
      throw new Error("Facebook access token not found");
    }

    console.log("Using Facebook access token from database integration");

    // Initialize progressive stats
    console.log("Initializing progressive stats...");
            dispatch(initializeProgressiveFacebookStats({
      pageId,
      platform,
      since,
      until,
      datePreset
    }));

    // Fetch page info first
    // console.log("Fetching page info...");
    const pageInfoRes = await fetch(
      `/api/data/facebook/pageInfo?platform=${platform.toLowerCase()}&pageId=${pageId}`
    );
    
    if (pageInfoRes.ok) {
      const pageInfo = await pageInfoRes.json();
      console.log("Page info received:", pageInfo);
      dispatch(updatePageInfo(pageInfo));
    } else {
      console.error("Failed to fetch page info:", pageInfoRes.statusText);
    }

    // Define metrics to fetch
    const metricList = [
      "page_fans",
      "page_follows", 
      "page_impressions",
      "page_post_engagements",
      "page_total_actions"
    ];

    // console.log("Starting to fetch metrics:", metricList);

    // Fetch each metric individually
    for (const metric of metricList) {
      try {
        console.log(`Starting to fetch metric: ${metric}`);
        dispatch(startMetricFetch(metric));
        
        const res = await fetch(
          `/api/data/facebook/metric?platform=${platform.toLowerCase()}&pageId=${pageId}&metric=${metric}&since=${since}&until=${until}&datePreset=${datePreset}`
        );

        if (res.ok) {
          const metricData = await res.json();
          console.log(`Metric ${metric} received:`, metricData);
          dispatch(updateMetric({ metric, data: metricData }));
        } else {
          console.error(`Failed to fetch metric ${metric}:`, res.statusText);
          dispatch(failMetric({ metric, error: `Failed to fetch ${metric}` }));
        }
      } catch (error) {
        console.error(`Error fetching metric ${metric}:`, error);
        dispatch(failMetric({ metric, error: error instanceof Error ? error.message : 'Unknown error' }));
      }
    }

    // Fetch recent post
    try {
      // console.log("Fetching recent post...");
      const recentPostRes = await fetch(
        `/api/data/facebook/recentPost?platform=${platform.toLowerCase()}&pageId=${pageId}`
      );
      
      if (recentPostRes.ok) {
        const recentPost = await recentPostRes.json();
        // console.log("Recent post received:", recentPost);
        dispatch(updateRecentPost(recentPost));
      } else {
        console.error("Failed to fetch recent post:", recentPostRes.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch recent post:", error);
    }
    
    console.log("=== fetchFacebookStatsProgressive completed ===");
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
      // Facebook Stats
      .addCase(fetchFacebookStats.pending, (state) => {
        console.log("🔄 Facebook Reducer: fetchFacebookStats.pending - Setting status to loading");
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchFacebookStats.fulfilled, (state, action) => {
        console.log("✅ Facebook Reducer: fetchFacebookStats.fulfilled - Setting stats data");
        console.log("📊 Facebook stats received:", action.payload);
        state.statusStats = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchFacebookStats.rejected, (state, action) => {
        console.log("❌ Facebook Reducer: fetchFacebookStats.rejected - Setting error state");
        console.log("❌ Error:", action.error.message);
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to load Facebook stats";
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
