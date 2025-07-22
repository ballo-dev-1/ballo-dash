import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "@/types";
import { RootState } from "..";

interface CompanyState {
  company: Company | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  loading: false,
  error: null,
};

// Async thunk to fetch company
export const fetchCompany = createAsyncThunk<Company>(
  "company/fetchCompany",
  async () => {
    const res = await fetch("/api/company");
    if (!res.ok) throw new Error("Failed to load company data");
    const data = await res.json();
    return data.company;
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
      state.error = null;
    },
    clearCompany: (state) => {
      state.company = null;
    },
    updateLogoUrl: (state, action: PayloadAction<string>) => {
      if (state.company) {
        state.company.logoUrl = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

export const selectCompany = (state: RootState) => state.company.company;
export const selectCompanyLoading = (state: RootState) => state.company.loading;
export const selectCompanyError = (state: RootState) => state.company.error;

export const { setCompany, clearCompany, updateLogoUrl } = companySlice.actions;
export default companySlice.reducer;
