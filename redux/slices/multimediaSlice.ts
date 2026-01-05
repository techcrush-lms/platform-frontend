import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  MediaDetails,
  MediaDetailsResponse,
  UploadMediaResponse,
} from '@/types/multimedia';
import { AxiosProgressEvent } from 'axios';

interface MultimediaState {
  multimedia: MediaDetails[];
  count: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
}

// Initial state
const initialState: MultimediaState = {
  multimedia: [],
  count: 0,
  loading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated multimedia
export const fetchAllMultimedia = createAsyncThunk(
  'multimedia/fetch-all',
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
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;
    if (business_id !== undefined) params['business_id'] = business_id;

    const { data } = await api.get<MediaDetailsResponse>(
      '/multimedia/fetch-all',
      {
        params,
      }
    );

    return {
      multimedia: data.data,
      count: data.count,
    };
  }
);

export const uploadImage = createAsyncThunk(
  'multimedia-upload/image',
  async ({
    form_data,
    business_id,
    onUploadProgress,
  }: {
    form_data: FormData;
    business_id?: string;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }) => {
    const headers: Record<string, any> = {
      'Content-Type': 'multipart/form-data',
    };

    if (business_id !== undefined) {
      headers['Business-Id'] = business_id;
    }

    const { data } = await api.post<UploadMediaResponse>(
      '/multimedia-upload/image',
      form_data,
      {
        headers,
        onUploadProgress, // ✅ correctly typed now
      }
    );

    return {
      multimedia: data.data,
    };
  }
);

export const uploadVideo = createAsyncThunk(
  'multimedia-upload/video',
  async ({
    form_data,
    business_id,
  }: {
    form_data: FormData;
    business_id?: string;
  }) => {
    const headers: Record<string, any> = {
      'Content-Type': 'multipart/form-data',
    };

    if (business_id !== undefined) {
      headers['Business-Id'] = business_id;
    }

    const { data } = await api.post<UploadMediaResponse>(
      '/multimedia-upload/video',
      form_data,
      { headers }
    );

    return {
      multimedia: data.data,
    };
  }
);

export const uploadDocument = createAsyncThunk(
  "multimedia-upload/document",
  async ({
    form_data,
    business_id,
    onUploadProgress,
  }: {
    form_data: FormData;
    business_id?: string;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }) => {
    const headers: Record<string, any> = {
      "Content-Type": "multipart/form-data",
    };

    if (business_id !== undefined) {
      headers["Business-Id"] = business_id;
    }

    const { data } = await api.post<UploadMediaResponse>(
      "/multimedia-upload/document",
      form_data,
      {
        headers,
        onUploadProgress,
      }
    );

    return {
      multimedia: data.data,
    };
  }
);

export const uploadRawDocument = createAsyncThunk(
  'multimedia-upload/raw-document',
  async ({
    form_data,
    business_id,
  }: {
    form_data: FormData;
    business_id?: string;
  }) => {
    const headers: Record<string, any> = {
      'Content-Type': 'multipart/form-data',
    };

    if (business_id !== undefined) {
      headers['Business-Id'] = business_id;
    }

    const { data } = await api.post<UploadMediaResponse>(
      '/multimedia-upload/raw-document',
      form_data,
      { headers }
    );

    return {
      multimedia: data.data,
    };
  }
);

const multimediaSlice = createSlice({
  name: 'multimedia',
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
      .addCase(fetchAllMultimedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMultimedia.fulfilled, (state, action) => {
        state.loading = false;
        state.multimedia = action.payload.multimedia;
        state.count = action.payload.count;
      })
      .addCase(fetchAllMultimedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch multimedia';
      })
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload images';
      })
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload document';
      })
      .addCase(uploadRawDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadRawDocument.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadRawDocument.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to upload raw/zip document';
      })
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload video';
      });
  },
});

export const { setPage, setPerPage } = multimediaSlice.actions;
export default multimediaSlice.reducer;
