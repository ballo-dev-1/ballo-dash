// src/store/integrationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { integrationsService } from "@/services/integrationsService";

export const fetchIntegrations = createAsyncThunk(
  "integration/fetchAll",
  async () => {
    // Use the centralized integrations service
    return await integrationsService.getIntegrations();
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
