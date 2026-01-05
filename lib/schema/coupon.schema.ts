import Joi from 'joi';
import { CouponType } from '../utils';

export const createCouponSchema = Joi.object({
  business_id: Joi.string().trim().required().label('Business ID'),

  code: Joi.string().trim().required().label('Coupon Code'),

  type: Joi.string()
    .valid(...Object.values(CouponType))
    .required()
    .label('Type'),

  value: Joi.number().positive().required().label('Value'),

  start_date: Joi.date().iso().required().label('Start Date'),

  end_date: Joi.date()
    .iso()
    .greater(Joi.ref('start_date'))
    .required()
    .label('End Date'),

  usage_limit: Joi.number().integer().min(1).required().label('Usage Limit'),

  user_limit: Joi.number().integer().min(1).required().label('User Limit'),

  min_purchase: Joi.number().min(0).required().label('Minimum Purchase'),
});

export interface CreateCouponProps {
  business_id: string;
  code: string;
  type: CouponType | null;
  value: number | null;
  start_date: string; // ISO 8601 format
  end_date: string; // ISO 8601 format
  usage_limit: number | null;
  user_limit: number | null;
  min_purchase: number | null;
}

export const updateCouponSchema = Joi.object({
  business_id: Joi.string().trim().optional().label('Business ID'),

  code: Joi.string().trim().optional().label('Coupon Code'),

  type: Joi.string()
    .valid(...Object.values(CouponType))
    .optional()
    .label('Type'),

  value: Joi.number().positive().optional().label('Value'),

  start_date: Joi.date().iso().optional().label('Start Date'),

  end_date: Joi.date()
    .iso()
    .greater(Joi.ref('start_date'))
    .optional()
    .label('End Date'),

  usage_limit: Joi.number().integer().min(1).optional().label('Usage Limit'),

  user_limit: Joi.number().integer().min(1).optional().label('User Limit'),

  min_purchase: Joi.number().min(0).optional().label('Minimum Purchase'),

  status: Joi.boolean().optional(),
});

export interface UpdateCouponProps extends Partial<CreateCouponProps> {
  is_active?: boolean;
}
