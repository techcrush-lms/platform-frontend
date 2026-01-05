import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CancelPaymentResponse,
  EarningsDetails,
  Payment,
  PaymentData,
  PaymentDetailsResponse,
  PaymentInitResponse,
  PaymentsResponse,
  QRValidationResponse,
  VerifyPaymentResponse,
} from '@/types/payment';
import {
  CancelPaymentPayload,
  CreatePaymentPayload,
} from '@/lib/schema/payment.schema';
import { GenericResponse } from '@/types';

interface PaymentState {
  payments: Payment[];
  payment: Payment | null;
  payment_qr_details: PaymentData | null;
  payment_qr_message: string;
  total_credit: number;
  total_debit: number;
  total_trx: number;
  details: EarningsDetails | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  createResponse: any;
  verifyResponse: any;
}

const initialState: PaymentState = {
  payments: [],
  payment: null,
  payment_qr_details: null,
  payment_qr_message: '',
  total_credit: 0,
  total_debit: 0,
  total_trx: 0,
  details: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
  createResponse: null,
  verifyResponse: null,
};

// Async thunk to fetch paginated payments
export const fetchPayments = createAsyncThunk(
  'payment/fetch',
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

    const { data } = await api.get<PaymentsResponse>('/payment/fetch', {
      params,
      headers,
    });

    return {
      payments: data.data,
      count: data.count,
      total_credit: data.total_credit,
      total_debit: data.total_debit,
      total_trx: data.total_trx,
      details: data.details,
    };
  }
);

// Async thunk to fetch payment details
export const fetchPayment = createAsyncThunk(
  'payment/fetch/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<PaymentDetailsResponse>(
      `/payment/fetch/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      payment: data.data,
    };
  }
);

// Async thunk to create a payment
export const createPayment = createAsyncThunk(
  'payment/create',
  async (payload: CreatePaymentPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<PaymentInitResponse>(
        '/payment/create',
        payload
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create payment'
      );
    }
  }
);

// Async thunk to cancel a payment
export const cancelPayment = createAsyncThunk(
  'payment/cancel/:payment_id',
  async (payload: CancelPaymentPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<CancelPaymentResponse>(
        `/payment/cancel/${payload.payment_id}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel payment'
      );
    }
  }
);

// Async thunk to verify a payment
export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post<VerifyPaymentResponse>(
        `/payment/verify/${id}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to verify payment'
      );
    }
  }
);

// Async thunk to fetch client payments
export const fetchClientPayments = createAsyncThunk(
  'payment/fetchClient',
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
    if (q !== undefined) params.q = q;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const { data } = await api.get<PaymentsResponse>('/payment/client/fetch', {
      params,
    });

    return {
      payments: data.data,
      count: data.count,
      total_credit: data.total_credit,
      total_debit: data.total_debit,
      total_trx: data.total_trx,
    };
  }
);

// Async thunk to validate the QR code for a (ticket) payment
export const validatePaymentQr = createAsyncThunk(
  'payment/verify-qr-code/:id',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (business_id) headers['Business-Id'] = business_id;

      const { data } = await api.post<QRValidationResponse>(
        `/payment/verify-qr-code/${id}`,
        {},
        { headers }
      );
      return {
        message: data.message,
        data: data.data,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to validate payment Qr code'
      );
    }
  }
);

// Async thunk to send purchase QR code for a (ticket) payment
export const sendPurchaseQr = createAsyncThunk(
  'payment/send-purchase-qr',
  async (
    {
      id,
      business_id,
      tier_id,
    }: { id: string; business_id: string; tier_id: string },
    { rejectWithValue }
  ) => {
    try {
      const headers: Record<string, string> = {};
      if (business_id) headers['Business-Id'] = business_id;

      const { data } = await api.post<GenericResponse>(
        `/payment/send-purchase-qr`,
        { payment_id: id, tier_id },
        { headers }
      );
      return {
        message: data.message,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send purchase qr code'
      );
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.count = action.payload.count;
        state.total_credit = action.payload.total_credit;
        state.total_debit = action.payload.total_debit;
        state.total_trx = action.payload.total_trx;
        state.details = action.payload.details;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch payments';
        state.loading = false;
      })
      .addCase(fetchPayment.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.loading = false;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch payment details';
        state.loading = false;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.createResponse = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyResponse = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClientPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.count = action.payload.count;
        state.total_credit = action.payload.total_credit;
        state.total_debit = action.payload.total_debit;
        state.total_trx = action.payload.total_trx;
      })
      .addCase(fetchClientPayments.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch client payments';
        state.loading = false;
      })
      .addCase(cancelPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelPayment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(validatePaymentQr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validatePaymentQr.fulfilled, (state, action) => {
        state.loading = false;
        state.payment_qr_details = action.payload.data;
        state.payment_qr_message = action.payload.message;
      })
      .addCase(validatePaymentQr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.payment_qr_message = action.payload as string;
      })
      .addCase(sendPurchaseQr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPurchaseQr.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendPurchaseQr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;
