import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ProductType } from '@/lib/utils';
import { Cart, CartResponse } from '@/types/cart';
import { GenericResponse } from '@/types';

interface CartState {
  cart: Cart | null;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  count: 0,
  loading: false,
  error: null,
};

// Add to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    {
      product_id,
      quantity,
      product_type,
      ticket_tier_id,
      currency,
    }: {
      product_id: string;
      quantity: number;
      product_type: ProductType;
      ticket_tier_id?: string;
      currency?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<GenericResponse>('/cart/add', {
        product_id,
        quantity,
        product_type,
        ticket_tier_id,
        currency,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

// Fetch cart items
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ currency }: { currency: string }, { rejectWithValue }) => {
    const params: Record<string, any> = {};

    if (currency) params['currency'] = currency;

    try {
      const response = await api.get<CartResponse>('/cart', {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

// Remove from cart
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<GenericResponse>(`/cart/item/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove cart item'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    emptyCart: (state) => {
      state.cart = null;
      state.count = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<GenericResponse>) => {
          state.loading = false;
          // Optionally update state.items if API returns updated cart
        }
      )
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartResponse>) => {
          state.loading = false;
          state.cart = action.payload.data || [];
          state.count = action.payload.count;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove the item from state.cart.items if needed
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
