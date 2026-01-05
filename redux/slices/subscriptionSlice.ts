import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Define response types
interface SubscriptionCreateResponse {
  statusCode: number;
  message: string;
  data: {
    subscription_id: string;
    payment_id: string;
  };
}

interface SubscriptionVerifyResponse {
  statusCode: number;
  message: string;
  data: {
    subscription: any;
    payment: any;
  };
}

interface SubscriptionState {
  subscription: any | null;
  payment: any | null;
  loading: boolean;
  error: string | null;
  createResponse: SubscriptionCreateResponse | null;
  verifyResponse: SubscriptionVerifyResponse | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  payment: null,
  loading: false,
  error: null,
  createResponse: null,
  verifyResponse: null,
};

// Async thunk to create a subscription
export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (
    payload: {
      email: string;
      plan_price_id: string;
      payment_method: string;
      billing_id?: string;
      auto_renew: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<SubscriptionCreateResponse>(
        '/subscription/create',
        payload
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create subscription'
      );
    }
  }
);

// Async thunk to verify a subscription
export const verifySubscription = createAsyncThunk(
  'subscription/verify',
  async (payment_id: string, { rejectWithValue }) => {
    try {
      const response = await api.post<SubscriptionVerifyResponse>(
        `/subscription/verify/${payment_id}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to verify subscription'
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionState: (state) => {
      state.subscription = null;
      state.payment = null;
      state.createResponse = null;
      state.verifyResponse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.createResponse = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifySubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyResponse = action.payload;
        state.subscription = action.payload.data?.subscription || null;
        state.payment = action.payload.data?.payment || null;
      })
      .addCase(verifySubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionState } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
