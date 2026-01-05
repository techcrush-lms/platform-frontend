'use client';

import React, { useEffect, useState } from 'react';
import OTPInput from '../ui/OtpInput';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { VerifyLoginFormSchema } from '@/lib/schema/auth.schema';
import { verifyLogin } from '@/redux/slices/authSlice';
import toast from 'react-hot-toast';
import ResendEmailOtp from './ResendEmailOtp';
import LoadingIcon from '../ui/icons/LoadingIcon';
import { SystemRole } from '@/lib/utils';

const defaultValue = {
  email: '',
  otp: '',
};

interface VerifySigninFormProps {
  email: string;
}

const VerifySigninForm = ({ email }: VerifySigninFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParam = useSearchParams();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [body, setBody] = useState({ ...defaultValue, email });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, otp });
  };

  const isFormValid = body.otp.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = VerifyLoginFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(verifyLogin(body));

      if (response.type === 'auth/verify-account-otp/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);

      const redirect_url = searchParam.get('redirect_url')
        ? searchParam.get('redirect_url')!
        : '/home';

      const route = [
        SystemRole.BUSINESS_SUPER_ADMIN,
        SystemRole.BUSINESS_ADMIN,
      ].includes(response.payload.data.role)
        ? redirect_url
        : '/dashboard/home';

      router.push(route);
    } catch (error: any) {
      console.error('Signin verification failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='w-full space-y-2 sm:mb-8'>
        <div className='space-y-4'>
          <div className='flex justify-center mt-5 mb-4'>
            <OTPInput
              onComplete={handleOTPComplete}
              allowDarkMode={false}
              className='w-[40px] h-[40px] md:w-[50px] md:h-[50px]'
            />
          </div>
        </div>
      </div>

      <div className='w-full'>
        <button
          type='submit'
          disabled={!isFormValid || isSubmitting}
          className={`w-full text-sm sm:text-base py-3 px-4 rounded-lg font-medium text-white transition-all ${
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
        <ResendEmailOtp />
      </div>
    </form>
  );
};

export default VerifySigninForm;
