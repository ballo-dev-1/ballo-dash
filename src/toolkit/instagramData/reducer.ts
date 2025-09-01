// src/toolkit/instagramData/reducer.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "..";

// --- Interfaces ---
interface InstagramStats {
  userInfo: {
    username: string;
    id: string;
    platform: string;
    biography?: string;
  };
  metrics: {
    followers: number;
    reach: number;
    threadsViews: number;
    websiteClicks: number;
    profileViews: number;
    accountsEngaged: number;
    totalInteractions: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    replies: number;
    followsAndUnfollows: number;
    profileLinksTaps: number;
    views: number;
    contentViews: number;
  };
  since?: string;
  until?: string;
  datePreset?: string;
  [key: string]: any;
}

interface InstagramState {
  stats: InstagramStats | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
}

// --- Initial State ---
const initialState: InstagramState = {
  stats: null,
  statusStats: "idle",
  errorStats: null,
};

// --- Thunks ---
export const fetchInstagramStats = createAsyncThunk<
  InstagramStats,
  { platform: string; since?: string; until?: string; datePreset?: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "instagram/fetchStats",
  async ({ platform, since = "", until = "", datePreset = "" }, { dispatch, getState }) => {
    let state = getState();

    try {
      // First, try to get cached data immediately for instant display
      const cachedUrl = `/api/data/instagram/cached-stats?platform=${platform}`;
      
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
      const url = `/api/data/instagram/stats?platform=${platform}&since=${since}&until=${until}&date_preset=${datePreset}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch Instagram stats: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error: any) {
      // If fresh data fetch fails, try to return cached data as fallback
      try {
        const cachedUrl = `/api/data/instagram/cached-stats?platform=${platform}`;
        const cachedResponse = await fetch(cachedUrl);
        
        if (cachedResponse.ok) {
          const cachedData = await cachedResponse.json();
          if (cachedData._cached && cachedData._fetchStatus === 'SUCCESS') {
            
            // Transform cached data to match InstagramStats interface
            const transformedCachedStats: InstagramStats = {
              ...cachedData,
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

// --- Slice ---
const instagramDataSlice = createSlice({
  name: "instagramData",
  initialState,
  reducers: {
    clearInstagramStats: (state) => {
      state.stats = null;
      state.statusStats = "idle";
      state.errorStats = null;
    },
    setInstagramStats: (state, action) => {
      state.stats = action.payload;
      state.statusStats = "succeeded";
      state.errorStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInstagramStats
      .addCase(fetchInstagramStats.pending, (state) => {
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchInstagramStats.fulfilled, (state, action) => {
        state.statusStats = "succeeded";
        state.stats = action.payload;
        state.errorStats = null;
      })
      .addCase(fetchInstagramStats.rejected, (state, action) => {
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to fetch Instagram stats";
      });
  },
});

// --- Actions ---
export const { clearInstagramStats, setInstagramStats } = instagramDataSlice.actions;

// --- Selectors ---
export const selectInstagramStats = (state: RootState) => state.instagramData.stats;
export const selectInstagramStatsStatus = (state: RootState) => state.instagramData.statusStats;
export const selectInstagramStatsError = (state: RootState) => state.instagramData.errorStats;

// --- Reducer ---
export default instagramDataSlice.reducer;
