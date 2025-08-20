import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "..";
import { fetchIntegrations } from "../Integrations/reducer";

interface MetaStats {
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
interface ProgressiveMetaStats {
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

interface MetaState {
  stats: MetaStats | null;
  progressiveStats: ProgressiveMetaStats | null; // New progressive stats
  posts: PostsResponse | null;
  pageName: string | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  statusProgressiveStats: "idle" | "loading" | "succeeded" | "failed"; // New status
  statusPosts: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
  errorProgressiveStats: string | null; // New error
  errorPosts: string | null;
}

const initialState: MetaState = {
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

// Thunk for fetching meta stats
export const fetchMetaStats = createAsyncThunk<
  MetaStats,
  {
    pageId: string;
    platform: string;
    since?: string;
    until?: string;
    datePreset?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "meta/fetchStats",
  async (
    { pageId, platform, since = "", until = "", datePreset = "" },
    { dispatch, getState }
  ) => {
    console.log("\n" + "=".repeat(60));
    console.log("📘 META REDUX THUNK: fetchMetaStats STARTED");
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

    const metaIntegration = state.integrations.integrations.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!metaIntegration) {
      console.error("❌ No Meta integration found in Redux state");
      console.log("Available integrations:", state.integrations.integrations.map((i: any) => ({ type: i.type, status: i.status })));
      console.log("Looking for platform:", platform.toUpperCase());
      console.log("=".repeat(60));
      throw new Error("No Meta integration found");
    }

    console.log("✅ Meta integration found:", metaIntegration.type);
    console.log("🔑 Integration status:", metaIntegration.status);
    console.log("🔑 Has access token:", !!metaIntegration.accessToken);

    const accessToken = metaIntegration.accessToken;

    const url = `/api/data/meta/stats?platform=${platform.toLowerCase()}&pageId=${pageId}&since=${since}&until=${until}&date_preset=${datePreset}&limit=100`;
    console.log("🌐 About to call Meta API endpoint:", url);
    
    try {
      const res = await fetch(url);
      console.log("📡 Meta API response status:", res.status);
      console.log("📡 Meta API response ok:", res.ok);

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Meta stats fetch failed:", errText);
        console.log("=".repeat(60));
        throw new Error(`Failed to fetch Meta stats: ${errText}`);
      }

      const result = await res.json();
      console.log("✅ Meta API response received successfully");
      console.log("📊 Response data keys:", Object.keys(result));
      console.log("📊 Page info:", result.pageInfo);
      console.log("📊 Metrics available:", Object.keys(result.metrics || {}));
      console.log("📊 Recent post:", result.recentPost ? "Available" : "None");
      
      console.log("✅ SUCCESS: Meta data fetched and ready");
      console.log("📊 Final result summary:", {
        platform: result.platform,
        pageName: result.pageInfo?.name,
        metricsCount: Object.keys(result.metrics || {}).length,
        hasRecentPost: !!result.recentPost
      });
      console.log("=".repeat(60));
      return result;
    } catch (error) {
      console.error("❌ ERROR in Meta thunk:", error);
      console.log("=".repeat(60));
      throw error;
    }
  }
);

// New progressive thunk for fetching metrics individually
export const fetchMetaStatsProgressive = createAsyncThunk<
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
  "meta/fetchStatsProgressive",
  async (
    { pageId, platform, since = "", until = "", datePreset = "" },
    { dispatch, getState }
  ) => {
    // console.log("=== fetchMetaStatsProgressive started ===");
    // console.log("pageId:", pageId);
    // console.log("platform:", platform);
    // console.log("since:", since);
    // console.log("until:", until);
    // console.log("datePreset:", datePreset);
    
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
    // console.log("Found Meta integration:", integration ? {
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
    dispatch(initializeProgressiveStats({
      pageId,
      platform,
      since,
      until,
      datePreset
    }));

    // Fetch page info first
    // console.log("Fetching page info...");
    const pageInfoRes = await fetch(
      `/api/data/meta/pageInfo?platform=${platform.toLowerCase()}&pageId=${pageId}`
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
          `/api/data/meta/metric?platform=${platform.toLowerCase()}&pageId=${pageId}&metric=${metric}&since=${since}&until=${until}&datePreset=${datePreset}`
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
        `/api/data/meta/recentPost?platform=${platform.toLowerCase()}&pageId=${pageId}`
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
    
    console.log("=== fetchMetaStatsProgressive completed ===");
  }
);

// Thunk for fetching meta posts
export const fetchMetaPosts = createAsyncThunk<
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
  "meta/fetchPosts",
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

    const metaIntegration = state.integrations.integrations.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!metaIntegration) throw new Error("No Meta integration found");

    const accessToken = metaIntegration.accessToken;

    const res = await fetch(
      `/api/data/meta/posts?platform=${platform.toLowerCase()}&pageId=${pageId}&since=${since}&until=${until}&date_preset=${datePreset}&limit=100`
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch Meta posts: ${errText}`);
    }

    return await res.json();
  }
);

const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    // Progressive update actions
    initializeProgressiveStats: (state, action) => {
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
    startMetricFetch: (state, action) => {
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
    failMetric: (state, action) => {
      const { metric, error } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
        console.error(`Failed to fetch metric ${metric}:`, error);
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Meta Stats
      .addCase(fetchMetaStats.pending, (state) => {
        console.log("🔄 Meta Reducer: fetchMetaStats.pending - Setting status to loading");
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchMetaStats.fulfilled, (state, action) => {
        console.log("✅ Meta Reducer: fetchMetaStats.fulfilled - Setting stats data");
        console.log("📊 Meta stats received:", action.payload);
        state.statusStats = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchMetaStats.rejected, (state, action) => {
        console.log("❌ Meta Reducer: fetchMetaStats.rejected - Setting error state");
        console.log("❌ Error:", action.error.message);
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to load Meta stats";
      })

      // Progressive Meta Stats
      .addCase(fetchMetaStatsProgressive.pending, (state) => {
        state.statusProgressiveStats = "loading";
        state.errorProgressiveStats = null;
      })
      .addCase(fetchMetaStatsProgressive.fulfilled, (state) => {
        state.statusProgressiveStats = "succeeded";
      })
      .addCase(fetchMetaStatsProgressive.rejected, (state, action) => {
        state.statusProgressiveStats = "failed";
        state.errorProgressiveStats = action.error.message || "Failed to load Meta stats progressively";
      })

      // Meta Posts
      .addCase(fetchMetaPosts.pending, (state) => {
        state.statusPosts = "loading";
        state.errorPosts = null;
      })
      .addCase(fetchMetaPosts.fulfilled, (state, action) => {
        state.statusPosts = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchMetaPosts.rejected, (state, action) => {
        state.statusPosts = "failed";
        state.errorPosts = action.error.message || "Failed to load Meta posts";
      });
  },
});

// Export actions
export const {
  initializeProgressiveStats,
  updatePageInfo,
  startMetricFetch,
  updateMetric,
  failMetric,
  updateRecentPost,
  completeProgressiveFetch
} = metaSlice.actions;

// Selectors
export const selectMetaStats = (state: RootState) => state.meta.stats;
export const selectMetaPosts = (state: RootState) => state.meta.posts;

// New progressive selectors
export const selectProgressiveMetaStats = (state: RootState) => state.meta.progressiveStats;
export const selectProgressiveMetaStatus = (state: RootState) => state.meta.statusProgressiveStats;
export const selectProgressiveMetaError = (state: RootState) => state.meta.errorProgressiveStats;

export const selectMetaStatusStats = (state: RootState) =>
  state.meta.statusStats;
export const selectMetaStatusPosts = (state: RootState) =>
  state.meta.statusPosts;

export const selectMetaErrorStats = (state: RootState) => state.meta.errorStats;
export const selectMetaErrorPosts = (state: RootState) => state.meta.errorPosts;

export default metaSlice.reducer;
