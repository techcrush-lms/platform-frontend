import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  Order,
  OrdersResponse,
  OrderDetailsResponse,
  EnrolledCourseData,
  EnrolledCourseResponse,
} from '@/types/order';

interface OrderState {
  orders: Order[];
  order: Order | null;
  enrolledCourse: EnrolledCourseData | null;
  count: number;
  loading: boolean;
  enrolledCourseLoading: boolean;
  progressUpdateLoading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  enrolledCourse: null,
  count: 0,
  loading: false,
  enrolledCourseLoading: false,
  progressUpdateLoading: false,
  error: null,
  currentPage: 1,
};

// Async thunk to fetch paginated orders
export const fetchOrders = createAsyncThunk(
  'order/fetch',
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

    const { data } = await api.get<OrdersResponse>('/order/fetch', {
      params,
      headers,
    });

    return {
      orders: data.data,
      count: data.count,
    };
  }
);

// Async thunk to fetch order details
export const fetchOrder = createAsyncThunk(
  'order/fetch/:id',
  async ({ id, business_id }: { id: string; business_id?: string }) => {
    const params: Record<string, any> = {};

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    const { data } = await api.get<OrderDetailsResponse>(`/order/fetch/${id}`, {
      params,
      headers,
    });

    return {
      order: data.data,
    };
  }
);

// Async thunk to fetch enrolled course details
export const fetchEnrolledCourse = createAsyncThunk(
  'enrolled-course/course/:courseId',
  async ({ id }: { id: string }) => {
    const { data } = await api.get<EnrolledCourseResponse>(
      `/enrolled-course/course/${id}`
    );

    return {
      enrolledCourse: data.data,
    };
  }
);

// Async thunk to update course progress
export const updateCourseProgress = createAsyncThunk(
  'enrolled-course/:content_id',
  async ({ content_id }: { content_id: string }) => {
    const { data } = await api.patch(`/enrolled-course/${content_id}`);

    return {
      message: data.message,
    };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateCourseProgressValue: (
      state,
      action: {
        payload: { progress: number; contentId: string; isCompleted: boolean };
      }
    ) => {
      if (state.enrolledCourse) {
        state.enrolledCourse.progress = action.payload.progress;

        // Update the specific content's progress
        state.enrolledCourse.course?.modules?.forEach((module) => {
          module.contents?.forEach((content) => {
            if (content.id === action.payload.contentId) {
              if (action.payload.isCompleted) {
                // Add progress entry if not already exists
                if (!content.progress || content.progress.length === 0) {
                  content.progress = [
                    {
                      id: Date.now().toString(),
                      user_id: '', // Will be set by backend
                      course_id: state.enrolledCourse?.course_id || '',
                      module_content_id: content.id,
                      completed_at: new Date().toISOString(),
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      deleted_at: null,
                    },
                  ];
                }
              } else {
                // Remove progress entry
                content.progress = [];
              }
            }
          });
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.count = action.payload.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch orders';
        state.loading = false;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch order details';
        state.loading = false;
      })
      .addCase(fetchEnrolledCourse.pending, (state) => {
        state.enrolledCourseLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourse.fulfilled, (state, action) => {
        state.enrolledCourseLoading = false;
        state.enrolledCourse = action.payload.enrolledCourse;
      })
      .addCase(fetchEnrolledCourse.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to fetch enrolled course details';
        state.enrolledCourseLoading = false;
      })
      .addCase(updateCourseProgress.pending, (state) => {
        state.progressUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.progressUpdateLoading = false;
        // Optionally update the enrolled course data if needed
        // You can dispatch fetchEnrolledCourse here if you want to refresh the data
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to update course progress';
        state.progressUpdateLoading = false;
      });
  },
});

export const { updateCourseProgressValue } = orderSlice.actions;
export default orderSlice.reducer;
