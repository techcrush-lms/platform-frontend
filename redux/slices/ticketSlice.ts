import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CreateProductResponse,
  DeleteTicketResponse,
  DeleteTicketTierResponse,
  TicketDetailsResponse,
  TicketProduct,
  TicketProductResponse,
  UpdateTicketResponse,
} from '@/types/product';
import {
  CreateTicketProps,
  UpdateTicketProps,
} from '@/lib/schema/product.schema';

interface TicketState {
  tickets: TicketProduct[];
  ticket: TicketProduct | null;
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: TicketState = {
  tickets: [],
  ticket: null,
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to create ticket
export const createTicket = createAsyncThunk(
  'product-ticket-crud/create',
  async (
    {
      credentials,
      business_id,
    }: { credentials: CreateTicketProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post<CreateProductResponse>(
        '/product-ticket-crud/create',
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
      // console.log(error);
      return rejectWithValue(error.response?.data || 'Failed to create ticket');
    }
  }
);

// Async thunk to fetch paginated tickets
export const fetchTickets = createAsyncThunk(
  'product-ticket-crud',
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

    const { data } = await api.get<TicketProductResponse>(
      '/product-ticket-crud',
      {
        params,
        headers,
      }
    );

    return {
      tickets: data.data,
      count: data.count,
    };
  }
);

// Async thunk to fetch ticket details
export const fetchTicket = createAsyncThunk(
  'product-ticket-crud/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<TicketDetailsResponse>(
      `/product-ticket-crud/${id}`,
      {
        params,
        headers,
      }
    );

    return {
      ticket: data.data,
    };
  }
);

// Async thunk to update ticket
export const updateTicket = createAsyncThunk(
  'product-ticket-crud/:id/update',
  async (
    {
      id,
      credentials,
      business_id,
    }: { id: string; credentials: UpdateTicketProps; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.patch<UpdateTicketResponse>(
        `/product-ticket-crud/${id}`,
        credentials,
        {
          headers: {
            'Business-Id': business_id,
          },
        }
      );

      return {
        message: data.message,
        ticket: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update ticket');
    }
  }
);

// Async thunk to delete ticket tier
export const deleteTicketTier = createAsyncThunk(
  'product-ticket-crud/remove-tier/:ticket_tier_id',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<DeleteTicketTierResponse>(
        `/product-ticket-crud/remove-tier/${id}`,
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
        error.response?.data || 'Failed to delete ticket tier'
      );
    }
  }
);

// Async thunk to delete ticket
export const deleteTicket = createAsyncThunk(
  'product-ticket-crud/:id/delete',
  async (
    { id, business_id }: { id: string; business_id: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.delete<DeleteTicketResponse>(
        `/product-ticket-crud/${id}`,
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
      return rejectWithValue(error.response?.data || 'Failed to delete ticket');
    }
  }
);

const productSlice = createSlice({
  name: 'ticket',
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
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create ticket';
      })
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.count = action.payload.count;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tickets';
      })
      .addCase(fetchTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.ticket = action.payload.ticket;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ticket details';
      })
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update ticket';
      })
      .addCase(deleteTicketTier.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTicketTier.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTicketTier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete ticket tier';
      })
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete ticket';
      });
  },
});

export const { setPage, setPerPage } = productSlice.actions;
export default productSlice.reducer;
