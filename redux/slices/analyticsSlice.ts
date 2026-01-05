import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AnalyticsReponse,
  AnalyticsStats,
  MonthlyRevenueResponse,
  MonthlyRevenueData,
} from '@/types/analytics';
import api from '@/lib/api';
import { ErrorResponse } from '@/types';

interface AnalyticsState {
  stats: AnalyticsStats | null;
  loading: boolean;
  error: string | null;
  monthlyRevenue: MonthlyRevenueData | null;
  monthlyRevenueLoading: boolean;
  monthlyRevenueError: ErrorResponse | null;
}

const initialState: AnalyticsState = {
  stats: null,
  loading: true,
  error: null,
  monthlyRevenue: null,
  monthlyRevenueLoading: false,
  monthlyRevenueError: null,
};

// Async thunk to get stats
export const getStats = createAsyncThunk(
  'business-analytics/stats',
  async ({ business_id }: { business_id: string }, { rejectWithValue }) => {
    try {
      const headers: Record<string, any> = {};

      if (business_id !== undefined) headers['Business-Id'] = business_id;

      const { data } = await api.get<AnalyticsReponse>(
        '/business-analytics/stats',
        {
          headers,
        }
      );

      return {
        data: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to get stats');
    }
  }
);

// Async thunk to get monthly product revenue
export const getMonthlyProductRevenue = createAsyncThunk(
  'business-analytics/product-revenue-monthly',
  async ({ business_id }: { business_id: string }, { rejectWithValue }) => {
    try {
      const headers: Record<string, any> = {};

      if (business_id !== undefined) headers['Business-Id'] = business_id;

      const { data } = await api.get<MonthlyRevenueResponse>(
        '/business-analytics/product-revenue-monthly',
        {
          headers,
        }
      );

      return {
        data: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to get monthly product revenue'
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMonthlyProductRevenue.pending, (state) => {
        state.monthlyRevenueLoading = true;
        state.monthlyRevenueError = null;
      })
      .addCase(getMonthlyProductRevenue.fulfilled, (state, action) => {
        state.monthlyRevenueLoading = false;
        state.monthlyRevenue = action.payload.data;
      })
      .addCase(getMonthlyProductRevenue.rejected, (state, action) => {
        state.monthlyRevenueLoading = false;
        state.monthlyRevenueError = action.payload as ErrorResponse;
      });
  },
});

export default analyticsSlice.reducer;
