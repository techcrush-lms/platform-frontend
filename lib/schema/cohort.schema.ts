import Joi from 'joi';

export const CreateCohortSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().min(10).optional().allow(''),
  cohort_number: Joi.string().required(),
  cohort_month: Joi.string().required(),
  cohort_year: Joi.string().required(),
  multimedia_id: Joi.string().required(),
  group_link: Joi.string().required(),
});

export interface CreateCohortProps {
  name: string;
  description: string;
  cohort_number: string;
  cohort_month: string;
  cohort_year: string;
  multimedia_id: string;
  group_link: string;
}

export const UpdateCohortSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().min(10).optional().allow(''),
  cohort_number: Joi.string().optional(),
  cohort_month: Joi.string().optional(),
  cohort_year: Joi.string().optional(),
  multimedia_id: Joi.string().optional(),
  group_link: Joi.string().optional(),
});

export interface UpdateCohortProps {
  name?: string;
  description?: string;
  cohort_number?: string;
  cohort_month?: string;
  cohort_year?: string;
  multimedia_id?: string;
  group_link?: string;
}
