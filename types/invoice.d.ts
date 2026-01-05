// =====================
// Enums
// =====================

import { CouponType, PaymentMethod } from '@/lib/utils';
import { BusinessInfo, User as UserDetails } from './payment';
import { Currency, InvoiceStatus } from '@/lib/schema/invoice.schema';

// =====================
// Root API Response (Fetch Invoices)
// =====================

export interface FetchInvoicesResponse {
  statusCode: number;
  message: string;
  data: Invoice[];
  count: number;
}

// =====================
// Invoice
// =====================

export interface Invoice {
  id: string;
  user_id: string;
  business_id: string;
  invoice_no: string;
  title: string;
  coupon_id: string | null;

  status: InvoiceStatus;

  amount: string;
  subtotal: string;
  discount: string;

  is_vat_applied: boolean;
  vat: string;
  vat_amount: string;

  is_coupon_applied: boolean;
  paid: boolean;

  additional_notes: string | null;

  payment_methods: PaymentMethod[];

  issued_at: string; // ISO date
  due_at: string; // ISO date

  currency: Currency;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  user: UserDetails;
  coupon?: Coupon | null;
  invoice_items: InvoiceItem[];
  invoice_payment_details: InvoicePaymentDetails | null;
  business_info: BusinessInfo;
}

// =====================
// User
// =====================

export interface User {
  id: string;
  name: string;
  email: string;
  profile: string | null;
}

// =====================
// Coupon
// =====================

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;

  creator_id: string;
  business_id: string;

  value: number;
  min_purchase: number;

  usage_limit: number;
  user_limit: number;

  is_active: boolean;

  start_date: string;
  end_date: string;

  currency: Currency;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// =====================
// Invoice Item
// =====================

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  item: string;
  quantity: number;
  amount: string;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// =====================
// Invoice Payment Details
// =====================

export interface InvoicePaymentDetails {
  id: string;
  invoice_id: string;

  account_name: string;
  bank_name: string;
  bank_code: number;
  account_number: string;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// =====================
// Fetch  invoice
// =====================

export interface FetchInvoiceDetailsResponse {
  statusCode: number;
  message: string;
  data: Invoice;
}
