import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  ApplyCoupon,
  ApplyCouponResponse,
  Coupon,
  CouponDetailsResponse,
  CouponResponse,
} from '@/types/coupon';
import {
  CreateCouponProps,
  UpdateCouponProps,
} from '@/lib/schema/coupon.schema';
import { GenericResponse } from '@/types';

interface CouponState {
  coupons: Coupon[];
  coupon: Coupon | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;

  coupon_info: {
    discount: number;
    discountedAmount: number;
  };
}

// Initial state
const initialState: CouponState = {
  coupons: [],
  coupon: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,

  coupon_info: {
    discount: 0,
    discountedAmount: 0,
  },
};

// Async thunk to fetch paginated coupons
export const fetchCoupons = createAsyncThunk(
  'coupon-management/fetch/:business',
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
    // if (business_id !== undefined) params['business_id'] = business_id;

    const { data } = await api.get<CouponResponse>(
      `/coupon-management/fetch/${business_id}`,
      {
        params,
      }
    );

    return {
      coupons: data.data,
      count: data.count,
    };
  }
);

// Async thunk to create coupon
export const createCoupon = createAsyncThunk(
  'coupon-management/create',
  async (
    { credentials }: { credentials: CreateCouponProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponse>(
        '/coupon-management/create',
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      // console.log(error);
      return rejectWithValue(error.response?.data || 'Failed to create coupon');
    }
  }
);

// Async thunk to fetch course details
export const fetchCoupon = createAsyncThunk(
  'coupon-management/details/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<CouponDetailsResponse>(
      `/coupon-management/details/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      coupon: data.data,
    };
  }
);

// Async thunk to update coupon
export const updateCoupon = createAsyncThunk(
  'coupon-management/:id',
  async (
    { id, credentials }: { id: string; credentials: UpdateCouponProps },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<GenericResponse>(
        `/coupon-management/${id}`,
        credentials
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update ticket');
    }
  }
);

// Async thunk to delete coupon
export const deleteCoupon = createAsyncThunk(
  'coupon-management/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<GenericResponse>(
        `/coupon-management/${id}`,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete coupon');
    }
  }
);

// Async thunk to apply coupon
export const applyCoupon = createAsyncThunk(
  'coupon-management/apply-coupon',
  async (payload: ApplyCoupon, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApplyCouponResponse>(
        '/coupon-management/apply-coupon',
        payload
      );

      return {
        data: data.data,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to apply coupon'
      );
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      // state.perPage = action.payload;
    },
    viewCoupon: (state, action: PayloadAction<string>) => {
      const couponId = action.payload;
      const matchedCoupon = state.coupons.find(
        (coupon) => coupon.id === couponId
      );

      if (matchedCoupon) {
        state.coupon = {
          ...matchedCoupon,
        } as Coupon;
      } else {
        state.error = 'Coupon not found in local state';
      }
    },
    clearCouponData: (state) => {
      state.coupon_info = {
        discount: 0,
        discountedAmount: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons;
        state.count = action.payload.count;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      })
      .addCase(fetchCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload.coupon;
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupon details';
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create coupon';
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update coupon';
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete coupon';
      })
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon_info = {
          discountedAmount: action.payload.data.discountedAmount,
          discount: action.payload.data.discount,
        };
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to apply coupon';
        state.loading = false;
      });
  },
});

export const { setPage, setPerPage, viewCoupon, clearCouponData } =
  couponSlice.actions;
export default couponSlice.reducer;
