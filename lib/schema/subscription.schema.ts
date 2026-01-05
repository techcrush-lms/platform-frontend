// validators/subscriptionPlan.schema.ts
import Joi from 'joi';
import { ProductStatus, SubscriptionPeriod } from '../utils';
import { SubscriptionPlanBasic } from '@/types/subscription-plan';
import { Product } from '@/types/org';
import { ProductDetails } from '@/types/product';
import {
  OtherCurrencyFormFieldProps,
  OtherCurrencyProps,
} from './product.schema';

// Price schema
export const subscriptionPlanPriceSchema = Joi.object({
  id: Joi.string().optional(), // Only for update
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  period: Joi.string()
    .valid(...Object.values(SubscriptionPeriod))
    .required(),
  other_currencies: Joi.array()
    .items(
      Joi.object({
        currency: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        original_price: Joi.number().min(0).allow(null).optional(), // ✅ allow null
      })
    )
    .optional(),
});

// Role schema
export const subscriptionPlanRoleSchema = Joi.object({
  id: Joi.string().optional(), // Only for update
  title: Joi.string().max(255).required(),
  role_id: Joi.string().required(),
  selected: Joi.boolean().optional(),
});

// Main schema
export const createSubscriptionPlanSchema = Joi.object({
  name: Joi.string().max(255).required(),
  slug: Joi.string().min(2).max(36).required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  description: Joi.string().optional().allow('', null),
  cover_image: Joi.string().uri().max(2048).optional().allow('', null),
  business_id: Joi.string().required(),
  multimedia_id: Joi.string().required(),
  creator_id: Joi.string().required(),
  category_id: Joi.string().required(),
  subscription_plan_prices: Joi.array()
    .items(subscriptionPlanPriceSchema)
    .min(1)
    .required(),
  subscription_plan_roles: Joi.array()
    .items(subscriptionPlanRoleSchema)
    .min(1)
    .required(),
});

// Update schema (fields optional, but structure validated)
export const updateSubscriptionPlanSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  slug: Joi.string().min(2).max(36).optional(),
  category_id: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  cover_image: Joi.string().uri().max(2048).optional().allow('', null),
  multimedia_id: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .required(),
  subscription_plan_prices: Joi.array()
    .items(subscriptionPlanPriceSchema)
    .optional(),
  subscription_plan_roles: Joi.array()
    .items(subscriptionPlanRoleSchema)
    .optional(),
});

export interface SubscriptionPlanPriceProps {
  id?: string; // optional for updates
  price: string | number;
  currency: string; // e.g., 'NGN'
  period: SubscriptionPeriod;
  subscription_plan?: {
    subscriptions: SubscriptionPlanBasic[];
  };
  other_currencies?: OtherCurrencyProps[];
}

export interface SubscriptionPlanRoleProps {
  id?: string; // optional for updates
  title: string;
  role_id: string;
  selected?: boolean;
}

export interface CreateSubscriptionPlanProps {
  name: string;
  slug: string;
  description?: string | null;
  cover_image?: string | null;
  category_id?: string | null;
  business_id: string;
  creator_id: string;
  status?: ProductStatus;
  subscriptions?: SubscriptionPlanBasic[];
  subscription_plan_prices: SubscriptionPlanPriceProps[];
  subscription_plan_roles: SubscriptionPlanRoleProps[];
}

export interface UpdateSubscriptionPlanProps {
  name?: string;
  slug?: string;
  description?: string | null;
  cover_image?: string | null;
  category_id?: string;
  multimedia_id?: string;
  status?: ProductStatus;
  subscription_plan_prices?: SubscriptionPlanPriceProps[];
  subscription_plan_roles?: SubscriptionPlanRoleProps[];
  product?: ProductDetails;
}

export interface PlanPrice {
  id?: string;
  price: number | string;
  period: SubscriptionPeriod;
  other_currencies: OtherCurrencyProps[];
}

export interface PlanPriceProps {
  plan_price_tier: SubscriptionPlanPriceProps;
  periods: SubscriptionPeriod[];
  index: number;
  onPlanPriceTierChange: (
    index: number,
    field: string | keyof PlanPrice,
    value: string | OtherCurrencyFormFieldProps
  ) => void;
  onRemovePlanPriceTier: (index: number) => void;
}

export interface SubscriptionPlanPriceFieldsProps {
  index: number;
  plan_price_tier: SubscriptionPlanPriceProps;
  periods: string[];
  onPlanPriceTierChange: (
    index: number,
    field: keyof SubscriptionPlanPriceProps,
    value: any
  ) => void;
  onOtherCurrencyChange: (
    tierIndex: number,
    currencyIndex: number,
    field: keyof OtherCurrencyProps,
    value: any
  ) => void;
  onRemovePlanPriceTier: (index: number) => void;
}
