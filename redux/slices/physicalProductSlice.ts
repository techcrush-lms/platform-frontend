import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CreateProductResponse,
  DeleteDigitalProductResponse,
  DeletePhysicalProductResponse,
  DigitalProductDetailsResponse,
  PhysicalProduct,
  PhysicalProductDetailsResponse,
  UpdateDigitalProductResponse,
  UpdatePhysicalProductResponse,
} from '@/types/product';
import {
  CreateDigitalProductProps,
  CreatePhysicalProductProps,
  CreateTicketProps,
  UpdateDigitalProductProps,
  UpdatePhysicalProductMediaProps,
  UpdatePhysicalProductProps,
} from '@/lib/schema/product.schema';
import { GenericResponseAlt } from '@/types';

interface PhysicalProductState {
  physical_products: PhysicalProduct[];
  physical_product: PhysicalProduct | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: PhysicalProductState = {
  physical_products: [],
  physical_product: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to create physical product
export const createPhysicalProduct = createAsyncThunk(
  'product-physical-crud/create',
  async (
    {
      credentials,
      business_id,
    }: { credentials: CreatePhysicalProductProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<GenericResponseAlt<PhysicalProduct>>(
        '/product-physical-crud/create',
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
        error.response?.data || 'Failed to create physical product'
      );
    }
  }
);

// Async thunk to fetch physical product details
export const fetchPhysicalProduct = createAsyncThunk(
  'product-physical-crud/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<PhysicalProductDetailsResponse>(
      `/product-physical-crud/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      physical_product: data.data,
    };
  }
);

// Async thunk to update physical product
export const updatePhysicalProduct = createAsyncThunk(
  'product-physical-crud/:id/update',
  async (
    {
      id,
      credentials,
      business_id,
    }: {
      id: string;
      credentials: UpdatePhysicalProductProps;
      business_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<UpdatePhysicalProductResponse>(
        `/product-physical-crud/${id}`,
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        physical_product: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to update physical product'
      );
    }
  }
);

// Async thunk to update physical product media
export const updatePhysicalProductMedia = createAsyncThunk(
  'product-physical-crud/:product_id/media',
  async (
    {
      product_id,
      credentials,
      business_id,
    }: {
      product_id: string;
      credentials: UpdatePhysicalProductMediaProps;
      business_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<UpdatePhysicalProductResponse>(
        `/product-physical-crud/${product_id}/media`,
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        physical_product: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to update physical product media'
      );
    }
  }
);

// Async thunk to delete physical product
export const deletePhysicalProduct = createAsyncThunk(
  'product-physical-crud/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<DeletePhysicalProductResponse>(
        `/product-physical-crud/${id}`,
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
        error.response?.data || 'Failed to delete physical product'
      );
    }
  }
);

const physicalProductSlice = createSlice({
  name: 'physicalProduct',
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
      .addCase(createPhysicalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPhysicalProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPhysicalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to create physical product';
      })
      .addCase(fetchPhysicalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhysicalProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.physical_product = action.payload.physical_product;
        // state.digital_product = action.payload.digital_product;
      })
      .addCase(fetchPhysicalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch physical product details';
      })
      .addCase(updatePhysicalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePhysicalProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePhysicalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update physical product';
      })
      .addCase(updatePhysicalProductMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePhysicalProductMedia.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePhysicalProductMedia.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update physical product media';
      })
      .addCase(deletePhysicalProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePhysicalProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePhysicalProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to delete physical product';
      });
  },
});

export const { setPage, setPerPage } = physicalProductSlice.actions;
export default physicalProductSlice.reducer;
