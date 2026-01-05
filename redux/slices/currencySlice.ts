import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  BusinessCurrencies,
  BusinessCurrenciesResponse,
  BusinessCurrencyData,
  BusinessCurrencyResponse,
  CurrencyActionResponse,
} from '@/types/currency';

interface CurrencyState {
  currencies: BusinessCurrencies | null;
  store_currencies: BusinessCurrencyData | null;
  currency: string;
  loading: boolean;
  error: string | null;
}

const initialState: CurrencyState = {
  currencies: null,
  store_currencies: null,
  currency: 'NGN',
  loading: true,
  error: null,
};

// Async thunk to fetch business currencies
export const fetchBusinessCurrencies = createAsyncThunk(
  'currency/business-currencies',
  async ({ business_id }: { business_id: string }) => {
    const { data } = await api.get<BusinessCurrenciesResponse>(
      '/currency/business-currencies',
      {
        headers: {
          'Business-Id': business_id,
        },
      }
    );

    return data.data;
  }
);

// Async thunk to toggle business currency
export const toggleBusinessCurrency = createAsyncThunk(
  'currency/toggle-business-currency',
  async (
    { currency, business_id }: { currency: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<CurrencyActionResponse>(
        `/currency/toggle-business-currency`,
        { currency },
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to toggle business currency'
      );
    }
  }
);

// Async thunk to toggle product currency
export const toggleProductCurrency = createAsyncThunk(
  'currency/toggle-product-currency',
  async (
    { currency, business_id }: { currency: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<CurrencyActionResponse>(
        `/currency/toggle-product-currency`,
        { currency },
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to toggle product currency'
      );
    }
  }
);

// Async thunk to fetch store currencies
export const fetchStoreCurrencies = createAsyncThunk(
  'currency/fetch-business-currencies/:business_id',
  async ({ business_id }: { business_id: string }) => {
    const params: Record<string, any> = {};

    if (business_id !== undefined) params['business_id'] = business_id;

    const { data } = await api.get<BusinessCurrencyResponse>(
      `/currency/fetch-business-currencies/${business_id}`
    );

    return data;
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    switchCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchBusinessCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch business currencies';
      })
      .addCase(toggleBusinessCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBusinessCurrency.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currencies?.account) return;

        const details = action.payload.data;

        switch (details.action) {
          case 'removed':
            state.currencies.account = state.currencies.account.filter(
              (accountCurrency) => accountCurrency.currency !== details.currency
            );
            break;

          case 'added':
            if (details.data) {
              state.currencies.account = [
                ...state.currencies.account,
                details.data,
              ];
            }
            break;

          default:
            break;
        }
      })
      .addCase(toggleBusinessCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to toggle business currency';
      })
      .addCase(toggleProductCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductCurrency.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currencies?.product) return;

        const details = action.payload.data;

        switch (details.action) {
          case 'removed':
            state.currencies.product = state.currencies.product.filter(
              (productCurrency) => productCurrency.currency !== details.currency
            );
            break;

          case 'added':
            if (details.data) {
              state.currencies.product = [
                ...state.currencies.product,
                details.data,
              ];
            }
            break;

          default:
            break;
        }
      })
      .addCase(toggleProductCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to toggle product currency';
      })
      .addCase(fetchStoreCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.store_currencies = action.payload.data;
      })
      .addCase(fetchStoreCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch store currencies';
      });
  },
});

export const { switchCurrency } = currencySlice.actions;

export default currencySlice.reducer;
