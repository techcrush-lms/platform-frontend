export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYSTACK = 'PAYSTACK',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
}

export interface CreateCustomerProps {
  business_id: string;
  name: string;
  email: string;
  billing?: CustomerBillingProps;
}

export interface CustomerBillingProps {
  country: string;
  state: string;
  city: string;
  address: string;
  postal_code?: string;
}

export interface CreateInvoicePayload {
  user_id: string;
  coupon_code?: string;

  title: string;

  issued_at: string; // YYYY-MM-DD
  due_at: string; // YYYY-MM-DD

  additional_notes?: string;

  is_vat_applied: boolean;
  vat: number;

  is_coupon_applied: boolean;

  status: InvoiceStatus;
  currency: Currency;

  invoice_items: InvoiceItemPayload[];
  payment_methods: PaymentMethod[];
}

export interface UpdateInvoicePayload extends CreateInvoicePayload {}

export interface InvoiceItemPayload {
  item: string;
  quantity: number;
  amount: number;
}

export interface SendInvoicePayload {
  id: string;
}

export enum RetrievalType {
  RECENT = 'recent',
  ALL = 'all',
  PUBLISHED = 'published',
  DRAFT = 'draft',
  PAID = 'paid',
  UNPAID = 'unpaid',
}
