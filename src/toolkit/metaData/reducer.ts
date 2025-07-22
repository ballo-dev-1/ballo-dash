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
  posts: PostsResponse | null;
  pageName: string | null;
  statusStats: "idle" | "loading" | "succeeded" | "failed";
  statusPosts: "idle" | "loading" | "succeeded" | "failed";
  errorStats: string | null;
  errorPosts: string | null;
}

const initialState: MetaState = {
  stats: null,
  posts: null,
  pageName: null,
  statusStats: "idle",
  statusPosts: "idle",
  errorStats: null,
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
    let state = getState();

    if (
      state.integration.items.length === 0 &&
      state.integration.status !== "loading"
    ) {
      await dispatch(fetchIntegrations());
      state = getState();
    }

    const metaIntegration = state.integration.items.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!metaIntegration) throw new Error("No Meta integration found");

    const accessToken = metaIntegration.accessToken;

    const res = await fetch(
      `/api/data/meta/stats?platform=${platform.toLowerCase()}&pageId=${pageId}&since=${since}&until=${until}&date_preset=${datePreset}&limit=100&accessToken=${accessToken}`
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch Meta stats: ${errText}`);
    }

    return await res.json();
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
      state.integration.items.length === 0 &&
      state.integration.status !== "loading"
    ) {
      await dispatch(fetchIntegrations());
      state = getState();
    }

    const metaIntegration = state.integration.items.find(
      (integration: { type: string }) =>
        integration.type === platform.toUpperCase()
    );

    if (!metaIntegration) throw new Error("No Meta integration found");

    const accessToken = metaIntegration.accessToken;

    const res = await fetch(
      `/api/data/meta/posts?platform=${platform.toLowerCase()}&pageId=${pageId}&since=${since}&until=${until}&date_preset=${datePreset}&limit=100&accessToken=${accessToken}`
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Meta Stats
      .addCase(fetchMetaStats.pending, (state) => {
        state.statusStats = "loading";
        state.errorStats = null;
      })
      .addCase(fetchMetaStats.fulfilled, (state, action) => {
        state.statusStats = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchMetaStats.rejected, (state, action) => {
        state.statusStats = "failed";
        state.errorStats = action.error.message || "Failed to load Meta stats";
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

// Selectors
export const selectMetaStats = (state: RootState) => state.meta.stats;
export const selectMetaPosts = (state: RootState) => state.meta.posts;

export const selectMetaStatusStats = (state: RootState) =>
  state.meta.statusStats;
export const selectMetaStatusPosts = (state: RootState) =>
  state.meta.statusPosts;

export const selectMetaErrorStats = (state: RootState) => state.meta.errorStats;
export const selectMetaErrorPosts = (state: RootState) => state.meta.errorPosts;

export default metaSlice.reducer;
