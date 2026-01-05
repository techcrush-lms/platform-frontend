'use client';

import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import Link from 'next/link';
import Icon from '../ui/Icon';
import XIcon from '../ui/icons/XIcon';
import { Eye, EyeOff } from 'lucide-react';
import {
  RegisterFormProps,
  RegisterFormSchema,
} from '@/lib/schema/auth.schema';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { register } from '@/redux/slices/authSlice';
import {
  actualRole,
  countries,
  DEFAULT_COUNTRY,
  encryptInput,
  SignupRole,
  SystemRole,
} from '@/lib/utils';
import toast from 'react-hot-toast';
import LoadingIcon from '../ui/icons/LoadingIcon';
import PhoneInput from '../ui/PhoneInput';

const defaultValue = {
  name: '',
  email: '',
  phone: '',
  country: 'NGN',
  country_dial_code: '+234',
  password: '',
  role: '',
  allowOtp: true,
};

type PasswordStrength = {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  specialChar: boolean;
  digit: boolean;
};

interface RegisterFormCompProps {
  role: SignupRole | string;
}
const RegisterForm = ({ role }: RegisterFormCompProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  console.log(defaultValue);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [body, setBody] = useState<RegisterFormProps>({
    ...defaultValue,
    role: actualRole(role),
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
    digit: false,
  });
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const strength = {
      length: body.password.length >= 8,
      lowercase: /[a-z]/.test(body.password),
      uppercase: /[A-Z]/.test(body.password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(body.password),
      digit: /\d/.test(body.password),
    };
    setPasswordStrength(strength);
    setPasswordScore(Object.values(strength).filter(Boolean).length);
  }, [body.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(body);

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = RegisterFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(register(body));

      if (response.type === 'auth/register/rejected') {
        throw new Error(response.payload.message);
      }

      // Encrypt input
      const encrypted = encryptInput(JSON.stringify(body));

      toast.success(response.payload.message);
      router.push(`/onboard/verify-email?token=${encrypted}`);
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body.name.trim() !== '' &&
    body.email.trim() !== '' &&
    body.password.trim() !== '' &&
    termsAccepted &&
    passwordScore === 5;

  const getStrengthColor = () => {
    if (passwordScore <= 1) return 'text-red-500';
    if (passwordScore <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthText = () => {
    if (passwordScore <= 1) return 'Very Weak';
    if (passwordScore <= 2) return 'Weak';
    if (passwordScore <= 3) return 'Moderate';
    if (passwordScore <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='w-full space-y-6 mb-6'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Name
            </label>
            <Input
              type='text'
              name='name'
              placeholder={`Enter your name`}
              className='w-full rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              value={body.name}
              required
              onChange={handleChange}
              enableDarkMode={false}
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              {body.role === SystemRole.BUSINESS_SUPER_ADMIN
                ? 'Business Email'
                : 'Email'}
            </label>
            <Input
              type='email'
              name='email'
              placeholder={'you@example.com'}
              className='w-full rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              value={body.email}
              required
              onChange={handleChange}
              enableDarkMode={false}
            />
          </div>

          <div>
            <PhoneInput
              formData={body}
              setFormData={setBody}
              allowDarkMode={false}
            />
          </div>

          <div className='relative'>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Create a password'
              className='w-full rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              value={body.password}
              required
              onChange={handleChange}
              enableDarkMode={false}
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-[31%] -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            <div className='mt-3 text-xs sm:text-sm'>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  { key: 'length', text: '8+ characters' },
                  { key: 'lowercase', text: 'Lowercase letter' },
                  { key: 'uppercase', text: 'Uppercase letter' },
                  { key: 'specialChar', text: 'Special character' },
                  { key: 'digit', text: 'Digit' },
                ].map((req) => (
                  <div key={req.key} className='flex items-center'>
                    <div
                      className={`mr-2 ${
                        passwordStrength[req.key as keyof PasswordStrength]
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {passwordStrength[req.key as keyof PasswordStrength] ? (
                        <Icon url='/icons/auth/check.svg' />
                      ) : (
                        <XIcon className='text-red-500' />
                      )}
                    </div>
                    <span
                      className={
                        passwordStrength[req.key as keyof PasswordStrength]
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex items-start'>
            <div className='flex items-center h-5'>
              <Checkbox
                name='terms'
                checked={termsAccepted}
                onChange={handleTermsChange}
                className='h-4 w-4 text-primary-main focus:ring-secondary-main-active border-gray-300 rounded'
                enableDarkMode={false}
              />
            </div>
            <div className='ml-3 text-sm'>
              <label htmlFor='terms' className='font-medium text-gray-900'>
                I agree to the{' '}
                <Link
                  href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/terms`}
                  className='text-gray-600 hover:underline'
                  target='_blank'
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy`}
                  className='text-gray-600 hover:underline'
                  target='_blank'
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={!isFormValid || isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
          isFormValid
            ? 'bg-primary-main hover:bg-primary-700 shadow-sm'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : (
          'Continue'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
