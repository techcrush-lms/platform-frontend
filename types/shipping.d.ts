import { OtherCurrencyProps } from '@/lib/schema/product.schema';

export interface ShippingResponse<T> {
  statusCode: number;
  data: T[];
  count: number;
}

export interface ShippingLocation {
  id: string;
  title: string;
  country: string;
  state: string;
  address: string;
  city: string;
  price: string;
  currency: string;
  other_currencies: OtherCurrencyProps[];
  arrival_time: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  business_id: string;
  user: User;
  business: Business;
  payments: Array<{ id: string }>;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface UserRole {
  name: string;
  role_id: string;
}

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  business_size: string;
  business_slug: string;
  business_description: string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string | null;
  scope: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  country: string;
  state: string;
  country_code: string;
  social_media_handles: SocialMediaHandle[];
  enable_special_offer: boolean;
}

export interface SocialMediaHandle {
  link: string;
  handle: string;
}

// Create Shipping location
export interface CreateShippingLocationResponse {
  statusCode: number;
  message: string;
  data: ShippingLocation;
}

// Fetch Shipping location details
export interface FetchShippingDetailsResponse {
  statusCode: number;
  data: ShippingLocation;
}

// Update Shipping location details
export interface UpdateShippingDetailsResponse {
  statusCode: number;
  message: string;
  data: ShippingLocation;
}

// Delete Shipping location details
export interface DeleteShippingDetailsResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}
