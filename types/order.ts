import { Payment } from './payment';
import { ProductStatus, ProductType } from '@/lib/utils';

export interface Order {
  id: string;
  user_id: string;
  payment_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  payment: Payment;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_type: string;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  currency: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrdersResponse {
  statusCode: number;
  data: Order[];
  count: number;
}

export interface OrderDetailsResponse {
  statusCode: number;
  data: Order;
}

// Enrolled Course Types
export interface EnrolledCourseModule {
  id: string;
  course_id: string;
  title: string;
  position: number;
  creator_id: string;
  business_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  contents: EnrolledCourseContent[];
}

export interface EnrolledCourseContent {
  id: string;
  title: string;
  module_id: string;
  creator_id: string;
  business_id: string;
  multimedia_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  progress: any[];
  multimedia: {
    id: string;
    url: string;
    creator_id: string;
    business_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    provider: string;
    type: string;
  };
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
    category_id: string;
    creator_id: string;
    title: string;
    description: string;
    keywords: string | null;
    metadata: any | null;
    type: ProductType;
    status: ProductStatus;
    readiness_percent: number | null;
    published_at: string | null;
    archived_at: string | null;
    price: string;
    currency: string;
    original_price: string | null;
    multimedia_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    modules: EnrolledCourseModule[];
    creator: {
      id: string;
      name: string;
      business_info: Array<{
        id: string;
        business_name: string;
        logo_url: string;
      }>;
    };
  };
}

export interface EnrolledCourseResponse {
  statusCode: number;
  data: EnrolledCourseData;
}
