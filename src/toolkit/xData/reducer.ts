import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "..";
import { fetchIntegrations } from "../Integrations/reducer";

// --- Interfaces ---
interface XStats {
  username: string;
  userId: string;
  name: string;
  description: string;
  profileImageUrl: string;
  verified: boolean;
  followers: number;
  following: number;
  tweetCount: number;
  listedCount: number;
  likeCount: number;
  mediaCount: number;
  since: string;
  until: string;
  datePreset: string;
  [key: string]: any;
}

// New interface for progressive X updates
interface ProgressiveXStats {
  username: string;
  userId?: string;
  name?: string;
  description?: string;
  profileImageUrl?: string;
  verified?: boolean;
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
  since: string;
  until: string;
  datePreset: string;
  loadingMetrics: string[]; // Track which metrics are still loading
  completedMetrics: string[]; // Track which metrics are completed
}

interface XPost {
  id: string;
  text?: string;
  created_at: string;
}

interface XPostsResponse {
  userInfo: { name: string; username: string; id: string };
  platform: string;
  posts: XPost[];
}

interface XState {
  stats: XStats | null;
  progressiveStats: ProgressiveXStats | null;
  posts: XPostsResponse | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  statusProgressiveStats: "idle" | "loading" | "succeeded" | "failed";
  statusPosts: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
  errorProgressiveStats: string | null;
  errorPosts: string | null;
}

// --- Initial State ---
const initialState: XState = {
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
export const fetchXStats = createAsyncThunk<
  XStats,
  { username: string; platform: string; since?: string; until?: string; datePreset?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "x/fetchStats",
  async ({ username, platform, since = "", until = "", datePreset = "" }, { dispatch, getState }) => {
    console.log("\n" + "=".repeat(60));
    console.log("🐦 X REDUX THUNK: fetchXStats STARTED");
    console.log("=".repeat(60));
    console.log("📅 Timestamp:", new Date().toISOString());
    console.log("📋 Parameters:", { username, platform, since, until, datePreset });
    
    let state = getState();
    console.log("Current Redux state - integrations count:", state.integrations.integrations.length);
    console.log("Current Redux state - integration status:", state.integrations.loading);

    try {
      // Fetch X user data from the correct endpoint
      const url = `/api/data/x/stats?username=${username}&platform=${platform}&since=${since}&until=${until}&date_preset=${datePreset}`;
      console.log("🌐 About to call X API endpoint:", url);
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch X stats: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ X API response:", data);

      // Transform the API response to match our interface
      const transformedStats: XStats = {
        username: data.userInfo.username,
        userId: data.userInfo.id,
        name: data.userInfo.name,
        description: data.userInfo.description || "",
        profileImageUrl: data.userInfo.profileImageUrl || "",
        verified: data.userInfo.verified || false,
        followers: data.metrics.followers || 0,
        following: data.metrics.following || 0,
        tweetCount: data.metrics.tweetCount || 0,
        listedCount: data.metrics.listedCount || 0,
        likeCount: data.metrics.likeCount || 0,
        mediaCount: data.metrics.mediaCount || 0,
        since,
        until,
        datePreset
      };

      console.log("✅ X stats transformed successfully:", transformedStats);
      return transformedStats;

    } catch (error: any) {
      console.error("❌ X REDUX THUNK: Error fetching X stats:", error);
      throw error;
    }
  }
);

// --- Slice ---
const xDataSlice = createSlice({
  name: "xData",
  initialState,
  reducers: {
    clearXStats: (state) => {
      state.stats = null;
      state.progressiveStats = null;
      state.posts = null;
      state.statusStats = "idle";
      state.statusProgressiveStats = "idle";
      state.statusPosts = "idle";
      state.errorStats = null;
      state.errorProgressiveStats = null;
      state.errorPosts = null;
    },
    setXStats: (state, action) => {
      state.stats = action.payload;
      state.statusStats = "succeeded";
      state.errorStats = null;
    },
    setXPosts: (state, action) => {
      state.posts = action.payload;
      state.statusPosts = "succeeded";
      state.errorPosts = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchXStats
      .addCase(fetchXStats.pending, (state) => {
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchXStats.fulfilled, (state, action) => {
        state.statusStats = "succeeded";
        state.stats = action.payload;
        state.errorStats = null;
      })
      .addCase(fetchXStats.rejected, (state, action) => {
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to fetch X stats";
      });
  },
});

// --- Actions ---
export const { clearXStats, setXStats, setXPosts } = xDataSlice.actions;

// --- Selectors ---
export const selectXStats = (state: RootState) => state.xData.stats;
export const selectXProgressiveStats = (state: RootState) => state.xData.progressiveStats;
export const selectXPosts = (state: RootState) => state.xData.posts;
export const selectXStatsStatus = (state: RootState) => state.xData.statusStats;
export const selectXProgressiveStatsStatus = (state: RootState) => state.xData.statusProgressiveStats;
export const selectXPostsStatus = (state: RootState) => state.xData.statusPosts;
export const selectXStatsError = (state: RootState) => state.xData.errorStats;
export const selectXProgressiveStatsError = (state: RootState) => state.xData.errorProgressiveStats;
export const selectXPostsError = (state: RootState) => state.xData.errorPosts;

// --- Reducer ---
export default xDataSlice.reducer;
