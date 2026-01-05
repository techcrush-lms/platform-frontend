// 1. currency/business-currencies
export interface BusinessCurrenciesResponse {
  statusCode: number;
  data: BusinessCurrencies;
}

export interface BusinessCurrencies {
  system: SystemConfig[];
  account: Account[];
  product: Product[];
}

export interface SystemConfig {
  id: string;
  currency: string; // e.g., "GBP" | "NGN" | "USD"
  charge: string; // could also be number if parsed
  additional_flat_amount: string; // could also be number if parsed
  creator_id: string | null;
  enabled: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null;
}

export interface Account {
  id: string;
  business_id: string;
  currency: string;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Product {
  id: string;
  business_id: string;
  currency: string;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CurrencyDetails {
  id: string;
  business_id: string;
  currency: string;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// 2 & 3. currency/toggle-business-currency or /currency/toggle-product-currency
export interface CurrencyActionResponse {
  statusCode: number;
  message: string;
  data: CurrencyActionData;
}

export interface CurrencyActionData {
  action: 'removed' | 'added' | 'updated'; // extendable for other cases
  currency: string; // could also be narrowed to a union if known (e.g., "NGN" | "USD" | "GBP")
  data: CurrencyDetails;
}

// 4. /fetch-business-currencies/:business_id
export interface BusinessAccountCurrenciesResponse {
  statusCode: number;
  message: string;
  data: BusinessAccountCurrenciesData;
}

export interface BusinessAccountCurrenciesData {
  details: BusinessCurrencyDetail[];
  currencies: string[]; // could be narrowed to union type if currencies are fixed
}

export interface BusinessCurrencyDetail {
  id: string;
  currency: string; // e.g., "GBP" | "NGN"
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// 5. /fetch-business-currencies/:business_id
export interface BusinessCurrency {
  id: string;
  currency: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface BusinessCurrencyData {
  details: BusinessCurrency[];
  currencies: string[];
}

export interface BusinessCurrencyResponse {
  statusCode: number;
  message: string;
  data: BusinessCurrencyData;
}
