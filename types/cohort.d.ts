export interface Cohort {
  id: string;
  name: string;
  cohort_number: string;
  description: string | null;
  cohort_month: string;
  cohort_year: string;
  group_link: string;
  creator_id: string;
  created_at: Date;
  updated_at: Date;
  multimedia: Multimedia | null;
  creator: Creator;
}

export interface Multimedia {
  id: string;
  url: string;
  creator_id: string;
  business_id: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: string | null;
  provider: MediaProvider;
  type: MediaType;
}

export interface Creator {
  id: string;
  name: string;
  role: Role;
}

export interface Role {
  name: string;
  role_id: string;
}

export type MediaProvider = 'CLOUDINARY' | 'AWS';
export type MediaType = 'IMAGE' | 'VIDEO';

export interface FetchCohortsResponse {
  statusCode: number;
  data: Cohort[];
  count: number;
}

export interface FetchCohortResponse {
  statusCode: number;
  data: Cohort;
}
