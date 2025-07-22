// src/store/integrationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";

export const fetchIntegrations = createAsyncThunk(
  "integration/fetchAll",
  async () => {
    const res1 = await fetch("/api/company");
    if (!res1.ok) throw new Error("Failed to load company data");
    const data = await res1.json();
    const url = `/api/integrations?companyId=${data.company.id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch integrations");
    return await res.json();
  }
);

interface Integration {
  id: string;
  companyId: string;
  type: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationState {
  items: Integration[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: IntegrationState = {
  items: [],
  status: "idle",
  error: null,
};

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIntegrations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load integrations";
      });
  },
});

export const selectIntegration = (state: RootState) => state.integration.items;
export const selectIntegrationLoading = (state: RootState) =>
  state.integration.status;
export const selectIntegrationError = (state: RootState) =>
  state.integration.error;

export default integrationSlice.reducer;
