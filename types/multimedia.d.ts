import { MultimediaProvider, MultimediaType } from '@/lib/utils';

export interface Media {
  id: string;
  url: string;
  type: MultimediaType; // Adjust if there are other types
  creator_id: string;
  business_id: string;
  provider: MultimediaProvider; // Adjust based on possible providers
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
}

export interface Role {
  name: string;
  role_id: string;
}

export interface Creator {
  id: string;
  name: string;
  role: Role;
}

export interface BusinessInfo {
  id: string;
  user_id: string;
  business_name: string;
  business_size: string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  country: string;
  state: string | null;
  country_code: string;
}

export interface MediaDetails {
  id: string;
  url: string;
  type: MultimediaType;
  provider: MultimediaProvider;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator: Creator;
  business_id: string;
  business_info?: BusinessInfo;
}

export interface MediaDetailsResponse {
  statusCode: number;
  data: MediaDetails[];
  count: number;
}

export interface UploadMediaResponse {
  statusCode: number;
  message: string;
  data: MediaDetails;
}

export interface UploadDocumentResponse {
  statusCode: number;
  message: string;
  data: MediaDetails[];
}
