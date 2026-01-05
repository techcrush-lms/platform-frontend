import api from '@/lib/api';
import { ScheduleEmailProps } from '@/lib/schema/notification.schema';
import { NotificationType } from '@/lib/utils';
import { GenericResponse } from '@/types';
import {
  InstantNotification,
  InstantNotificationResponse,
  NotificationDetails,
  NotificationDetailsResponse,
  ScheduledNotification,
  ScheduledNotificationResponse,
} from '@/types/notification';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface EmailNotificationState {
  loading: boolean;
  error: string | null;
  instantNotifications: InstantNotification[];
  instantNotificationLoading: boolean;
  scheduledNotifications: ScheduledNotification[];
  scheduledNotificationLoading: boolean;
  countInstantNotifications: number;
  countScheduledNotifications: number;
  notification: NotificationDetails | null;
  notificationLoading: boolean;
  unreadInstantNotifications: number;
}

const initialState: EmailNotificationState = {
  loading: false,
  error: null,
  instantNotifications: [],
  instantNotificationLoading: false,
  scheduledNotifications: [],
  scheduledNotificationLoading: false,
  countInstantNotifications: 0,
  countScheduledNotifications: 0,
  notification: null,
  notificationLoading: false,
  unreadInstantNotifications: 0,
};

// Async Thunk for a single email notification dispatch
export const composeEmail = createAsyncThunk(
  'notification-dispatch/create',
  async (
    credentials: {
      title: string;
      message: string;
      type: NotificationType;
      is_scheduled: boolean;
      recipients: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        '/notification-dispatch/create',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Notification dispatch failed'
      );
    }
  }
);

// Async Thunk for fetching instant notifications
export const fetchInstant = createAsyncThunk(
  'notification-track/instant/:business_id',
  async (
    {
      page,
      limit,
      q,
      startDate,
      endDate,
      type,
      business_id,
    }: {
      page?: number;
      limit?: number;
      q?: string;
      startDate?: string;
      endDate?: string;
      type?: string;
      business_id?: string;
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;
    if (type !== undefined) params['type'] = type;
    try {
      const { data } = await api.get<InstantNotificationResponse>(
        `/notification-track/instant/${business_id}`,
        {
          params,
        }
      );

      return {
        notifications: data.data,
        count: data.count,
        unread_count: data.unread_count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch all instant notifications'
      );
    }
  }
);

//  thunk for marking all as read
export const markAllNotificationsRead = createAsyncThunk(
  'notification-track/mark-all-read',
  async (
    { business_id }: { business_id?: string },
    { rejectWithValue, dispatch }
  ) => {
    const headers: Record<string, any> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      await api.patch(`/notification-track/mark-all-read`, {}, { headers });

      if (business_id) {
        dispatch(
          fetchInstant({
            business_id,
            page: 1,
            limit: 10,
          })
        );
      }

      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark all as read'
      );
    }
  }
);

// thunk for marking a single notification as read
export const markNotificationRead = createAsyncThunk(
  'notification-track/mark-read/:id',
  async (
    {
      id,
      business_id,
    }: {
      id: string;
      business_id?: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const headers: Record<string, any> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      await api.patch(`/notification-track/mark-read/${id}`, {}, { headers });

      // optionally refetch notifications for latest state
      if (business_id) {
        dispatch(
          fetchInstant({
            business_id,
            page: 1,
            limit: 10,
          })
        );
      }

      return { id };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);


// Async Thunk for a scheduled email notification dispatch
export const scheduleEmail = createAsyncThunk(
  'notification-dispatch/schedule',
  async (credentials: ScheduleEmailProps, { rejectWithValue }) => {
    try {
      const response = await api.post(
        '/notification-dispatch/schedule',
        credentials
      );
      const { message } = response.data;
      return { message };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Notification schedule dispatch failed'
      );
    }
  }
);

// Async Thunk for fetching all scheduled notifications
export const fetchScheduled = createAsyncThunk(
  'notification-dispatch/scheduled/:business_id',
  async (
    {
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
    },
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params['q'] = q;
    if (startDate !== undefined) params['startDate'] = startDate;
    if (endDate !== undefined) params['endDate'] = endDate;

    try {
      const { data } = await api.get<ScheduledNotificationResponse>(
        `/notification-track/scheduled/${business_id}`,
        {
          params,
        }
      );

      return {
        notifications: data.data,
        count: data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch all scheduled notifications'
      );
    }
  }
);

// Async Thunk for fetching notification details
export const fetchSingleNotification = createAsyncThunk(
  'notification-track/single/:id',
  async (
    {
      id,
      business_id,
    }: {
      id: string;
      business_id?: string;
    },
    { rejectWithValue }
  ) => {
    const headers: Record<string, any> = {};

    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.get<NotificationDetailsResponse>(
        `/notification-track/single/${id}`,
        {
          headers,
        }
      );

      return {
        notification: data.data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Failed to fetch single notification details'
      );
    }
  }
);

// Async Thunk for deleting a notification record
export const deleteNotification = createAsyncThunk(
  'notification-track/:id',
  async (
    {
      id,
      business_id,
    }: {
      id: string;
      business_id?: string;
    },
    { rejectWithValue }
  ) => {
    const headers: Record<string, any> = {};

    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.delete<GenericResponse>(
        `/notification-track/${id}`,
        {
          headers,
        }
      );

      return {
        message: data.message,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification record'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    viewInstantNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const matchedNotification = state.instantNotifications.find(
        (notification) => notification.id === notificationId
      );

      if (matchedNotification) {
        state.notification = {
          ...matchedNotification,
        } as NotificationDetails;
      } else {
        state.error = 'Notification not found in local state';
      }
    },
    viewScheduledNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const matchedNotification = state.scheduledNotifications.find(
        (notification) => notification.id === notificationId
      );

      if (matchedNotification) {
        state.notification = {
          ...matchedNotification,
        } as NotificationDetails;
      } else {
        state.error = 'Notification not found in local state';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(composeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(composeEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(composeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInstant.pending, (state) => {
        state.instantNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchInstant.fulfilled, (state, action) => {
        state.instantNotificationLoading = false;
        state.instantNotifications = action.payload.notifications;
        state.countInstantNotifications = action.payload.count;
        state.unreadInstantNotifications = action.payload.unread_count;
      })
      .addCase(fetchInstant.rejected, (state, action) => {
        state.instantNotificationLoading = false;
        state.error = action.payload as string;
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.loading = false;
        state.unreadInstantNotifications = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;

        // update local state without full refetch
        const notificationId = action.payload.id;
        const notif = state.instantNotifications.find(n => n.id === notificationId);
        if (notif) {
          notif.read = true; 
        }
        state.unreadInstantNotifications = Math.max(
          state.unreadInstantNotifications - 1,
          0
        );
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(scheduleEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(scheduleEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchScheduled.pending, (state) => {
        state.scheduledNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduled.fulfilled, (state, action) => {
        state.scheduledNotificationLoading = false;
        state.scheduledNotifications = action.payload.notifications;
        state.countScheduledNotifications = action.payload.count;
      })
      .addCase(fetchScheduled.rejected, (state, action) => {
        state.scheduledNotificationLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSingleNotification.pending, (state) => {
        state.scheduledNotificationLoading = true;
        state.error = null;
      })
      .addCase(fetchSingleNotification.fulfilled, (state, action) => {
        state.notificationLoading = false;
        state.notification = action.payload.notification;
      })
      .addCase(fetchSingleNotification.rejected, (state, action) => {
        state.notificationLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { viewInstantNotification, viewScheduledNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
