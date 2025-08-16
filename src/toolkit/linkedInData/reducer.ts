import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "..";
import { fetchIntegrations } from "../Integrations/reducer";

// --- Interfaces ---
interface LinkedInStats {
  organizationId: string;
  organizationName: string;
  followers: number | null;
  impressionCount: number;
  uniqueImpressionsCount: number;
  clickCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  shareMentionsCount: number;
  commentMentionsCount: number;
  engagement: number;
  since: string;
  until: string;
  datePreset: string;
  [key: string]: any;
}

// New interface for progressive LinkedIn updates
interface ProgressiveLinkedInStats {
  organizationId: string;
  organizationName?: string;
  platform?: string;
  followers?: number | null;
  impressionCount?: number;
  uniqueImpressionsCount?: number;
  clickCount?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  shareMentionsCount?: number;
  commentMentionsCount?: number;
  engagement?: number;
  since: string;
  until: string;
  datePreset: string;
  loadingMetrics: string[]; // Track which metrics are still loading
  completedMetrics: string[]; // Track which metrics are completed
}

interface LinkedInPost {
  id: string;
  text?: string;
  created_time: string;
}

interface LinkedInPostsResponse {
  organizationInfo: { name: string; id: string };
  platform: string;
  posts: LinkedInPost[];
}

interface LinkedInState {
  stats: LinkedInStats | null;
  progressiveStats: ProgressiveLinkedInStats | null; // New progressive stats
  posts: LinkedInPostsResponse | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  statusProgressiveStats: "idle" | "loading" | "succeeded" | "failed"; // New status
  statusPosts: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
  errorProgressiveStats: string | null; // New error
  errorPosts: string | null;
}

// --- Initial State ---
const initialState: LinkedInState = {
  stats: null,
  progressiveStats: null,
  posts: null,
  statusStats: "idle",
  statusProgressiveStats: "idle",
  statusPosts: "idle",
  errorStats: null,
  errorProgressiveStats: null,
  errorPosts: null,
};

// --- Thunks ---
export const fetchLinkedInStats = createAsyncThunk<
  LinkedInStats,
  { organizationId: string; platform: string; since?: string; until?: string; datePreset?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "linkedin/fetchStats",
  async ({ organizationId, platform, since = "", until = "", datePreset = "" }, { dispatch, getState }) => {
    console.log("\n" + "=".repeat(60));
    console.log("🔗 LINKEDIN REDUX THUNK: fetchLinkedInStats STARTED");
    console.log("=".repeat(60));
    console.log("📅 Timestamp:", new Date().toISOString());
    console.log("📋 Parameters:", { organizationId, platform, since, until, datePreset });
    
    let state = getState();
    console.log("Current Redux state - integrations count:", state.integrations.integrations.length);
    console.log("Current Redux state - integration status:", state.integrations.loading);

    if (state.integrations.integrations.length === 0 && state.integrations.loading !== true) {
      console.log("No integrations in state, fetching integrations...");
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

    const integration = state.integrations.integrations.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    if (!integration) {
      console.error("❌ No LinkedIn integration found in Redux state");
      console.log("Available integrations:", state.integrations.integrations.map((i: any) => ({ type: i.type, status: i.status })));
      console.log("=".repeat(60));
      throw new Error("No LinkedIn integration found");
    }

    console.log("✅ LinkedIn integration found:", integration.type);
    console.log("🔑 Integration status:", integration.status);
    console.log("🔑 Has access token:", !!integration.accessToken);

    const accessToken = integration.accessToken;

    // Construct URL with all query params (no access token needed - API gets it from session)
    const url = `/api/data/linkedin/stats?organizationId=${organizationId}&since=${since}&until=${until}&datePreset=${datePreset}`;
    console.log("🌐 About to call LinkedIn API endpoint:", url);
    
    try {
      const res = await fetch(url);
      console.log("📡 LinkedIn API response status:", res.status);
      console.log("📡 LinkedIn API response ok:", res.ok);

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ LinkedIn stats fetch failed:", errText);
        console.log("=".repeat(60));
        throw new Error(`Failed to fetch LinkedIn stats: ${errText}`);
      }

      const json = await res.json();  
      console.log("✅ LinkedIn API response received successfully");
      console.log("📊 Response data keys:", Object.keys(json));
      console.log("📊 Organization info:", json.organizationInfo);
      console.log("📊 Metrics available:", Object.keys(json.metrics || {}));

      // Shape the returned metrics to match LinkedInStats interface
      const result = {
        organizationId,
        organizationName: json.organizationInfo?.name || "Unknown Company",
        followers: json.metrics.page_follows
          ? parseInt(json.metrics.page_follows.replace(/[^0-9]/g, ""), 10)
          : null,
        impressionCount: json.metrics.impressions?.impressionCount || 0,
        uniqueImpressionsCount: json.metrics.impressions?.uniqueImpressionsCount || 0,
        clickCount: json.metrics.impressions?.clickCount || 0,
        likeCount: json.metrics.impressions?.likeCount || 0,
        commentCount: json.metrics.impressions?.commentCount || 0,
        shareCount: json.metrics.impressions?.shareCount || 0,
        shareMentionsCount: json.metrics.impressions?.shareMentionsCount || 0,
        commentMentionsCount: json.metrics.impressions?.commentMentionsCount || 0,
        engagement: json.metrics.impressions?.engagement || 0,
        since,
        until,
        datePreset,
      };
      
      console.log("✅ SUCCESS: LinkedIn data transformed and ready");
      console.log("📊 Final result:", result);
      console.log("=".repeat(60));
      return result;
    } catch (error) {
      console.error("❌ ERROR in LinkedIn thunk:", error);
      console.log("=".repeat(60));
      throw error;
    }
  }
);

export const fetchLinkedInPosts = createAsyncThunk<
  LinkedInPostsResponse,
  { organizationId: string; platform: string; since?: string; until?: string; datePreset?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "linkedin/fetchPosts",
  async ({ organizationId, platform, since = "", until = "", datePreset = "" }, { dispatch, getState }) => {
    let state = getState();

    if (state.integrations.integrations.length === 0 && state.integrations.loading !== true) {
      const companyId = state.company?.id;
      if (companyId) {
        await dispatch(fetchIntegrations(companyId));
        state = getState();
      } else {
        console.error("❌ No company ID found in state");
        throw new Error("Company ID not found");
      }
    }

    const integration = state.integrations.integrations.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    if (!integration) throw new Error("No LinkedIn integration found");

    const url = `/api/data/linkedin/posts?organizationId=${organizationId}&since=${since}&until=${until}&datePreset=${datePreset}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ LinkedIn posts fetch failed:", errText);
      throw new Error(`Failed to fetch LinkedIn posts: ${errText}`);
    }

    const json = await res.json();
    
    return json;
  }
);

// New progressive thunk for fetching LinkedIn stats individually
export const fetchLinkedInStatsProgressive = createAsyncThunk<
  void,
  { organizationId: string; platform: string; since?: string; until?: string; datePreset?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "linkedin/fetchLinkedInStatsProgressive",
  async ({ organizationId, platform, since = "", until = "", datePreset = "" }, { dispatch, getState }) => {
    
    
    let state = getState();

    // Wait for integrations to be loaded if they're not already
    if (state.integrations.integrations.length === 0 && state.integrations.loading !== true) {
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
      console.log("⏳ Waiting for integrations to finish loading...");
      // Wait for the integration status to change from loading
      while (state.integrations.loading === true) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        state = getState();
      }
    }

    // Check if integrations loaded successfully
    if (state.integrations.error) {
      console.error("❌ Failed to load integrations:", state.integrations.error);
      throw new Error("Failed to load integrations");
    }

    if (state.integrations.integrations.length === 0) {
      console.error("❌ No integrations found after loading");
      throw new Error("No integrations found");
    }

    const integration = state.integrations.integrations.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    

    if (!integration) {
      console.error("❌ No LinkedIn integration found");
      throw new Error("No LinkedIn integration found");
    }



    // Initialize progressive stats
    dispatch(linkedinSlice.actions.initializeProgressiveLinkedInStats({
      organizationId,
      platform,
      since,
      until,
      datePreset,
      loadingMetrics: ["organizationInfo", "followers", "impressions", "clicks", "engagement"]
    }));



    // Fetch organization info first
    dispatch(linkedinSlice.actions.startLinkedInMetricFetch("organizationInfo"));
    
    try {
      const orgInfoUrl = `/api/data/linkedin/organizationInfo?organizationId=${organizationId}`;
      const orgInfoRes = await fetch(orgInfoUrl);
      
      if (orgInfoRes.ok) {
        const orgInfo = await orgInfoRes.json();
        dispatch(linkedinSlice.actions.updateLinkedInOrgInfo(orgInfo));
      } else {
        const errorText = await orgInfoRes.text();
        console.error("❌ Failed to fetch organization info:", orgInfoRes.statusText, errorText);
        dispatch(linkedinSlice.actions.failLinkedInMetric({ metric: "organizationInfo", error: orgInfoRes.statusText }));
      }
    } catch (error) {
      console.error("💥 Error fetching organization info:", error);
      dispatch(linkedinSlice.actions.failLinkedInMetric({ 
        metric: "organizationInfo", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }

    // Define LinkedIn metrics to fetch
    const metricList = [
      "followers",
      "impressions", 
      "clicks",
      "engagement"
    ];

    // Fetch each metric individually
    for (const metric of metricList) {
      try {
        dispatch(linkedinSlice.actions.startLinkedInMetricFetch(metric));
        
        const metricUrl = `/api/data/linkedin/metric?organizationId=${organizationId}&metric=${metric}&since=${since}&until=${until}&datePreset=${datePreset}`;
        
        const res = await fetch(metricUrl);

        if (res.ok) {
          const metricData = await res.json();
          
          // Log specific data for each metric type
          switch (metric) {
            case "followers":
              break;
            case "impressions":
              break;
            case "clicks":
              break;
            case "engagement":
              break;
          }
          
          dispatch(linkedinSlice.actions.updateLinkedInMetric({ metric, data: metricData }));
        } else {
          const errorText = await res.text();
          console.error(`❌ Failed to fetch LinkedIn metric ${metric}:`, res.statusText, errorText);
          dispatch(linkedinSlice.actions.failLinkedInMetric({ metric, error: `Failed to fetch ${metric}` }));
        }
      } catch (error) {
        console.error(`💥 Error fetching LinkedIn metric ${metric}:`, error);
        dispatch(linkedinSlice.actions.failLinkedInMetric({ metric, error: error instanceof Error ? error.message : 'Unknown error' }));
      }
    }
    dispatch(linkedinSlice.actions.completeProgressiveLinkedInFetch());
  }
);

// --- Slice ---
const linkedinSlice = createSlice({
  name: "linkedin",
  initialState,
  reducers: {
    // Progressive update actions
    initializeProgressiveLinkedInStats: (state, action) => {
      const { organizationId, platform, since, until, datePreset, loadingMetrics } = action.payload;
      state.progressiveStats = {
        organizationId,
        platform,
        since,
        until,
        datePreset,
        loadingMetrics: loadingMetrics || [],
        completedMetrics: []
      };
      state.statusProgressiveStats = "loading";
      state.errorProgressiveStats = null;
    },
    updateLinkedInOrgInfo: (state, action) => {
      if (state.progressiveStats) {
        const oldName = state.progressiveStats.organizationName;
        state.progressiveStats.organizationName = action.payload.localizedName || action.payload.name || "Unknown";
      }
    },
    startLinkedInMetricFetch: (state, action) => {
      const metric = action.payload;
      if (state.progressiveStats) {
        state.progressiveStats.loadingMetrics.push(metric);
      }
    },
    updateLinkedInMetric: (state, action) => {
      const { metric, data } = action.payload;
      
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
        // Add to completed
        if (!state.progressiveStats.completedMetrics.includes(metric)) {
          state.progressiveStats.completedMetrics.push(metric);
        }
        // Update metrics data
        switch (metric) {
          case "followers":
            state.progressiveStats.followers = data.followers || null;
            break;
          case "impressions":
            state.progressiveStats.impressionCount = data.impressionCount || 0;
            state.progressiveStats.uniqueImpressionsCount = data.uniqueImpressionsCount || 0;
            break;
          case "clicks":
            state.progressiveStats.clickCount = data.clickCount || 0;
            break;
          case "engagement":
            state.progressiveStats.engagement = data.engagement || 0;
            state.progressiveStats.likeCount = data.likeCount || 0;
            state.progressiveStats.commentCount = data.commentCount || 0;
            state.progressiveStats.shareCount = data.shareCount || 0;
            break;
        }
      }
    },
    failLinkedInMetric: (state, action) => {
      const { metric, error } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
      }
    },
    completeProgressiveLinkedInFetch: (state) => {
      if (state.progressiveStats) {
        state.statusProgressiveStats = "succeeded";
      }
    },
    resetProgressiveLinkedInStats: (state) => {
      state.progressiveStats = null;
      state.statusProgressiveStats = "idle";
      state.errorProgressiveStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchLinkedInStats.pending, (state) => {
        console.log("🔄 LinkedIn Reducer: fetchLinkedInStats.pending - Setting status to loading");
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchLinkedInStats.fulfilled, (state, action) => {
        console.log("✅ LinkedIn Reducer: fetchLinkedInStats.fulfilled - Setting stats data");
        console.log("📊 LinkedIn stats received:", action.payload);
        state.statusStats = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchLinkedInStats.rejected, (state, action) => {
        console.log("❌ LinkedIn Reducer: fetchLinkedInStats.rejected - Setting error state");
        console.log("❌ Error:", action.error.message);
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to load LinkedIn stats";
      })

      // Progressive LinkedIn Stats
      .addCase(fetchLinkedInStatsProgressive.pending, (state) => {
        state.statusProgressiveStats = "loading";
        state.errorProgressiveStats = null;
      })
      .addCase(fetchLinkedInStatsProgressive.fulfilled, (state) => {
        state.statusProgressiveStats = "succeeded";
      })
      .addCase(fetchLinkedInStatsProgressive.rejected, (state, action) => {
        state.statusProgressiveStats = "failed";
        state.errorProgressiveStats = action.error.message || "Failed to load LinkedIn stats progressively";
      })

      // Posts
      .addCase(fetchLinkedInPosts.pending, (state) => {
        state.statusPosts = "loading";
        state.errorPosts = null;
      })
      .addCase(fetchLinkedInPosts.fulfilled, (state, action) => {
        state.statusPosts = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchLinkedInPosts.rejected, (state, action) => {
        state.statusPosts = "failed";
        state.errorPosts = action.error.message || "Failed to load LinkedIn posts";
      });
  },
});

// Export actions
export const {
  initializeProgressiveLinkedInStats,
  updateLinkedInOrgInfo,
  startLinkedInMetricFetch,
  updateLinkedInMetric,
  failLinkedInMetric,
  completeProgressiveLinkedInFetch,
  resetProgressiveLinkedInStats
} = linkedinSlice.actions;

// --- Selectors ---
export const selectLinkedInStats = (state: RootState) => state.linkedin.stats;
export const selectLinkedInPosts = (state: RootState) => state.linkedin.posts;

// New progressive selectors
export const selectProgressiveLinkedInStats = (state: RootState) => state.linkedin.progressiveStats;
export const selectProgressiveLinkedInStatus = (state: RootState) => state.linkedin.statusProgressiveStats;
export const selectProgressiveLinkedInError = (state: RootState) => state.linkedin.errorProgressiveStats;

export const selectLinkedInStatusStats = (state: RootState) => state.linkedin.statusStats;
export const selectLinkedInStatusPosts = (state: RootState) => state.linkedin.statusPosts;
export const selectLinkedInErrorStats = (state: RootState) => state.linkedin.errorStats;
export const selectLinkedInErrorPosts = (state: RootState) => state.linkedin.errorPosts;

// --- Reducer ---
export default linkedinSlice.reducer;
