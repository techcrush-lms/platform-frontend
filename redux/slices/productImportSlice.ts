import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { PurchaseItemType } from '@/lib/utils';

interface ImportProduct {
  type: PurchaseItemType;
  title: string;
  description: string;
  price: number;
  [key: string]: any; // For additional fields specific to each product type
}

interface ImportState {
  loading: boolean;
  error: string | null;
  success: boolean;
  importedCount: {
    courses: number;
    tickets: number;
    subscriptions: number;
  };
}

const initialState: ImportState = {
  loading: false,
  error: null,
  success: false,
  importedCount: {
    courses: 0,
    tickets: 0,
    subscriptions: 0,
  },
};

// Async thunk to import products
export const importProducts = createAsyncThunk(
  'products/import',
  async (
    {
      products,
      business_id,
    }: {
      products: ImportProduct[];
      business_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Group products by type
      const courses = products.filter(
        (p) => p.type === PurchaseItemType.COURSE
      );
      const tickets = products.filter(
        (p) => p.type === PurchaseItemType.TICKET
      );
      const subscriptions = products.filter(
        (p) => p.type === PurchaseItemType.SUBSCRIPTION
      );

      const results = {
        courses: 0,
        tickets: 0,
        subscriptions: 0,
      };

      // Import courses
      if (courses.length > 0) {
        const { data: courseData } = await api.post(
          '/product-course-crud/bulk-create',
          { courses },
          {
            headers: {
              'Business-Id': business_id,
            },
          }
        );
        results.courses = courseData.data.length;
      }

      // Import tickets
      // if (tickets.length > 0) {
      //   const { data: ticketData } = await api.post(
      //     '/product-ticket-crud/bulk',
      //     { tickets },
      //     {
      //       headers: {
      //         'Business-Id': business_id,
      //       },
      //     }
      //   );
      //   results.tickets = ticketData.data.length;
      // }

      // Import subscriptions
      // if (subscriptions.length > 0) {
      //   const { data: subscriptionData } = await api.post(
      //     '/subscription-plan/bulk',
      //     { subscriptions },
      //     {
      //       headers: {
      //         'Business-Id': business_id,
      //       },
      //     }
      //   );
      //   results.subscriptions = subscriptionData.data.length;
      // }

      return results;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to import products'
      );
    }
  }
);

const productImportSlice = createSlice({
  name: 'productImport',
  initialState,
  reducers: {
    resetImportState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.importedCount = {
        courses: 0,
        tickets: 0,
        subscriptions: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(importProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.importedCount = action.payload;
      })
      .addCase(importProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to import products';
        state.success = false;
      });
  },
});

export const { resetImportState } = productImportSlice.actions;
export default productImportSlice.reducer;
