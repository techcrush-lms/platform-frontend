import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CategoryResponse,
  CategoryWithCreator,
  Course,
  CourseDetailsResponse,
  CourseResponse,
  CreateProductResponse,
  Module,
  ModuleContent,
  ModuleResponse,
  UpdateCourseResponse,
  ViewContentProps,
  EnrolledCourseResponse,
  EnrolledCourseData,
} from '@/types/product';
import {
  CreateCourseProps,
  CreateModulesProps,
  UpdateCourseProps,
  UpdateModulesProps,
} from '@/lib/schema/product.schema';
import { GenericResponse } from '@/types';
import {
  Cohort,
  FetchCohortResponse,
  FetchCohortsResponse,
} from '@/types/cohort';
import {
  CreateCohortProps,
  UpdateCohortProps,
} from '@/lib/schema/cohort.schema';

interface CohortState {
  cohorts: Cohort[];
  cohort: Cohort | null;
  count: number;

  loading: boolean;

  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: CohortState = {
  cohorts: [],
  cohort: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated cohorts
export const fetchCohorts = createAsyncThunk(
  'cohort',
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

    const { data } = await api.get<FetchCohortsResponse>('/cohort', {
      params,
    });

    return {
      cohorts: data.data,
      count: data.count,
    };
  },
);

// Async thunk to create cohort
export const createCohort = createAsyncThunk(
  'cohort/create',
  async (
    { credentials }: { credentials: CreateCohortProps },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        '/cohort/create',
        credentials,
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'Failed to create cohort');
    }
  },
);

// Async thunk to fetch cohort details
export const fetchCohort = createAsyncThunk(
  'cohort/:id',
  async ({ id }: { id: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};

    const { data } = await api.get<FetchCohortResponse>(`/cohort/${id}`, {
      params,
      headers,
    });

    return {
      cohort: data.data,
    };
  },
);

// Async thunk to update cohort
export const updateCohort = createAsyncThunk(
  'cohort/:id/update',
  async (
    { id, credentials }: { id: string; credentials: UpdateCohortProps },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch<GenericResponse>(
        `/cohort/${id}`,
        credentials,
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update cohort');
    }
  },
);

// Async thunk to delete cohort
export const deleteCohort = createAsyncThunk(
  'cohort/:id/delete',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete<GenericResponse>(`/cohort/${id}`);

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete cohort');
    }
  },
);

const cohortSlice = createSlice({
  name: 'cohort',
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
      .addCase(createCohort.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCohort.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create cohort.';
      })
      .addCase(updateCohort.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCohort.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update cohort';
      })
      .addCase(deleteCohort.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCohort.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete cohort';
      })
      .addCase(fetchCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohorts.fulfilled, (state, action) => {
        state.loading = false;
        state.cohorts = action.payload.cohorts;
        state.count = action.payload.count;
      })
      .addCase(fetchCohorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchCohort.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohort.fulfilled, (state, action) => {
        state.loading = false;
        state.cohort = action.payload.cohort;
      })
      .addCase(fetchCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cohort details';
      });
  },
});

export const { setPage, setPerPage } = cohortSlice.actions;
export default cohortSlice.reducer;
