import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  Withdrawal,
  WithdrawalDetailsResponse,
  WithdrawalsResponse,
  CreateWithdrawalResponse,
} from '@/types/withdrawal';
import {
  CreateShippingLocationResponse,
  DeleteShippingDetailsResponse,
  FetchShippingDetailsResponse,
  ShippingLocation,
  ShippingResponse,
  UpdateShippingDetailsResponse,
} from '@/types/shipping';
import {
  CreateShippingLocationProps,
  UpdateShippingLocationProps,
} from '@/lib/schema/shipping.schema';

// ================ STATE ==================

interface ShippingState {
  shippingLocations: ShippingLocation[];
  shippingLocation: ShippingLocation | null;
  count: number;
  loading: boolean;
  error: string | null;
  createResponse: CreateWithdrawalResponse | null;
}

const initialState: ShippingState = {
  shippingLocations: [],
  shippingLocation: null,
  count: 0,
  loading: false,
  error: null,
  createResponse: null,
};

// ================ THUNKS =================

// Create shipping
export const createShipping = createAsyncThunk(
  'shipping/create',
  async (
    {
      payload,
      business_id,
    }: { payload: CreateShippingLocationProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<CreateShippingLocationResponse>(
        '/shipping/create',
        payload,
        {
          headers: { 'Business-Id': business_id },
        }
      );
      return { message: data.message, shipping: data.data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create shipping location'
      );
    }
  }
);

// Fetch all shipping locations
export const fetchShipping = createAsyncThunk(
  'shipping',
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
    if (q !== undefined) params.q = q;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<ShippingResponse<ShippingLocation>>(
      '/shipping',
      {
        params,
        headers,
      }
    );

    return {
      shipping: data.data,
      count: data.count,
    };
  }
);

// Fetch single shipping details
export const fetchShippingDetails = createAsyncThunk(
  'shipping/:id',
  async (id: string) => {
    const { data } = await api.get<FetchShippingDetailsResponse>(
      `/shipping/${id}`
    );
    return data;
  }
);

// Fetch update shipping details
export const updateShippingDetails = createAsyncThunk(
  'shipping/:id/update',
  async (
    {
      id,
      business_id,
      payload,
    }: {
      id: string;
      business_id: string;
      payload: UpdateShippingLocationProps;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<UpdateShippingDetailsResponse>(
        `/shipping/${id}`,
        payload,
        {
          headers: { 'Business-Id': business_id },
        }
      );

      return { message: data.message, shipping: data.data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update shipping details'
      );
    }
  }
);

// Fetch delete shipping details
export const deleteShippingDetails = createAsyncThunk(
  'shipping/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<DeleteShippingDetailsResponse>(
        `/shipping/${id}`,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );
      return { message: data.message, data: data.data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete shipping details'
      );
    }
  }
);

// ================ SLICE ==================

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createShipping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipping.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new shipping location to existing list
        if (action.payload) {
          state.shippingLocations.unshift(action.payload.shipping);
        }
      })
      .addCase(createShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch all shipping
      .addCase(fetchShipping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipping.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingLocations = action.payload.shipping;
        state.count = action.payload.count;
      })
      .addCase(fetchShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single shipping
      .addCase(fetchShippingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingLocation = action.payload.data;
      })
      .addCase(fetchShippingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update shipping
      .addCase(updateShippingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingLocation = action.payload.shipping;

        const locationDetails = state.shippingLocations.findIndex(
          (shippingLocation) =>
            shippingLocation.id === action.payload.shipping.id
        );
        state.shippingLocations[locationDetails] = {
          ...state.shippingLocations[locationDetails],
          ...action.payload.shipping,
        };
      })
      .addCase(updateShippingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete shipping
      .addCase(deleteShippingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShippingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingLocations = state.shippingLocations.filter(
          (shippingLocation) => shippingLocation.id !== action.payload.data.id
        );
      })
      .addCase(deleteShippingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default shippingSlice.reducer;
