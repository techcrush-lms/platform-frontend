import api from '@/lib/api';
import {
  CreateInvoicePayload,
  InvoiceStatus,
  RetrievalType,
  SendInvoicePayload,
  UpdateInvoicePayload,
} from '@/lib/schema/invoice.schema';
import { GenericResponse, GenericResponseAlt } from '@/types';
import {
  FetchInvoiceDetailsResponse,
  FetchInvoicesResponse,
  Invoice,
} from '@/types/invoice';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InvoiceSlice {
  invoices: Invoice[];
  invoice: Invoice | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;

  createInvoiceData: CreateInvoicePayload | null;
}

const initialState: InvoiceSlice = {
  invoices: [],
  invoice: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,

  createInvoiceData: null,
};

export const fetchInvoices = createAsyncThunk(
  'invoice',
  async ({
    page,
    limit,
    q,
    status,
    paid,
    startDate,
    endDate,
    business_id,
  }: {
    page?: number;
    limit?: number;
    q?: string;
    status?: InvoiceStatus;
    paid?: boolean;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  }) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    if (status !== undefined) params.status = status;
    if (paid !== undefined) params.paid = paid;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<FetchInvoicesResponse>('/invoice', {
      params,
      headers,
    });

    return {
      invoices: data.data,
      count: data.count,
    };
  }
);

// Async thunk to fetch invoice details
export const fetchInvoice = createAsyncThunk(
  'invoice/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<FetchInvoiceDetailsResponse>(
      `/invoice/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      invoice: data.data,
    };
  }
);

// Async thunk to create an invoice
export const createInvoice = createAsyncThunk(
  'invoice/create',
  async (
    {
      payload,
      business_id,
    }: { payload: CreateInvoicePayload; business_id: string },
    { rejectWithValue }
  ) => {
    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.post<GenericResponseAlt<Invoice>>(
        'invoice/create',
        payload,
        { headers }
      );
      return {
        message: data.message,
        data: data.data,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create invoice'
      );
    }
  }
);

// Async thunk to update an invoice
export const updateInvoice = createAsyncThunk(
  'invoice/update/:id',
  async (
    { id, payload }: { id: string; payload: UpdateInvoicePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<GenericResponse>(
        `invoice/update/${id}`,
        payload
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update invoice'
      );
    }
  }
);

// Async thunk to send an invoice
export const sendInvoice = createAsyncThunk(
  'invoice/send',
  async (
    {
      payload,
      business_id,
    }: { payload: SendInvoicePayload; business_id: string },
    { rejectWithValue }
  ) => {
    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.post<GenericResponseAlt<{ id: string }>>(
        'invoice/send',
        payload,
        { headers }
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send invoice'
      );
    }
  }
);

// Async thunk to fetch public invoice details
export const fetchInvoicePublic = createAsyncThunk(
  'invoice/:id/public',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<FetchInvoiceDetailsResponse>(
      `/invoice/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      message: data.message,
      invoice: data.data,
    };
  }
);

// Async thunk to delete invoice
export const deleteInvoice = createAsyncThunk(
  'invoice/:id/delete',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.delete<GenericResponse>(`/invoice/${id}`, {
      params,
      headers,
    });

    return {
      message: data.message,
    };
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    prepareInvoiceData: (
      state,
      action: PayloadAction<CreateInvoicePayload>
    ) => {
      state.createInvoiceData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices;
        state.count = action.payload.count;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch invoices';
        state.loading = false;
      })

      .addCase(fetchInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload.invoice;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch invoice details';
        state.loading = false;
      })

      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload.data;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create invoice';
        state.loading = false;
      })

      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update invoice';
        state.loading = false;
      })

      .addCase(sendInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInvoice.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendInvoice.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update invoice';
        state.loading = false;
      })

      .addCase(fetchInvoicePublic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicePublic.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchInvoicePublic.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to fetch invoice details public';
        state.loading = false;
      })

      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete invoice';
        state.loading = false;
      });
  },
});

export const { prepareInvoiceData } = invoiceSlice.actions;
export default invoiceSlice.reducer;
