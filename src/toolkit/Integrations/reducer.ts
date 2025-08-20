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
  lastFetched: number | null; // Track when data was last fetched
  isFetching: boolean; // Track if a fetch is currently in progress
}

const initialState: IntegrationsState = {
  integrations: [],
  loading: false,
  error: null,
  hasIntegrations: false,
  lastFetched: null,
  isFetching: false,
};

// Request deduplication - prevent multiple simultaneous calls
let fetchPromise: Promise<any> | null = null;

// Debug function to log ONLY critical state changes (when integrations are lost)
const logCriticalStateChange = (action: string, previousState: any, newState: any, reason?: string) => {
  const integrationsLost = (previousState.integrations?.length || 0) > (newState.integrations?.length || 0);
  
  // Only log when integrations are lost or when fetching starts
  if (integrationsLost || action === 'fetchIntegrations.pending') {
    console.log(`🚨 CRITICAL REDUX CHANGE [${action}]:`, {
      timestamp: new Date().toISOString(),
      reason: reason || 'No reason provided',
      integrationsLost,
      previous: {
        integrationsCount: previousState.integrations?.length || 0,
        hasIntegrations: previousState.hasIntegrations
      },
      current: {
        integrationsCount: newState.integrations?.length || 0,
        hasIntegrations: newState.hasIntegrations
      }
    });
  }
};

// Async thunks
export const fetchIntegrations = createAsyncThunk<
  Integration[],
  string,
  { dispatch: any; state: any }
>(
  'integrations/fetchIntegrations',
  async (companyId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentState = state.integrations;
      
      // Prevent multiple simultaneous requests
      if (currentState.isFetching) {
        if (fetchPromise) {
          return await fetchPromise;
        }
      }
      
      // Check if we have recent data (within 5 minutes)
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (currentState.integrations.length > 0 && 
          currentState.lastFetched && 
          (now - currentState.lastFetched) < fiveMinutes) {
        return currentState.integrations;
      }
      
      // Create the fetch promise and store it
      fetchPromise = integrationsService.getIntegrations();
      const data = await fetchPromise;
      fetchPromise = null; // Clear the promise
      
      return data;
    } catch (error: any) {
      fetchPromise = null; // Clear the promise on error
      console.error('❌ Redux: Error in fetchIntegrations thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch integrations');
    }
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
    clearIntegrations: (state, action) => {
      const previousState = { ...state };
      state.integrations = [];
      state.hasIntegrations = false;
      state.error = null;
      state.lastFetched = null;
      state.isFetching = false;
      
      logCriticalStateChange('clearIntegrations', previousState, state, 'Manual clear action');
    },
    setHasIntegrations: (state, action: PayloadAction<boolean>) => {
      const previousState = { ...state };
      state.hasIntegrations = action.payload;
      
      logCriticalStateChange('setHasIntegrations', previousState, state, `Set to ${action.payload}`);
    },
  },
  extraReducers: (builder) => {
    // Fetch integrations
    builder
      .addCase(fetchIntegrations.pending, (state) => {
        const previousState = { ...state };
        state.loading = true;
        state.isFetching = true;
        state.error = null;
        
        logCriticalStateChange('fetchIntegrations.pending', previousState, state, 'Fetch started');
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        const previousState = { ...state };
        state.loading = false;
        state.isFetching = false;
        state.integrations = action.payload;
        state.hasIntegrations = action.payload.length > 0;
        state.lastFetched = Date.now();
        
        logCriticalStateChange('fetchIntegrations.fulfilled', previousState, state, `Fetched ${action.payload.length} integrations`);
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        const previousState = { ...state };
        state.loading = false;
        state.isFetching = false;
        state.error = action.payload as string || 'Failed to fetch integrations';
        
        logCriticalStateChange('fetchIntegrations.rejected', previousState, state, `Error: ${state.error}`);
        
        // Only clear data on error if we don't have any cached data
        if (state.integrations.length === 0) {
          state.hasIntegrations = false;
        }
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
        state.lastFetched = Date.now();
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
        state.lastFetched = Date.now();
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
        state.lastFetched = Date.now();
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
export const selectIntegrationsLastFetched = (state: any) => state.integrations.lastFetched;
export const selectIntegrationsIsFetching = (state: any) => state.integrations.isFetching;

export default integrationsSlice.reducer;
