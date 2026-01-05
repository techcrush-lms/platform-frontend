import Joi from 'joi';
import { OtherCurrencyProps } from './product.schema';

export const createShippingLocationSchema = Joi.object({
  title: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  price: Joi.number().required(),
  other_currencies: Joi.array()
    .items(
      Joi.object({
        currency: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        original_price: Joi.number().min(0).allow(null).optional(), // ✅ allow null
      })
    )
    .optional(),
  arrival_time: Joi.number().required(),
});

export interface CreateShippingLocationProps {
  title: string;
  country: string;
  state: string;
  city: string;
  address: string;
  price: number | null;
  other_currencies: OtherCurrencyProps[];
  arrival_time: number | null;
}

export const UpdateShippingLocationSchema = Joi.object({
  title: Joi.string().optional(),
  country: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  price: Joi.string().optional(),
  other_currencies: Joi.array()
    .items(
      Joi.object({
        currency: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        original_price: Joi.number().min(0).allow(null).optional(), // ✅ allow null
      })
    )
    .optional(),
  arrival_time: Joi.number().optional(),
});

export interface UpdateShippingLocationProps {
  title?: string;
  country?: string;
  state?: string;
  city?: string;
  price?: number | null;
  other_currencies?: OtherCurrencyProps[];
  arrival_time?: number | null;
}
