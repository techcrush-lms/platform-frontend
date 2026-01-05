import Joi from 'joi';
import { NotificationType } from '../utils'; // adjust path as needed

type InferType<T> = T extends Joi.ObjectSchema ? Joi.Schema<T> : never;

export const ComposeEmailSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
  business_id: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(NotificationType))
    .required(),
  is_scheduled: Joi.boolean().required(),
  recipients: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .min(1)
    .required(),
});

export const ScheduleEmailSchema = Joi.object({
  title: Joi.string().required(),
  business_id: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(NotificationType))
    .required(), // adjust enum values as needed
  scheduled_time: Joi.string()
    // .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    .required(),
  // .messages({
  //   'string.pattern.base': `"scheduled_time" must be in the format YYYY-MM-DD HH:MM`,
  // }),
  recipients: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }).required())
    .min(1)
    .required(),
});
export interface ScheduleEmailProps {
  title: string;
  message: string;
  type: NotificationType;
  scheduled_time: string;
  recipients: string[];
  business_id: string;
}

export type ComposeEmailFormProps = InferType<typeof ComposeEmailSchema>;
export type ScheduleEmailFormProps = InferType<typeof ScheduleEmailSchema>;
