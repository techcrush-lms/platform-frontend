import Joi from 'joi';
import { Gender, SystemRole } from '../utils';
import { Role } from '@/types/product';

type InferType<T> = T extends Joi.ObjectSchema ? Joi.Schema<T> : never;

export const RegisterFormSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  country_dial_code: Joi.string().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid(...Object.values(SystemRole))
    .required(),
  allowOtp: Joi.boolean().optional(),
});
export interface RegisterFormProps {
  name: string;
  email: string;
  phone: string;
  country: string;
  country_dial_code: string;
  password: string;
  role: SystemRole | string;
  allowOtp: boolean;
}

export const VerifyEmailFormSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().required(),
});
export interface VerifyEmailFormProps {
  token: string;
  email: string;
}

export const LoginFormSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(8).required(),
  // role: Joi.string().required(),
});
export interface LoginProps {
  email: string;
  password: string;
  // role: string;
}

export const ResendEmailFormSchema = Joi.object({
  email: Joi.string().required(),
  allowOtp: Joi.boolean().optional(),
});
export interface ResendEmailProps {
  email: string;
  allowOtp: boolean;
}

export const VerifyLoginFormSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.string().min(6).max(6).required(),
});

export const UserProfileSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty',
  }),
  profile_picture: Joi.string().uri().optional().messages({
    'string.uri': 'Profile picture must be a valid URL',
    'string.empty': 'Profile picture cannot be empty',
  }),
  address: Joi.string().optional().messages({
    'string.empty': 'Address cannot be empty',
  }),
  bio: Joi.string().optional().messages({
    'string.empty': 'Bio cannot be empty',
  }),
  date_of_birth: Joi.date().iso().less('now').optional().messages({
    'date.base': 'Date of birth must be a valid date',
    'date.format': 'Date of birth must be in YYYY-MM-DD format',
    'date.less': 'Date of birth must be in the past',
  }),
  gender: Joi.string()
    .valid(Object.values(Gender).join(', '))
    .optional()
    .messages({
      'string.empty': 'Gender cannot be empty',
      'any.only': 'Gender must be ' + Object.values(Gender).join(', '),
    }),
});
export interface UserProfileProps {
  name?: string;
  phone?: string;
  country?: string;
  profile_picture?: string;
  address?: string;
  bio?: string;
  date_of_birth?: Date | string | null;
  gender?: Gender | null;
}

export interface KYCProps {
  doc_front: string;
  doc_back: string;
  utility_doc: string;
  location: string;
  country: string;
  state: string;
  city: string;
  id_type: string;
}

export const UpdatePasswordSchema = Joi.object({
  current_password: Joi.string().required().label('Current Password'),
  new_password: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d).+$'))
    .required()
    .label('New Password')
    .messages({
      'string.pattern.base':
        'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
  confirm_password: Joi.string()
    .valid(Joi.ref('new_password'))
    .required()
    .label('Confirm Password')
    .messages({
      'any.only': 'Confirm Password must match New Password',
    }),
});
export interface UpdatePasswordProps {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const RequestPasswordResetFormSchema = Joi.object({
  email: Joi.string().required(),
});
export interface RequestPasswordResetProps {
  email: string;
}

export const SavePasswordByTokenFormSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
  password_confirmation: Joi.string().required(),
});
export interface SavePasswordByTokenProps {
  token: string;
  password: string;
}

export const RequestPasswordCreationFormSchema = Joi.object({
  email: Joi.string().required(),
});
export interface RequestPasswordCreationProps {
  email: string;
}

export const VerifyPasswordTokenFormSchema = Joi.object({
  token: Joi.string().required(),
});
export interface VerifyPasswordTokenProps {
  token: string;
}

export const TokenFormSchema = Joi.object({
  token: Joi.string().required(),
});
export interface TokenProps {
  token: string;
}
export const ResetPasswordFormSchema = Joi.object({
  reset_token: Joi.string().required().label('Reset Token'),

  new_password: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .required()
    .label('New Password')
    .messages({
      'string.min': '{{#label}} must be at least 8 characters long.',
      'string.max': '{{#label}} must not exceed 32 characters.',
      'string.pattern.base':
        '{{#label}} must include at least one uppercase letter, one lowercase letter, and one number.',
    }),

  new_password_confirmation: Joi.any()
    .equal(Joi.ref('new_password'))
    .required()
    .label('Password Confirmation')
    .messages({
      'any.only': '{{#label}} does not match New Password.',
    }),
});
export interface ResetPasswordProps {
  reset_token: string;
  new_password: string;
}
