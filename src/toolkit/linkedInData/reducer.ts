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
    let state = getState();

    if (state.integration.items.length === 0 && state.integration.status !== "loading") {
      await dispatch(fetchIntegrations());
      state = getState();
    }

    const integration = state.integration.items.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    if (!integration) throw new Error("No LinkedIn integration found");

    const accessToken = integration.accessToken;

    // Construct URL with all query params (no access token needed - API gets it from session)
    const url = `/api/data/linkedin/stats?organizationId=${organizationId}&since=${since}&until=${until}&datePreset=${datePreset}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ LinkedIn stats fetch failed:", errText);
      throw new Error(`Failed to fetch LinkedIn stats: ${errText}`);
    }

    const json = await res.json();
    console.log("✅ LinkedIn Stats Received:", json.metrics);

    // Shape the returned metrics to match LinkedInStats interface
    return {
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

    if (state.integration.items.length === 0 && state.integration.status !== "loading") {
      await dispatch(fetchIntegrations());
      state = getState();
    }

    const integration = state.integration.items.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    if (!integration) throw new Error("No LinkedIn integration found");

    const accessToken = integration.accessToken;

    const url = `/api/data/linkedin/posts?organizationId=${organizationId}&since=${since}&until=${until}&datePreset=${datePreset}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ LinkedIn posts fetch failed:", errText);
      throw new Error(`Failed to fetch LinkedIn posts: ${errText}`);
    }

    const json = await res.json();
    console.log("✅ LinkedIn Posts Received:", json);

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
    console.log("=== 🚀 fetchLinkedInStatsProgressive started ===");
    console.log("📋 Parameters:");
    console.log("   organizationId:", organizationId);
    console.log("   platform:", platform);
    console.log("   since:", since);
    console.log("   until:", until);
    console.log("   datePreset:", datePreset);
    
    let state = getState();
    console.log("🔍 Initial state check:");
    console.log("   Integrations count:", state.integration.items.length);
    console.log("   Integration status:", state.integration.status);

    // Wait for integrations to be loaded if they're not already
    if (state.integration.items.length === 0 && state.integration.status !== "loading") {
      console.log("📥 No integrations found, fetching integrations...");
      await dispatch(fetchIntegrations());
      state = getState();
      console.log("✅ Integrations fetched, new count:", state.integration.items.length);
    }

    // Wait for integrations to finish loading if they're currently loading
    if (state.integration.status === "loading") {
      console.log("⏳ Waiting for integrations to finish loading...");
      // Wait for the integration status to change from loading
      while (state.integration.status === "loading") {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        state = getState();
      }
      console.log("✅ Integrations finished loading, status:", state.integration.status);
    }

    // Check if integrations loaded successfully
    if (state.integration.status === "failed") {
      console.error("❌ Failed to load integrations:", state.integration.error);
      throw new Error("Failed to load integrations");
    }

    if (state.integration.items.length === 0) {
      console.error("❌ No integrations found after loading");
      throw new Error("No integrations found");
    }

    const integration = state.integration.items.find(
      (integration: { type: string }) => integration.type === platform.toUpperCase()
    );

    console.log("🔍 Integration details:");
    console.log("   Available integrations:", state.integration.items.map((i: any) => ({
      id: i.id,
      type: i.type,
      accessToken: i.accessToken ? `${i.accessToken.substring(0, 20)}...` : 'NO_TOKEN'
    })));
    console.log("   Looking for integration with type:", platform.toUpperCase());
    console.log("   Found LinkedIn integration:", integration ? {
      id: integration.id,
      type: integration.type,
      accessToken: integration.accessToken ? `${integration.accessToken.substring(0, 20)}...` : 'NO_TOKEN'
    } : 'NOT_FOUND');

    if (!integration) {
      console.error("❌ No LinkedIn integration found");
      throw new Error("No LinkedIn integration found");
    }

    console.log("✅ Access token found, initializing progressive stats...");

    // Initialize progressive stats
    dispatch(linkedinSlice.actions.initializeProgressiveLinkedInStats({
      organizationId,
      platform,
      since,
      until,
      datePreset,
      loadingMetrics: ["organizationInfo", "followers", "impressions", "clicks", "engagement"]
    }));

    console.log("📊 Progressive stats initialized, starting individual fetches...");

    // Fetch organization info first
    console.log("🏢 Fetching organization info...");
    dispatch(linkedinSlice.actions.startLinkedInMetricFetch("organizationInfo"));
    
    try {
      const orgInfoUrl = `/api/data/linkedin/organizationInfo?organizationId=${organizationId}`;
      console.log("🌐 Organization info URL:", orgInfoUrl);
      const orgInfoRes = await fetch(orgInfoUrl);
      console.log("📡 Organization info response status:", orgInfoRes.status);
      
      if (orgInfoRes.ok) {
        const orgInfo = await orgInfoRes.json();
        console.log("✅ Organization info received:", orgInfo);
        console.log("   Organization name:", orgInfo.localizedName || orgInfo.name);
        console.log("   Organization ID:", orgInfo.id);
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

    console.log("📈 Starting to fetch LinkedIn metrics:", metricList);

    // Fetch each metric individually
    for (const metric of metricList) {
      try {
        console.log(`\n🔄 Starting to fetch LinkedIn metric: ${metric}`);
        dispatch(linkedinSlice.actions.startLinkedInMetricFetch(metric));
        
        const metricUrl = `/api/data/linkedin/metric?organizationId=${organizationId}&metric=${metric}&since=${since}&until=${until}&datePreset=${datePreset}`;
        console.log(`🌐 Metric ${metric} URL:`, metricUrl);
        
        const res = await fetch(metricUrl);
        console.log(`📡 Metric ${metric} response status:`, res.status);

        if (res.ok) {
          const metricData = await res.json();
          console.log(`✅ LinkedIn metric ${metric} received:`, metricData);
          console.log(`   Data type:`, typeof metricData);
          console.log(`   Data keys:`, Object.keys(metricData || {}));
          
          // Log specific data for each metric type
          switch (metric) {
            case "followers":
              console.log(`   📊 Followers count:`, metricData.followers);
              break;
            case "impressions":
              console.log(`   👁️ Impression count:`, metricData.impressionCount);
              console.log(`   👁️ Unique impressions:`, metricData.uniqueImpressionsCount);
              break;
            case "clicks":
              console.log(`   🖱️ Click count:`, metricData.clickCount);
              break;
            case "engagement":
              console.log(`   ❤️ Engagement:`, metricData.engagement);
              console.log(`   👍 Like count:`, metricData.likeCount);
              console.log(`   💬 Comment count:`, metricData.commentCount);
              console.log(`   🔄 Share count:`, metricData.shareCount);
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
    
    console.log("\n=== 🎉 fetchLinkedInStatsProgressive completed ===");
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
      console.log("🏗️ Initializing progressive LinkedIn stats with payload:", action.payload);
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
      console.log("✅ Initialized progressive LinkedIn stats:", state.progressiveStats);
    },
    updateLinkedInOrgInfo: (state, action) => {
      console.log("🏢 Updating LinkedIn organization info:", action.payload);
      if (state.progressiveStats) {
        const oldName = state.progressiveStats.organizationName;
        state.progressiveStats.organizationName = action.payload.localizedName || action.payload.name || "Unknown";
        console.log(`   Organization name updated: "${oldName}" → "${state.progressiveStats.organizationName}"`);
      }
    },
    startLinkedInMetricFetch: (state, action) => {
      const metric = action.payload;
      console.log(`🔄 Starting fetch for LinkedIn metric: ${metric}`);
      if (state.progressiveStats) {
        state.progressiveStats.loadingMetrics.push(metric);
        console.log(`   Loading metrics: [${state.progressiveStats.loadingMetrics.join(', ')}]`);
      }
    },
    updateLinkedInMetric: (state, action) => {
      const { metric, data } = action.payload;
      console.log(`🔄 Updating LinkedIn metric ${metric} with data:`, data);
      console.log(`   Data type:`, typeof data);
      console.log(`   Data keys:`, Object.keys(data || {}));
      
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
            console.log(`   Setting followers to:`, data.followers);
            state.progressiveStats.followers = data.followers || null;
            break;
          case "impressions":
            console.log(`   Setting impressionCount to:`, data.impressionCount);
            console.log(`   Setting uniqueImpressionsCount to:`, data.uniqueImpressionsCount);
            state.progressiveStats.impressionCount = data.impressionCount || 0;
            state.progressiveStats.uniqueImpressionsCount = data.uniqueImpressionsCount || 0;
            break;
          case "clicks":
            console.log(`   Setting clickCount to:`, data.clickCount);
            state.progressiveStats.clickCount = data.clickCount || 0;
            break;
          case "engagement":
            console.log(`   Setting engagement to:`, data.engagement);
            console.log(`   Setting likeCount to:`, data.likeCount);
            console.log(`   Setting commentCount to:`, data.commentCount);
            console.log(`   Setting shareCount to:`, data.shareCount);
            state.progressiveStats.engagement = data.engagement || 0;
            state.progressiveStats.likeCount = data.likeCount || 0;
            state.progressiveStats.commentCount = data.commentCount || 0;
            state.progressiveStats.shareCount = data.shareCount || 0;
            break;
        }
        console.log(`✅ Updated progressive LinkedIn stats for ${metric}:`, {
          followers: state.progressiveStats.followers,
          impressionCount: state.progressiveStats.impressionCount,
          clickCount: state.progressiveStats.clickCount,
          engagement: state.progressiveStats.engagement,
          completedMetrics: state.progressiveStats.completedMetrics,
          loadingMetrics: state.progressiveStats.loadingMetrics
        });
      }
    },
    failLinkedInMetric: (state, action) => {
      const { metric, error } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
        console.error(`Failed to fetch LinkedIn metric ${metric}:`, error);
      }
    },
    completeProgressiveLinkedInFetch: (state) => {
      console.log("🎯 Completing progressive LinkedIn fetch");
      if (state.progressiveStats) {
        state.statusProgressiveStats = "succeeded";
        console.log("📊 Final progressive LinkedIn stats state:");
        console.log("   Organization:", state.progressiveStats.organizationName);
        console.log("   Followers:", state.progressiveStats.followers);
        console.log("   Impressions:", state.progressiveStats.impressionCount);
        console.log("   Clicks:", state.progressiveStats.clickCount);
        console.log("   Engagement:", state.progressiveStats.engagement);
        console.log("   Completed metrics:", state.progressiveStats.completedMetrics);
        console.log("   Loading metrics:", state.progressiveStats.loadingMetrics);
      }
    },
    resetProgressiveLinkedInStats: (state) => {
      console.log("🔄 Resetting progressive LinkedIn stats");
      state.progressiveStats = null;
      state.statusProgressiveStats = "idle";
      state.errorProgressiveStats = null;
      console.log("✅ Progressive LinkedIn stats reset complete");
    }
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchLinkedInStats.pending, (state) => {
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchLinkedInStats.fulfilled, (state, action) => {
        state.statusStats = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchLinkedInStats.rejected, (state, action) => {
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
