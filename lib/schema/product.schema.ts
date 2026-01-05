import Joi from 'joi';
import { EventType, ProductStatus, TicketTierStatus } from '../utils';
import { TicketPurchase } from '@/types/product';

export const CreateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),

  slug: Joi.string().trim().min(2).max(36).required(),

  description: Joi.string().trim().min(10).required(),

  keywords: Joi.string().trim().optional(),

  metadata: Joi.object({
    level: Joi.string()
      .valid('Beginner', 'Intermediate', 'Advanced')
      .required(),
    tags: Joi.array().items(Joi.string().trim()).min(1).required(),
  }).optional(),

  multimedia_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),

  price: Joi.number().min(0).required(),

  original_price: Joi.number().min(0).allow(null).optional(), // ✅ allow null

  category_id: Joi.string()
    .guid({ version: ['uuidv4'] })
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

export interface OtherCurrencyProps {
  currency: string;
  price: number;
  original_price?: number;
}

export interface CreateCourseProps {
  title: string;
  slug: string;
  description: string;
  keywords?: string;
  metadata?: string;
  multimedia_id: string;
  price: number | null;
  original_price: number | null;
  category_id: string;
  other_currencies?: OtherCurrencyProps[];
}

export const UpdateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  slug: Joi.string().trim().min(2).max(36).optional(),
  price: Joi.number().min(0).required(),
  original_price: Joi.number().min(0).allow(null).optional(),
  description: Joi.string().min(10).optional(),
  keywords: Joi.string().allow(null, '').optional(),
  metadata: Joi.object().unknown(true).allow(null).optional(), // if metadata is a JSON object
  category_id: Joi.string().uuid().optional(),
  multimedia_id: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
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
export interface UpdateCourseProps {
  title?: string;
  slug?: string;
  price?: number | null;
  original_price?: number | null;
  description?: string;
  keywords?: string;
  metadata?: string;
  category_id?: string;
  multimedia_id?: string;
  status?: string;
  other_currencies?: OtherCurrencyProps[];
}

export const createModuleContentSchema = Joi.object({
  title: Joi.string().trim().required(),
  position: Joi.number().integer().required(),
  multimedia_id: Joi.string().guid({ version: 'uuidv4' }).required(),
});
export const createModuleWithContentsSchema = Joi.object({
  title: Joi.string().trim().required(),
  position: Joi.number().integer().required(),
  course_id: Joi.string().guid({ version: 'uuidv4' }).required(),
  contents: Joi.array().items(createModuleContentSchema).min(1).required(),
});
export const createMultipleModulesSchema = Joi.object({
  modules: Joi.array().items(createModuleWithContentsSchema).min(1).required(),
});
export interface CreateModulesProps {
  modules: {
    title: string;
    position: number;
    course_id: string;
    contents: { title: string; position: number; multimedia_id: string }[];
  }[];
}

export const updateModuleContentSchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().required(),
  multimedia_id: Joi.string().uuid().required(),
  position: Joi.number().integer().min(1).required(),
});
export const updateModuleSchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().required(),
  position: Joi.number().integer().min(1).required(),
  contents: Joi.array().items(updateModuleContentSchema).required(),
});
export const updateModulesSchema = Joi.object({
  modules: Joi.array().items(updateModuleSchema).required(),
});
export interface UpdateModulesProps {
  modules: {
    id: string;
    title: string;
    position: number;
    course_id: string;
    contents: {
      id: string;
      title: string;
      position: number;
      multimedia_id: string;
    }[];
  }[];
}

// Ticket - Create
export const createTicketTierSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  original_amount: Joi.number().min(0).allow(null).optional(),
  description: Joi.string().optional(),
  quantity: Joi.number().optional(),
  remaining_quantity: Joi.number().optional(),
  max_per_purchase: Joi.number().optional(),
  default_view: Joi.boolean().optional(),
  status: Joi.string()
    .valid(...Object.values(TicketTierStatus))
    .optional(),
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
export const createTicketSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().trim().min(2).max(36).required(),
  description: Joi.string().optional(),
  keywords: Joi.string().optional(),
  metadata: Joi.any().optional(),
  category_id: Joi.string().uuid().required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .uppercase()
    .optional(),
  multimedia_id: Joi.string().uuid().required(),
  event_time: Joi.string().required(),
  event_start_date: Joi.date().required(),
  event_end_date: Joi.date().required(),
  event_location: Joi.string().required(),
  event_type: Joi.string()
    .valid(...Object.values(EventType))
    .uppercase()
    .required(),
  auth_details: Joi.string().optional(),
  ticket_tiers: Joi.array().items(createTicketTierSchema).required(),
});
export interface TicketTierProps {
  id?: string;
  name: string;
  amount: number | null;
  original_amount: number | null;
  description?: string;
  quantity?: number;
  remaining_quantity?: number;
  max_per_purchase?: number;
  default_view?: boolean;
  status?: TicketTierStatus;
  purchased_tickets?: TicketPurchase[];
  other_currencies?: OtherCurrencyProps[];
}
export interface CreateTicketProps {
  title: string;
  slug?: string;
  description?: string;
  keywords?: string;
  metadata?: any;
  category_id: string;
  status?: ProductStatus | null;
  multimedia_id: string;
  event_time: string;
  event_start_date: Date | string | null;
  event_end_date: Date | string | null;
  event_location: string;
  event_type: EventType | null;
  auth_details?: string;
  ticket_tiers: TicketTierProps[];
}

// Ticket - Update
export const updateTicketTierSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  name: Joi.string().max(255).optional(),
  description: Joi.string().optional().allow(null, ''),
  quantity: Joi.number().integer().min(0).optional(),
  remaining_quantity: Joi.number().integer().min(0).optional(),
  max_per_purchase: Joi.number().integer().min(0).optional(),
  amount: Joi.number().precision(2).min(0).optional(),
  original_amount: Joi.number().precision(2).min(0).allow(null).optional(),
  status: Joi.string()
    .valid(...Object.values(TicketTierStatus))
    .optional(),
  default_view: Joi.boolean().optional(),
  deleted: Joi.boolean().optional(),
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
export const updateTicketSchema = Joi.object({
  title: Joi.string().optional(),
  slug: Joi.string().trim().min(2).max(36).optional(),
  description: Joi.string().optional(),
  keywords: Joi.string().allow(null).optional(),
  metadata: Joi.any().optional(),
  category_id: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .uppercase()
    .optional(),
  multimedia_id: Joi.string().uuid().optional(),
  event_time: Joi.string().optional(),
  event_start_date: Joi.date().optional(),
  event_end_date: Joi.date().optional(),
  event_location: Joi.string().optional().allow(null, ''),
  event_type: Joi.string()
    .valid(...Object.values(EventType))
    .optional(),
  auth_details: Joi.string().optional().allow(null, ''),
  ticket_tiers: Joi.array().items(updateTicketTierSchema).optional(),
});
export interface UpdateTicketProps extends Partial<CreateTicketProps> {}

// Digital Product - Create
export const createDigitalProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  slug: Joi.string().trim().min(2).max(36).required(),
  description: Joi.string().trim().min(10).required(),
  category_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  multimedia_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  multimedia_zip_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
  price: Joi.number().min(0).required(),
  original_price: Joi.number().min(0).allow(null).optional(),
  keywords: Joi.string().trim().optional(),
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

export interface CreateDigitalProductProps {
  title: string;
  slug: string;
  description: string;
  category_id: string;
  multimedia_id: string;
  multimedia_zip_id: string;
  status: ProductStatus;
  price: number;
  original_price: number | null;
  keywords?: string;
  other_currencies?: OtherCurrencyProps[];
}

// Digital Product - Update
export const updateDigitalProductSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  slug: Joi.string().trim().min(2).max(36).optional(),
  price: Joi.number().min(0).optional(),
  original_price: Joi.number().min(0).allow(null).optional(),
  description: Joi.string().min(10).optional(),
  keywords: Joi.string().allow(null, '').optional(),
  category_id: Joi.string().uuid().optional(),
  multimedia_id: Joi.string().uuid().optional(),
  multimedia_zip_id: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
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

export interface UpdateDigitalProductProps {
  title?: string;
  slug?: string;
  price?: number;
  original_price?: number | null;
  description?: string;
  keywords?: string;
  category_id?: string;
  multimedia_id?: string;
  multimedia_zip_id?: string;
  status?: ProductStatus;
  other_currencies?: OtherCurrencyProps[];
  details?: PhysicalProductDetailsProps;
}

export interface OtherCurrencyFormFieldProps {
  currencyIndex: number;
  field: string | keyof OtherCurrencyProps;
  value: string;
  defaultCurrency: string;
}

export enum PhysicalProductType {
  PRODUCT = 'product',
  BESPOKE = 'bespoke',
}

export enum PhysicalProductGender {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
}

export const createPhysicalProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  slug: Joi.string().trim().min(2).max(36).required(),
  description: Joi.string().trim().min(10).required(),
  category_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  multimedia_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
  price: Joi.number().min(0).required(),
  original_price: Joi.number().min(0).allow(null).optional(),
  keywords: Joi.string().trim().optional(),
  other_currencies: Joi.array()
    .items(
      Joi.object({
        currency: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        original_price: Joi.number().min(0).allow(null).optional(), // ✅ allow null
      })
    )
    .optional(),
  details: Joi.object({
    sizes: Joi.array().items(Joi.string().trim().min(1)).optional(),

    colors: Joi.array().items(Joi.string().trim().min(1)).optional(),

    location: Joi.string().trim().required(),

    stock: Joi.number().integer().min(0).required(),

    type: Joi.string()
      .valid(...Object.values(PhysicalProductType))
      .optional(),

    gender: Joi.string()
      .valid(...Object.values(PhysicalProductGender))
      .required(),

    estimated_production_time: Joi.number().optional().allow(null),

    min_required: Joi.number().integer().min(0).optional().allow(null),

    multimedia_ids: Joi.array()
      .items(Joi.string().guid({ version: ['uuidv4'] }))
      .optional(),
  }).required(),
});

export interface PhysicalProductDetailsProps {
  sizes?: any[]; // You can replace with Array<{ label: string; value: string }> later
  colors?: any[];
  location: string;
  stock: number | null;
  type?: PhysicalProductType;
  gender: PhysicalProductGender;
  estimated_production_time?: number | null;
  min_required?: number | null;
  multimedia_ids?: string[]; // Multiple media attachments
}

export interface CreatePhysicalProductProps {
  title: string;
  slug: string;
  description: string;
  category_id: string;
  multimedia_id: string;
  status: ProductStatus;
  price: number;
  original_price: number | null;
  keywords?: string;
  other_currencies?: OtherCurrencyProps[];
  details: PhysicalProductDetailsProps;
}

export const updatePhysicalProductSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  slug: Joi.string().trim().min(2).max(36).optional(),
  price: Joi.number().min(0).optional(),
  original_price: Joi.number().min(0).allow(null).optional(),
  description: Joi.string().min(10).optional(),
  keywords: Joi.string().allow(null, '').optional(),
  category_id: Joi.string().uuid().optional(),
  multimedia_id: Joi.string().uuid().optional(),
  multimedia_zip_id: Joi.string().uuid().optional(),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .optional(),
  other_currencies: Joi.array()
    .items(
      Joi.object({
        currency: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        original_price: Joi.number().min(0).allow(null).optional(), // ✅ allow null
      })
    )
    .optional(),
  details: Joi.object({
    sizes: Joi.array().items(Joi.string().trim().min(1)).optional(),

    colors: Joi.array().items(Joi.string().trim().min(1)).optional(),

    location: Joi.string().trim().required(),

    stock: Joi.number().integer().min(0).required(),

    type: Joi.string()
      .valid(...Object.values(PhysicalProductType))
      .optional(),

    measurements: Joi.object().unknown(true).optional(), // Accepts any JSON-like object

    gender: Joi.string()
      .valid(...Object.values(PhysicalProductGender))
      .required(),

    estimated_production_time: Joi.number().optional().allow(null),

    min_required: Joi.number().integer().min(0).optional().allow(null),

    multimedia_ids: Joi.array()
      .items(Joi.string().guid({ version: ['uuidv4'] }))
      .optional(),
  }).optional(),
});

export interface UpdatePhysicalProductProps {
  title?: string;
  slug?: string;
  price?: number;
  original_price?: number | null;
  description?: string;
  keywords?: string;
  category_id?: string;
  multimedia_id?: string;
  multimedia_zip_id?: string;
  status?: ProductStatus;
  other_currencies?: OtherCurrencyProps[];
  details?: PhysicalProductDetailsProps;
}

export interface UpdatePhysicalProductMediaProps {
  multimedia_ids: string[];
}
