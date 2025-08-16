// src/store/integrationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { integrationsService } from '@/services/integrationsService';

// Types
export interface Integration {
  id: string;
  companyId: string;
  type: string;
  status: string;
  appId?: string;
  appSecret?: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationsState {
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  hasIntegrations: boolean;
}

const initialState: IntegrationsState = {
  integrations: [],
  loading: false,
  error: null,
  hasIntegrations: false,
};

// Async thunks
export const fetchIntegrations = createAsyncThunk(
  'integrations/fetchIntegrations',
  async (companyId: string) => {
    const data = await integrationsService.getIntegrations();
    return data;
  }
);

export const createIntegration = createAsyncThunk(
  'integrations/createIntegration',
  async (integrationData: any) => {
    const data = await integrationsService.createIntegration(integrationData);
    return data;
  }
);

export const updateIntegration = createAsyncThunk(
  'integrations/updateIntegration',
  async ({ id, updateData }: { id: string; updateData: any }) => {
    const data = await integrationsService.updateIntegration(id, updateData);
    return data;
  }
);

export const deleteIntegration = createAsyncThunk(
  'integrations/deleteIntegration',
  async (integrationId: string) => {
    await integrationsService.deleteIntegration(integrationId);
    return integrationId;
  }
);

// Slice
const integrationsSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    clearIntegrations: (state) => {
      state.integrations = [];
      state.hasIntegrations = false;
      state.error = null;
    },
    setHasIntegrations: (state, action: PayloadAction<boolean>) => {
      state.hasIntegrations = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch integrations
    builder
      .addCase(fetchIntegrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations = action.payload;
        state.hasIntegrations = action.payload.length > 0;
        console.log('🔍 Redux: fetchIntegrations.fulfilled - integrations:', action.payload.length, 'hasIntegrations:', state.hasIntegrations);
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch integrations';
        state.hasIntegrations = false;
      });

    // Create integration
    builder
      .addCase(createIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIntegration.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations.push(action.payload);
        state.hasIntegrations = true;
        console.log('🔍 Redux: createIntegration.fulfilled - integrations:', state.integrations.length, 'hasIntegrations:', state.hasIntegrations);
      })
      .addCase(createIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create integration';
      });

    // Update integration
    builder
      .addCase(updateIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIntegration.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.integrations.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.integrations[index] = action.payload;
        }
        // Ensure hasIntegrations is updated after any integration update
        state.hasIntegrations = state.integrations.length > 0;
        console.log('🔍 Redux: updateIntegration.fulfilled - integrations:', state.integrations.length, 'hasIntegrations:', state.hasIntegrations);
      })
      .addCase(updateIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update integration';
      });

    // Delete integration
    builder
      .addCase(deleteIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIntegration.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations = state.integrations.filter(i => i.id !== action.payload);
        state.hasIntegrations = state.integrations.length > 0;
        console.log('🔍 Redux: deleteIntegration.fulfilled - integrations:', state.integrations.length, 'hasIntegrations:', state.hasIntegrations);
      })
      .addCase(deleteIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete integration';
      });
  },
});

// Actions
export const { clearIntegrations, setHasIntegrations } = integrationsSlice.actions;

// Selectors
export const selectIntegrations = (state: any) => state.integrations.integrations;
export const selectHasIntegrations = (state: any) => state.integrations.hasIntegrations;
export const selectIntegrationsLoading = (state: any) => state.integrations.loading;
export const selectIntegrationsError = (state: any) => state.integrations.error;

export default integrationsSlice.reducer;
