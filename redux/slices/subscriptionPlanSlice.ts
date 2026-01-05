import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CreateSubscriptionPlanResponse,
  SubscriptionPlan,
  SubscriptionPlanDetailsResponse,
  SubscriptionPlanResponse,
} from '@/types/subscription-plan';
import {
  CreateSubscriptionPlanProps,
  UpdateSubscriptionPlanProps,
} from '@/lib/schema/subscription.schema';
import { GenericResponse } from '@/types';

interface SubscriptionPlanState {
  subscription_plans: SubscriptionPlan[];
  subscription_plan: SubscriptionPlan | null;
  count: number;
  loading: boolean;
  planLoading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: SubscriptionPlanState = {
  subscription_plans: [],
  subscription_plan: null,
  count: 0,
  planLoading: false,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription-plan/fetch/:business_id',
  async ({
    page,
    limit,
    q,
    startDate,
    endDate,
    business_id,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    const { data } = await api.get<SubscriptionPlanResponse>(
      `/subscription-plan/fetch/${business_id}`,
      {
        params,
      }
    );

    return {
      subscription_plans: data.data,
      count: data.count,
    };
  }
);

// Async thunk to fetch subscription plan details
export const fetchSubscriptionPlan = createAsyncThunk(
  'subscription-plan/fetch-single/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id !== undefined) headers['Business-Id'] = business_id;

    const { data } = await api.get<SubscriptionPlanDetailsResponse>(
      `/subscription-plan/fetch-single/${id}`,
      {
        headers,
      }
    );

    return {
      subscription_plan: data.data,
    };
  }
);

// Async thunk to create subscription plan
export const createSubscriptionPlan = createAsyncThunk(
  'subscription-plan/bulk-create',
  async (
    { credentials }: { credentials: CreateSubscriptionPlanProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<CreateSubscriptionPlanResponse>(
        '/subscription-plan/bulk-create',
        credentials
      );

      return {
        message: data.message,
        subscription_plan: data.data,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to create subscription plan'
      );
    }
  }
);

// Async thunk to update subscription plan
export const updateSubscriptionPlan = createAsyncThunk(
  'subscription-plan/:id/bulk-update',
  async (
    {
      id,
      credentials,
    }: { id?: string; credentials: UpdateSubscriptionPlanProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<GenericResponse>(
        `/subscription-plan/${id}/bulk-update`,
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(
        error.response?.data || 'Failed to update subscription plan'
      );
    }
  }
);

// Async thunk to delete subscription plan
export const deleteSubscriptionPlan = createAsyncThunk(
  'subscription-plan/:id/delete',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete<GenericResponse>(
        `/subscription-plan/${id}`
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to delete subscription plan'
      );
    }
  }
);

// Async thunk to delete subscription plan price
export const deletePlanPrice = createAsyncThunk(
  'subscription-plan-price/:id/delete',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete<GenericResponse>(
        `/subscription-plan-price/${id}`
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to delete subscription plan price'
      );
    }
  }
);

// Fetch public subscription plans for a business
export const fetchPublicSubscriptionPlans = createAsyncThunk(
  'subscription-plan/public',
  async (
    {
      id,
      business_id,
      page,
      limit,
      q,
    }: {
      business_id: string;
      id?: string;
      page?: number;
      limit?: number;
      q?: string;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};
    if (id !== undefined) params.id = id;
    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    try {
      const { data } = await api.get<SubscriptionPlanResponse>(
        `/subscription-plan/public/${business_id}`,
        { params }
      );
      return {
        subscription_plans: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch public subscription plans'
      );
    }
  }
);

// Fetch subscription plans by business ID for viewing
export const fetchSubscriptionPlansByBusiness = createAsyncThunk(
  'subscription-plan/view/:business_id',
  async (
    {
      business_id,
      page,
      limit,
      q,
    }: {
      business_id: string;
      page?: number;
      limit?: number;
      q?: string;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};
    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    try {
      const { data } = await api.get<SubscriptionPlanResponse>(
        `/subscription-plan/view/${business_id}`,
        { params }
      );
      return {
        subscription_plans: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription plans'
      );
    }
  }
);

const subscriptionPlanSlice = createSlice({
  name: 'subscriptonPlan',
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
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription_plans = action.payload.subscription_plans;
        state.count = action.payload.count;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch subscription plans';
      })
      .addCase(fetchSubscriptionPlan.pending, (state) => {
        state.planLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlan.fulfilled, (state, action) => {
        state.planLoading = false;
        state.subscription_plan = action.payload.subscription_plan;
      })
      .addCase(fetchSubscriptionPlan.rejected, (state, action) => {
        state.planLoading = false;
        state.error =
          action.error.message || 'Failed to fetch subscription plan details';
      })
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription_plans.unshift(action.payload.subscription_plan);
        state.count++;
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to create subscription plan';
      })
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update subscription plan';
      })
      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to delete subscription plan';
      })
      .addCase(deletePlanPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlanPrice.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePlanPrice.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to delete subscription plan price';
      })
      .addCase(fetchPublicSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription_plans = action.payload.subscription_plans;
        state.count = action.payload.count;
      })
      .addCase(fetchPublicSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubscriptionPlansByBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlansByBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription_plans = action.payload.subscription_plans;
        state.count = action.payload.count;
      })
      .addCase(fetchSubscriptionPlansByBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setPerPage } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;
