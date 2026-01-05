import { DocFormat } from '@/lib/schema/org.schema';
import {
  BusinessOwnerOrgRole,
  ContactInviteStatus,
  Gender,
  OnboardingProcess,
} from '@/lib/utils';
import { SubscriptionPlan } from './subscription-plan';
import { Ticket } from './product';
import { OtherCurrencyProps } from '@/lib/schema/product.schema';

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string;
  business_slug: string;
  business_size: 'small' | 'medium' | 'large' | string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  social_media_handles: { handle: string; link: string }[];
  country_code: string;
  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
}

export interface BusinessProfileResponse {
  statusCode: number;
  data: BusinessProfileFull[];
}

export interface BusinessProfileFull {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string;
  business_slug: string;
  social_media_handles: { handle: string; link: string }[];
  business_size: 'small' | 'medium' | 'large' | string;
  business_slug: string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  kyc: KYC[];
  onboarding_status: {
    onboard_processes: string[] | null;
    current_step: number;
    is_completed: boolean;
  };
  business_wallet: BusinessWallet[];
  withdrawal_account: WithdrawalAccount;
}

export interface BusinessWallet {
  balance: string;
  previous_balance: string;
  currency_url: string;
  currency: string;
}

export interface KYC {
  id: string;
  business_id: string;
  user_id: string | null;
  doc_front: string;
  doc_back: string;
  utility_doc: string;
  location: string;
  state: string | null;
  city: string;
  country: string;
  country_code: string;
  id_type: string;
  is_approved: boolean;
  disapproval_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface WithdrawalAccount {
  id: string;
  business_id: string;
  account_number: string;
  account_type: string; // e.g., "Savings Bank"
  bank_name: string;
  routing_number: string | null;
  recipient_code: string;
  country: string; // e.g., "Nigeria"
  country_code: string; // e.g., "NG"
  currency: string; // e.g., "NGN"
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  deleted_at: string | null;
}

export interface BusinessProfileFullReponse {
  statusCode: number;
  message: string;
  data: BusinessProfileFull;
}

export interface UserProfile {
  id: string; // UUID format
  user_id: string; // UUID format
  profile_picture: string; // URL
  address: string;
  bio: string;
  date_of_birth: string; // ISO 8601 date string
  gender: Gender;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  deleted_at: string | null; // ISO 8601 datetime or null
  country: string;
  state: string | null;
  country_code: string; // ISO 2-letter country code
}

export interface ContactUser {
  id: string; // UUID format
  role: {
    name: string;
    role_id: string;
  };
  profile: UserProfile | null;
}

export interface ContactInvite {
  id: string; // UUID format
  name: string;
  email: string;
  is_owner: boolean;
  user: ContactUser | null;
  business: BusinessProfile;
  token: string | null;
  status: ContactInviteStatus; // Assuming possible status values
  expires_at: string | null; // ISO date string or null
  created_at: string; // ISO date string
}

export interface ContactInviteResponse {
  statusCode: number;
  data: ContactInvite[];
  count: number;
}

export interface ContactInviteDetailsResponse {
  statusCode: number;
  data: ContactInvite;
}

export interface ExportUserDetails {
  download_url: string;
  total: number;
  format: DocFormat;
  role_filter: BusinessOwnerOrgRole;
  file_name: string;
}

export interface ExportUserResponse {
  statusCode: number;
  message: string;
  data: ExportUserDetails;
}

export interface SubscriptionPlanPrice {
  id: string;
  subscription_plan_id: string;
  price: string; // Could be number if converted
  currency: Currency; // Consider using enum like 'NGN' | 'USD' | 'EUR'
  creator_id: string;
  period: 'monthly' | 'yearly' | string; // Add other possible periods if needed
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  deleted_at: string | null; // ISO 8601 date string
  subscription_plan: SubscriptionPlan;
  other_currencies: OtherCurrencyProps[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string; // Could be number if you convert it
  original_price: string; // Could be number if you convert it
  currency: string; // Consider using a union type like 'NGN' | 'USD' | 'EUR' if you know possible values
  keywords: string[] | null; // Assuming keywords would be an array if present
  metadata: Record<string, unknown> | null; // Generic metadata object
  status: ProductStatus; // Common status types
  type: ProductType; // Example types, adjust as needed
  published_at: string | null; // ISO 8601 date string
  archived_at: string | null; // ISO 8601 date string
  creator_id: string;
  created_at: string; // Date string (note the format differs from ISO in your example)
  business_info?: BusinessInfo | null;
  creator: {
    id: string;
    name: string;
    role: {
      name: string;
      role_id: string; // Consider using specific role IDs if they're standardized
    };
  };
  category: {
    id: string;
    name: string;
    creator_id: string;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
    deleted_at: string | null; // ISO 8601 date string
  };
  multimedia: {
    id: string;
    url: string;
    creator_id: string;
    business_id: string;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
    deleted_at: string | null; // ISO 8601 date string
    provider: MediaProvider; // Example providers
    type: MediaType; // Media types
  };
  ticket: null | Ticket;
  subscription_plan: null | SubscriptionPlan;
  modules: CourseModule[];
}

// Multimedia type
export type MultimediaType = 'VIDEO' | 'IMAGE';

// Multimedia object
export interface Multimedia {
  type: MultimediaType;
}

// Content inside a module
export interface ModuleContent {
  id: string;
  title: string;
  multimedia: Multimedia;
}

// Module object
export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  position: number;
  creator_id: string;
  business_id: string;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  deleted_at: string | null;
  contents: ModuleContent[];
}

export interface TicketTier {
  id: string;
  ticket_id: string;
  name: string;
  description: string | null;
  quantity: number;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: TicketStatus;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  deleted_at: string | null; // ISO 8601 date string
  currency: Currency; // Reusing the Currency enum from previous example
  amount: string; // Could be number if converted
  original_amount: string; // Could be number if converted
}

export interface ContactRole {
  id: string;
  name: string;
  role_group_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  role_id: string;
  deleted_at: string | null;
}

export interface ContactProfile {
  id: string;
  user_id: string;
  profile_picture: string | null;
  address: string | null;
  bio: string | null;
  date_of_birth: string | null; // ISO string
  gender: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  country: string | null;
  state: string | null;
  country_code: string | null;
}

export interface ContactInfo {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string; // timestamp
  updated_at: string; // timestamp
  role: Role;
  profile?: Profile;
}

export interface ContactInfoResponse {
  statusCode: number;
  data: ContactInfo[];
  count: number;
}

export interface BusinessProps {
  business_id: string;
}

export interface UpdateOnboardingProcessResponse {
  statusCode: number;
  message: string;
  data: OnboardProcess;
}

export interface OnboardProcess {
  onboard_processes: OnboardingProcess[];
}
