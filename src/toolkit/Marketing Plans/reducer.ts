import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

type TimeFrame = "weekly" | "monthly" | "quarterly" | "annual";

export interface Task {
  id: string;
  title: string;
  platform: string;
  status?: string;
  contentType?: string;
  completed?: boolean;
  budget?: string;
  kpi?: string;
}

export interface MarketingPlan {
  id: string;
  companyId: string;
  timeframe: TimeFrame;
  periodStart: string;
  periodEnd: string;
  tasks: Task[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

interface MarketingPlanState {
  plans: Record<TimeFrame, MarketingPlan | null>;
  loading: boolean;
  error: string | null;
}

const initialState: MarketingPlanState = {
  plans: {
    weekly: null,
    monthly: null,
    quarterly: null,
    annual: null,
  },
  loading: false,
  error: null,
};

export const fetchMarketingPlan = createAsyncThunk(
  "marketingPlan/fetch",
  async ({
    companyId,
    timeframe,
    periodStart,
  }: {
    companyId: string;
    timeframe: TimeFrame;
    periodStart: string;
  }) => {
    console.log("fetching plan data");
    const res = await fetch(
      `/api/plan?companyId=${companyId}&timeframe=${timeframe}&periodStart=${periodStart}`
    );
    if (!res.ok) throw new Error("Failed to fetch marketing plan");
    return await res.json();
  }
);

export const createMarketingPlan = createAsyncThunk(
  "marketingPlan/create",
  async (newPlan: Omit<MarketingPlan, "id">) => {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlan),
    });
    if (!res.ok) throw new Error("Failed to create marketing plan");
    return await res.json();
  }
);

export const updateMarketingPlan = createAsyncThunk(
  "marketingPlan/update",
  async (plan: MarketingPlan) => {
    const res = await fetch(`/api/plan?id=${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error("Failed to update marketing plan");
    return await res.json();
  }
);

export const deleteMarketingPlan = createAsyncThunk(
  "marketingPlan/delete",
  async (id: string) => {
    const res = await fetch(`/api/plan?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete marketing plan");
    return id;
  }
);

const marketingPlanSlice = createSlice({
  name: "marketingPlan",
  initialState,
  reducers: {
    resetMarketingPlans(state) {
      state.plans = {
        weekly: null,
        monthly: null,
        quarterly: null,
        annual: null,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMarketingPlan.fulfilled,
        (state, action: PayloadAction<MarketingPlan>) => {
          state.loading = false;
          const { timeframe } = action.payload;
          state.plans[timeframe] = action.payload;
        }
      )
      .addCase(fetchMarketingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(
        createMarketingPlan.fulfilled,
        (state, action: PayloadAction<MarketingPlan>) => {
          const { timeframe } = action.payload;
          state.plans[timeframe] = action.payload;
        }
      )
      .addCase(
        updateMarketingPlan.fulfilled,
        (state, action: PayloadAction<MarketingPlan>) => {
          const { timeframe } = action.payload;
          state.plans[timeframe] = action.payload;
        }
      )
      .addCase(deleteMarketingPlan.fulfilled, (state, action) => {
        for (const tf of Object.keys(state.plans) as TimeFrame[]) {
          if (state.plans[tf]?.id === action.payload) {
            state.plans[tf] = null;
          }
        }
      });
  },
});

export const { resetMarketingPlans } = marketingPlanSlice.actions;
export const selectMarketingPlan = (
  state: RootState,
  timeframe: TimeFrame
): MarketingPlan | undefined => {
  return state.marketingPlan?.plans?.[timeframe]; // ✅ null-safe
};
export default marketingPlanSlice.reducer;
