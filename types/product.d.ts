import { ProductStatus, ProductType, TicketTierStatus } from '@/lib/utils';
import { Media } from './multimedia';
import { Product } from './org';
import {
  OtherCurrencyProps,
  PhysicalProductGender,
  PhysicalProductType,
} from '@/lib/schema/product.schema';

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
  state: string | null;
  country: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Role {
  id: string;
  name: string;
  role_id: string;
  role_group_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RoleBasic {
  name: string;
  role_id: string;
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_identity: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TicketTier {
  id: string;
  ticket_id: string;
  name: string;
  amount: string;
  original_amount: string;
  currency: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  purchased_tickets: TicketPurchase[]; // At most one fetch
  other_currencies: OtherCurrencyProps[];
}

export interface Ticket {
  id: string;
  event_start_date: string;
  event_end_date: string;
  event_location: string;
  event_interface: string;
  ticket_tiers: TicketTier[];
}

export enum Productinterface {
  COURSE = 'COURSE',
  TICKET = 'TICKET',
  DIGITAL_PRODUCT = 'DIGITAL_PRODUCT',
}

// export enum ProductStatus {
//   DRAFT = 'DRAFT',
//   PUBLISHED = 'PUBLISHED',
//   ARCHIVED = 'ARCHIVED',
// }

export interface ProductDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: string | null;
  original_price: string | null;
  currency: string;
  keywords: string | null;
  metadata: any | null;
  status: ProductStatus;
  type: ProductType;
  published_at: string;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  creator: Creator;
  category: Category;
  multimedia: Media;
  ticket: Ticket;
  business_id: string;
  business_info: BusinessInfo;
}

export interface ProductsResponse {
  statusCode: number;
  data: Product[];
  count: number;
}

export interface CreatorBasic {
  id: string;
  name: string;
  role: RoleBasic;
}

export interface CategoryWithCreator {
  id: string;
  name: string;
  creator_id: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  creator: CreatorBasic;
}

export interface CategoryResponse {
  statusCode: number;
  data: CategoryWithCreator[];
  count: number;
}

export interface CreateProductResponse {
  statusCode: number;
  message: string;
  data: ProductDetails;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string; // You can change this to `number` if it's numeric in actual use
  original_price: string; // You can change this to `number` if it's numeric in actual use
  currency: string;
  keywords: string | null;
  metadata: any | null; // Define a specific shape if metadata has a known structure
  status: ProductStatus;
  readiness_percent: number | null;
  published_at: string | null;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  creator: CreatorBasic;
  multimedia: Multimedia;
  category: Category;
  other_currencies: OtherCurrencyProps[];
}

export interface CourseResponse {
  statusCode: number;
  data: Course[];
  count: number;
}

export interface CourseDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  currency: string;
  keywords: string | null;
  metadata: any | null;
  readiness_percent: number | null;
  status: ProductStatus;
  published_at: string | null;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  creator: Creator;
  multimedia: Multimedia;
  category: Category;
  other_currencies: OtherCurrencyProps[];
}

export interface CourseDetailsResponse {
  statusCode: number;
  data: CourseDetails;
}

export interface EnrolledCourse extends Course {
  modules: EnrolledModule[];
  total_duration: string;
}

export interface EnrolledCourseData {
  id: string;
  enrolled_at: string;
  completed_lessons: number;
  total_lessons: number;
  progress: number;
  status: string;
  course_id: string;
  created_at: string;
  updated_at: string;
  course: {
    id: string;
    business_id: string;
    title: string;
    slug: string;
    price: string;
    original_price: string;
    description: string;
    keywords: string | null;
    metadata: any | null;
    status: ProductStatus;
    published_at: string | null;
    archived_at: string | null;
    creator_id: string;
    multimedia_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    modules: Module[];
    creator: {
      id: string;
      name: string;
      business_info: Array<{
        id: string;
        business_name: string;
      }>;
    };
  };
}

export interface EnrolledCourseResponse {
  statusCode: number;
  data: EnrolledCourseData;
}

export interface Module {
  id: string;
  title: string;
  position: number;
  course_id: string;
  creator_id: string;
  business_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: string;
    name: string;
    role: {
      name: string;
      role_id: string;
    };
  };
  course?: {
    id: string;
    business_id: string;
    category_id: string;
    creator_id: string;
    title: string;
    slug: string;
    description: string;
    keywords: string | null;
    metadata: any; // Use a more specific type if known
    type: ProductType;
    status: ProductStatus;
    published_at: string;
    archived_at: string | null;
    price: string;
    original_price: string;
    currency: string;
    original_price: string | null;
    multimedia_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  contents: ModuleContent[];
}

export interface EnrolledModule extends Module {
  is_completed: boolean;
  description?: string;
  duration?: string;
}

export interface ModuleContent {
  id: string;
  title: string;
  module_id: string;
  creator_id: string;
  business_id: string;
  multimedia_id: string;
  multimedia?: Media;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  progress: any[]; // Array of progress data
}

export interface ModuleResponse {
  statusCode: number;
  data: Module[];
  count: number;
}

export interface ViewContentProps {
  contentId: string;
  moduleId: string;
}

export interface UpdateCourseResponse {
  statusCode: number;
  message: string;
  data: Course;
}

// TICKET
export interface TicketTier {
  id: string;
  ticket_id: string;
  name: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: TicketTierStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  currency: string;
  amount: string;
  original_amount: string;
}

export interface Ticket {
  id: string;
  product_id: string;
  event_time?: string;
  event_start_date: string;
  event_end_date: string;
  event_location: string;
  event_type: EventType;
  auth_details: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ticket_tiers: TicketTier[];
  purchased_tickets: TicketPurchase[]; // At most one fetch
}

export interface TicketPurchase {
  id: string;
  user_id: string;
  ticket_id: string;
  ticket_tier_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface TicketProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  keywords: string | null;
  metadata: any;
  status: ProductStatus;
  published_at: string;
  archived_at: string | null;
  price: string;
  original_price: string;
  currency: string;
  multimedia_id: string;
  creator_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  creator: CreatorBasic;
  category: Category;
  multimedia: Media;
  ticket: Ticket;
  business_info: BusinessInfo;
}

export interface TicketProductResponse {
  statusCode: number;
  data: TicketProduct[];
  count: number;
}

export interface TicketDetailsResponse {
  statusCode: number;
  data: TicketProduct;
}

export interface UpdateTicketResponse {
  statusCode: number;
  message: string;
  data: TicketProduct;
}

export interface DeleteTicketTierResponse {
  statusCode: number;
  message: string;
  data: {
    ticket_tier_id: string;
    deleted: boolean;
  };
}

export interface DeleteTicketResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface TicketTierWithTicketAndProduct {
  id: string;
  ticket_id: string;
  name: string;
  slug: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  currency: string;
  amount: string;
  original_amount: string;
  ticket: {
    id: string;
    product_id: string;
    event_time?: string;
    event_start_date: string;
    event_end_date: string;
    event_location: string;
    event_type: string;
    auth_details: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    product: {
      id: string;
      business_id: string;
      category_id: string;
      creator_id: string;
      title: string;
      slug: string;
      description: string;
      keywords: string | null;
      metadata: any;
      type: string;
      status: string;
      readiness_percent: number | null;
      published_at: string;
      archived_at: string | null;
      price: string;
      original_price: string;
      currency: string;
      original_price: string | null;
      multimedia_id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      business_info: BusinessInfo;
      multimedia: Media;
    };
  };
}

// DIGITAL PRODUCT
export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  original_price?: string;
  currency: string;
  keywords: string | null;
  metadata: any | null;
  status: ProductStatus;
  published_at: string | null;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  business_id: string;
  purchased_digital_products: PurchasedDigitalProduct[];
  creator: CreatorBasic;
  multimedia: Media;
  zip_file: Media;
  category: Category;
  business_info: BusinessInfo;
  other_currencies: OtherCurrencyProps[];
}

export interface PurchasedDigitalProduct {
  id: string;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalProductResponse {
  statusCode: number;
  data: DigitalProduct[];
  count: number;
}

export interface DigitalProductDetailsResponse {
  statusCode: number;
  data: DigitalProduct;
}

export interface DeleteDigitalProductResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface UpdateDigitalProductResponse {
  statusCode: number;
  message: string;
  data: DigitalProductDetails;
}

// PHYSICAL PRODUCT
export interface PhysicalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  original_price?: string;
  currency: string;
  keywords: string | null;
  metadata: any | null;
  status: ProductStatus;
  published_at: string | null;
  archived_at: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  business_id: string;
  purchased_physical_products: PurchasedPhysicalProduct[];
  creator: CreatorBasic;
  multimedia: Media;
  zip_file: Media;
  category: Category;
  business_info: BusinessInfo;
  other_currencies: OtherCurrencyProps[];
  physical_product: PhysicalProductDetails;
}

export interface PhysicalProductDetails {
  product_id: string;
  sizes: string[];
  colors: string[];
  location: string;
  stock: number;
  type: PhysicalProductType;
  gender: PhysicalProductGender;
  estimated_production_time: number;
  min_required: number;
  media: PhysicalProductMedia[];
}

export interface PhysicalProductMedia {
  multimedia: Media;
}

export interface PurchasedPhysicalProduct {
  id: string;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface PhysicalProductResponse {
  statusCode: number;
  data: PhysicalProduct[];
  count: number;
}

export interface PhysicalProductDetailsResponse {
  statusCode: number;
  data: PhysicalProduct;
}

export interface DeletePhysicalProductResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface UpdatePhysicalProductResponse {
  statusCode: number;
  message: string;
  data: PhysicalProductDetails;
}
