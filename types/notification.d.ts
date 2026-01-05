import { NotificationType } from '@/lib/utils';
import { Payment } from './payment';

export interface Business {
  id: string;
  business_name: string;
  user: { id: true; name: true };
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
}

export type ScheduleInfo = {
  id: string;
  notification_id: string;
  scheduled_time: string; // ISO 8601 format
  status: NotificationStatus; // extend this union as needed
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  recipients: NotificationRecipient[];
};

export interface NotificationRecipientUserDetails {
  id: string;
  name: string;
  email: string;
}

export interface NotificationRecipient {
  id: string;
  scheduled_notification_id: string;
  user_id: string;
  device_id: string;
  received_at: string;
  status: NotificationStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: NotificationRecipientUserDetails;
}

export interface InstantNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean; 
  icon_url?: string | null; 
  status: boolean;
  is_scheduled: boolean;
  business_id: string | null;
  created_at: string;
  business: {
    id: string;
    business_name: string;
    user: {
      id: string;
      name: string;
    };
  } | null;
  recipients: NotificationRecipientUserDetails[];
  schedule_info?: any | null; 
  owner: {
    id: string;
    name: string;
    email: string;
    role: {
      role_id: string;
    };
    profile: {
      id: string;
      user_id: string;
      profile_picture: string;
      address: string;
      bio: string;
      date_of_birth: string;
      gender: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      country: string;
      state: string | null;
      country_code: string;
    };
  } | null; // 👈 make owner nullable
}


export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType; // extend as needed
  status: boolean;
  is_scheduled: boolean;
  business_id: string | null;
  created_at: string;
  business: Business | null; // adjust if business structure is known
  schedule_info: ScheduleInfo | null;
  owner: {
    id: string;
    name: string;
    email: string;
    role: {
      role_id: string;
    };
    profile: {
      id: string;
      user_id: string;
      profile_picture: string;
      address: string;
      bio: string;
      date_of_birth: string;
      gender: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      country: string;
      state: string | null;
      country_code: string;
    };
  };
}

export interface InstantNotificationResponse {
  statusCode: number;
  data: InstantNotification[];
  count: number;
  unread_count: number;
}

export interface ScheduledNotificationResponse {
  statusCode: number;
  data: ScheduledNotification[];
  count: number;
}

export interface BusinessContactDetails {
  id: boolean;
  business_id: boolean;
  is_owner: boolean;
  joined_at: boolean;
  joined_via: string;
  status: boolean;
  role: boolean;
  created_at: boolean;
  business: {
    id: string;
    business_name: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  payments: Payment[];
  business_contacts: BusinessContactDetails[];
  created_at: string; // ISO string
  updated_at: string; // ISO string
  role: Role;
  profile: Profile | null;
  total_expenses: number;
}

export interface CustomersResponse {
  statusCode: number;
  data: Customer[];
  count: number;
}

export interface NotificationDetails extends InstantNotification {
  schedule_info: ScheduleInfo;
}

export interface NotificationDetailsResponse {
  statusCode: number;
  data: NotificationDetails;
}

export interface CustomerDetailsResponse {
  statusCode: number;
  data: Customer;
}
