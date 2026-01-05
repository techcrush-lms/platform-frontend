import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CreateProductResponse,
  DeleteDigitalProductResponse,
  DigitalProductDetailsResponse,
  DigitalProduct,
  UpdateDigitalProductResponse,
} from '@/types/product';
import {
  CreateDigitalProductProps,
  CreateTicketProps,
  UpdateDigitalProductProps,
} from '@/lib/schema/product.schema';
import { GenericResponseAlt } from '@/types';

interface DigitalProductState {
  digital_products: DigitalProduct[];
  digital_product: DigitalProduct | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: DigitalProductState = {
  digital_products: [],
  digital_product: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to create digital product
export const createDigitalProduct = createAsyncThunk(
  'product-digital-crud/create',
  async (
    {
      credentials,
      business_id,
    }: { credentials: CreateDigitalProductProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponseAlt<DigitalProduct>>(
        '/product-digital-crud/create',
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        data: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to create digital product'
      );
    }
  }
);

// Async thunk to fetch digital product details
export const fetchDigitalProduct = createAsyncThunk(
  'product-digital-crud/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<DigitalProductDetailsResponse>(
      `/product-digital-crud/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      digital_product: data.data,
    };
  }
);

// Async thunk to update digital product
export const updateDigitialProduct = createAsyncThunk(
  'product-digital-crud/:id/update',
  async (
    {
      id,
      credentials,
      business_id,
    }: {
      id: string;
      credentials: UpdateDigitalProductProps;
      business_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<UpdateDigitalProductResponse>(
        `/product-digital-crud/${id}`,
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        digital_product: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to update digital product'
      );
    }
  }
);

// Async thunk to delete digital product
export const deleteDigitalProduct = createAsyncThunk(
  'product-digital-crud/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<DeleteDigitalProductResponse>(
        `/product-digital-crud/${id}`,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        data: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to delete digital product'
      );
    }
  }
);

const digitalProductSlice = createSlice({
  name: 'digitalProduct',
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
      .addCase(createDigitalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDigitalProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createDigitalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to create digital product';
      })
      .addCase(fetchDigitalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDigitalProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.digital_product = action.payload.digital_product;
        // state.digital_product = action.payload.digital_product;
      })
      .addCase(fetchDigitalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch digital product details';
      })
      .addCase(updateDigitialProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDigitialProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateDigitialProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update digital product';
      })
      .addCase(deleteDigitalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDigitalProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteDigitalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to delete digital product';
      });
  },
});

export const { setPage, setPerPage } = digitalProductSlice.actions;
export default digitalProductSlice.reducer;
