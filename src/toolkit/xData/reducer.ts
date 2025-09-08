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



interface XPost {
  id: string;
  message: string;
  created_time: string;
  media_type: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    impression_count: number;
  };
}

interface XPostsResponse {
  platform: string;
  accountId: string;
  pageInfo: {
    name: string;
    profilePicture: string | null;
    id: string;
    username: string;
    followers_count: number;
    media_count: number;
  };
  posts: XPost[];
  total: number;
}

interface ProgressiveXStats {
  username: string;
  platform: string;
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
  loadingMetrics: string[];
  completedMetrics: string[];
}

interface XState {
  stats: XStats | null;
  posts: XPostsResponse | null;
  progressiveStats: ProgressiveXStats | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  statusPosts: "idle" | "loading" | "succeeded" | "failed";
  statusProgressiveStats: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
  errorPosts: string | null;
  errorProgressiveStats: string | null;
}

// --- Initial State ---
const initialState: XState = {
  stats: null,
  posts: null,
  progressiveStats: null,
  statusStats: "idle",
  statusPosts: "idle",
  statusProgressiveStats: "idle",
  errorStats: null,
  errorPosts: null,
  errorProgressiveStats: null,
};

// --- Thunks ---
export const fetchXStats = createAsyncThunk<
  XStats,
  { username: string; platform: string; since?: string; until?: string; datePreset?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "x/fetchStats",
  async ({ username, platform, since = "", until = "", datePreset = "" }, { dispatch, getState }) => {
    let state = getState();



    try {
      // First, try to get cached data immediately for instant display
      const cachedUrl = `/api/data/x/cached-stats?username=${username}&platform=${platform}`;
      
      let cachedResponse;
      try {
        cachedResponse = await fetch(cachedUrl);
        if (cachedResponse.ok) {
          const cachedData = await cachedResponse.json();
          if (cachedData._cached) {
            // Return cached data immediately, but continue fetching fresh data
            // This implements the stale-while-revalidate pattern
          }
        }
      } catch (cacheError) {
        // No cached data available, fetching fresh data only
      }

      // Now fetch fresh data
      const url = `/api/data/x/stats?username=${username}&platform=${platform}&since=${since}&until=${until}&date_preset=${datePreset}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch X stats: ${response.status}`);
      }

      const data = await response.json();

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

      return transformedStats;

    } catch (error: any) {
      // If fresh data fetch fails, try to return cached data as fallback
      try {
        const cachedUrl = `/api/data/x/cached-stats?username=${username}&platform=${platform}`;
        const cachedResponse = await fetch(cachedUrl);
        
        if (cachedResponse.ok) {
          const cachedData = await cachedResponse.json();
          if (cachedData._cached && cachedData._fetchStatus === 'SUCCESS') {

            
            // Transform cached data to match XStats interface
            const transformedCachedStats: XStats = {
              username: cachedData.userInfo.username,
              userId: cachedData.userInfo.id,
              name: cachedData.userInfo.name,
              description: cachedData.userInfo.description || "",
              profileImageUrl: cachedData.userInfo.profileImageUrl || "",
              verified: cachedData.userInfo.verified || false,
              followers: cachedData.metrics.followers || 0,
              following: cachedData.metrics.following || 0,
              tweetCount: cachedData.metrics.tweetCount || 0,
              listedCount: cachedData.metrics.listedCount || 0,
              likeCount: cachedData.metrics.likeCount || 0,
              mediaCount: cachedData.metrics.mediaCount || 0,
              since,
              until,
              datePreset
            };
            
            // Add cache metadata
            (transformedCachedStats as any)._cached = true;
            (transformedCachedStats as any)._fetchStatus = 'SUCCESS';
            (transformedCachedStats as any)._lastFetchedAt = cachedData._lastFetchedAt;
            (transformedCachedStats as any)._message = "Showing cached data due to fresh data fetch failure";
            
            return transformedCachedStats;
          }
        } else if (cachedResponse.status === 404) {
          // No cached data available
        }
      } catch (cacheError) {
        // Failed to fallback to cached data
      }
      
      // If no cached data available, throw the original error
      throw error;
    }
  }
);

export const fetchXPosts = createAsyncThunk<
  XPostsResponse,
  { accountId: string; username?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "x/fetchPosts",
  async ({ accountId, username }, { rejectWithValue }) => {
    try {
      const url = `/api/data/x/posts?accountId=${accountId}${username ? `&username=${username}` : ''}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch X posts: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch X posts");
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
      state.posts = null;
      state.statusStats = "idle";
      state.statusPosts = "idle";
      state.errorStats = null;
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
    // Progressive update actions
    initializeProgressiveXStats: (state, action) => {
      const { username, platform, since, until, datePreset, loadingMetrics } = action.payload;
      state.progressiveStats = {
        username,
        platform,
        since,
        until,
        datePreset,
        loadingMetrics: loadingMetrics || [],
        completedMetrics: [],
        userId: "",
        name: "",
        description: "",
        profileImageUrl: "",
        verified: false,
        followers: 0,
        following: 0,
        tweetCount: 0,
        listedCount: 0,
        likeCount: 0,
        mediaCount: 0
      };
      state.statusProgressiveStats = "loading";
      state.errorProgressiveStats = null;
    },
    updateXUserInfo: (state, action) => {
      if (state.progressiveStats) {
        state.progressiveStats.userId = action.payload.userId || "";
        state.progressiveStats.name = action.payload.name || "";
        state.progressiveStats.description = action.payload.description || "";
        state.progressiveStats.profileImageUrl = action.payload.profileImageUrl || "";
        state.progressiveStats.verified = action.payload.verified || false;
      }
    },
    startXMetricFetch: (state, action) => {
      const metric = action.payload;
      if (state.progressiveStats) {
        state.progressiveStats.loadingMetrics.push(metric);
      }
    },
    updateXMetric: (state, action) => {
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
            state.progressiveStats.followers = data.followers || 0;
            break;
          case "following":
            state.progressiveStats.following = data.following || 0;
            break;
          case "tweets":
            state.progressiveStats.tweetCount = data.tweetCount || 0;
            break;
          case "engagement":
            state.progressiveStats.likeCount = data.likeCount || 0;
            state.progressiveStats.listedCount = data.listedCount || 0;
            state.progressiveStats.mediaCount = data.mediaCount || 0;
            break;
        }
      }
    },
    failXMetric: (state, action) => {
      const { metric, error } = action.payload;
      if (state.progressiveStats) {
        // Remove from loading
        state.progressiveStats.loadingMetrics = state.progressiveStats.loadingMetrics.filter(m => m !== metric);
      }
    },
    completeProgressiveXFetch: (state) => {
      if (state.progressiveStats) {
        state.statusProgressiveStats = "succeeded";
      }
    },
    resetProgressiveXStats: (state) => {
      state.progressiveStats = null;
      state.statusProgressiveStats = "idle";
      state.errorProgressiveStats = null;
    }
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
      })
      // fetchXPosts
      .addCase(fetchXPosts.pending, (state) => {
        state.statusPosts = "loading";
        state.errorPosts = null;
      })
      .addCase(fetchXPosts.fulfilled, (state, action) => {
        state.statusPosts = "succeeded";
        state.posts = action.payload;
        state.errorPosts = null;
      })
      .addCase(fetchXPosts.rejected, (state, action) => {
        state.statusPosts = "failed";
        state.errorPosts = action.payload as string || "Failed to fetch X posts";
      });
  },
});

// --- Actions ---
export const { 
  clearXStats, 
  setXStats, 
  setXPosts,
  initializeProgressiveXStats,
  updateXUserInfo,
  startXMetricFetch,
  updateXMetric,
  failXMetric,
  completeProgressiveXFetch,
  resetProgressiveXStats
} = xDataSlice.actions;

// --- Selectors ---
export const selectXStats = (state: RootState) => state.xData.stats;
export const selectXPosts = (state: RootState) => state.xData.posts;
export const selectXStatsStatus = (state: RootState) => state.xData.statusStats;
export const selectXPostsStatus = (state: RootState) => state.xData.statusPosts;
export const selectXStatsError = (state: RootState) => state.xData.errorStats;
export const selectXPostsError = (state: RootState) => state.xData.errorPosts;

// Progressive selectors
export const selectProgressiveXStats = (state: RootState) => state.xData.progressiveStats;
export const selectProgressiveXStatus = (state: RootState) => state.xData.statusProgressiveStats;
export const selectProgressiveXError = (state: RootState) => state.xData.errorProgressiveStats;

// --- Reducer ---
export default xDataSlice.reducer;
