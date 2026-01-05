import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
    Withdrawal,
    WithdrawalDetailsResponse,
    WithdrawalsResponse,
    CreateWithdrawalResponse,
} from '@/types/withdrawal';

// ================ STATE ==================

interface WithdrawalState {
    withdrawals: Withdrawal[];
    withdrawal: Withdrawal | null;
    count: number;
    loading: boolean;
    error: string | null;
    createResponse: CreateWithdrawalResponse | null;
}

const initialState: WithdrawalState = {
    withdrawals: [],
    withdrawal: null,
    count: 0,
    loading: false,
    error: null,
    createResponse: null,
};

// ================ THUNKS =================

// Create withdrawal request
export const createWithdrawal = createAsyncThunk(
    'withdrawal/create',
    async (
        { payload, business_id }: { payload: { amount: number; currency: string }; business_id: string },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await api.post<CreateWithdrawalResponse>(
                '/withdraw/request',
                payload,
                {
                    headers: { 'Business-Id': business_id },
                }
            );
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create withdrawal');
        }
    }
);

// Fetch all withdrawals
export const fetchWithdrawals = createAsyncThunk(
    'withdrawal/fetch',
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

        const { data } = await api.get<WithdrawalsResponse>('/withdraw/fetch', {
            params,
            headers,
        });

        return {
            withdrawals: data.data,
            count: data.count,
        };
    }
);


// Fetch single withdrawal details
export const fetchWithdrawal = createAsyncThunk(
    'withdrawal/fetch/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.get<WithdrawalDetailsResponse>(`/withdraw/details/${id}`);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch withdrawal details');
        }
    }
);

// ================ SLICE ==================

const withdrawalSlice = createSlice({
    name: 'withdrawal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createWithdrawal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWithdrawal.fulfilled, (state, action) => {
                state.loading = false;
                state.createResponse = action.payload;
            })
            .addCase(createWithdrawal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch all
            .addCase(fetchWithdrawals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawals.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawals = action.payload.withdrawals;
                state.count = action.payload.count;
            })
            .addCase(fetchWithdrawals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch single
            .addCase(fetchWithdrawal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawal.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawal = action.payload.data;
            })
            .addCase(fetchWithdrawal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default withdrawalSlice.reducer;
