import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ActivityLog, LogsResponse } from '@/types/log';
import api from '@/lib/api';
import Cookies from 'js-cookie';

interface LogState {
  logs: ActivityLog[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: LogState = {
  logs: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated logs
export const fetchLogs = createAsyncThunk(
  'log/fetch',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    const { data } = await api.get<LogsResponse>('/log/fetch', {
      params,
    });

    return {
      logs: data.data,
      count: data.count,
    };
  },
);

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // state.perPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.count = action.payload.count;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch logs';
      });
  },
});

export const { setPage, setPerPage } = logSlice.actions;
export default logSlice.reducer;
