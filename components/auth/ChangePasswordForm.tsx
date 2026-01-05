import {
  ResetPasswordFormSchema,
  ResetPasswordProps,
} from '@/lib/schema/auth.schema';
import { resetPassword } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Input from '../ui/Input';
import Image from 'next/image';
import LoadingIcon from '../ui/icons/LoadingIcon';
import { Eye, EyeOff, XIcon } from 'lucide-react';
import { useStrongPassword } from '@/hooks/useStrongPassword';
import Icon from '../ui/Icon';
import { useRouter } from 'next/navigation';

const defaultValue = {
  reset_token: '',
  new_password: '',
  new_password_confirmation: '',
};

type PasswordStrength = {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  specialChar: boolean;
  digit: boolean;
};

interface ChangePasswordFormSchema {
  token: string;
}
const ChangePasswordForm = ({ token }: ChangePasswordFormSchema) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [body, setBody] = useState({ ...defaultValue, reset_token: token });
  const { passwordScore, passwordStrength, passwordVerificationInfo } =
    useStrongPassword({ password: body.new_password });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = ResetPasswordFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const data: ResetPasswordProps = {
        reset_token: body.reset_token,
        new_password: body.new_password,
      };

      const response: any = await dispatch(resetPassword(data));

      if (response.type === 'auth/reset-password/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push('/auth/signin');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body.reset_token.trim() !== '' &&
    body.new_password.trim() !== '' &&
    body.new_password_confirmation.trim() !== '' &&
    passwordScore === 5;

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <div className='w-full space-y-4 mb-6 sm:mb-8'>
        <div className='space-y-4'>
          <div className='relative'>
            <label
              htmlFor='new_password'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Create new password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name='new_password'
              placeholder='Create a password'
              className='w-full rounded-lg text-gray-900'
              value={body.new_password}
              required={true}
              enableDarkMode={false}
              onChange={handleChange}
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
                {passwordVerificationInfo.map((req) => (
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

          <div className='relative'>
            <label
              htmlFor='new_password_confirmation'
              className='block mb-2 text-sm font-bold text-gray-900'
            >
              Retype Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              name='new_password_confirmation'
              placeholder='Retype your password'
              className='w-full rounded-lg text-gray-900'
              value={body.new_password_confirmation}
              required={true}
              enableDarkMode={false}
              onChange={handleChange}
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-[70%] -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={!isFormValid || isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
          isFormValid
            ? 'bg-primary-main hover:bg-primary-800'
            : 'bg-primary-faded cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        ) : (
          'Proceed'
        )}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
