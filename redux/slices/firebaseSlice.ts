import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface FirebaseState {
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: FirebaseState = {
    token: null,
    loading: false,
    error: null,
};


export function getDeviceType(): string {
    const platform = navigator.platform || 'Unknown';
    const userAgent = navigator.userAgent || 'Unknown';
    return `${platform} ${/Mobile|Android/.test(userAgent) ? 'Mobile Web' : 'Web'}`;
}


export const registerFirebaseToken = createAsyncThunk(
    'firebase/registerFirebaseToken',
    async (token: string, { rejectWithValue }) => {
        try {
            const device_type = getDeviceType();
            const response = await api.post('/notification-token', { token, device_type });
            return token;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to register token');
        }
    }
);

export const fetchFirebaseToken = createAsyncThunk(
    'firebase/fetchFirebaseToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notification-token');
            const token = response.data?.data?.[0]?.token;
            return token || null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch token');
        }
    }
);

const firebaseSlice = createSlice({
    name: 'firebase',
    initialState,
    reducers: {
        clearFirebaseState: (state) => {
            state.token = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerFirebaseToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerFirebaseToken.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(registerFirebaseToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchFirebaseToken.fulfilled, (state, action: PayloadAction<string | null>) => {
                state.token = action.payload;
            });
    },
});

export const { clearFirebaseState } = firebaseSlice.actions;
export default firebaseSlice.reducer;
