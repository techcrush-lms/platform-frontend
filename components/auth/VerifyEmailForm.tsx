import { VerifyEmailFormSchema } from '@/lib/schema/auth.schema';
import { decryptInput, isEncrypted, SystemRole } from '@/lib/utils';
import { verifyEmail } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import OTPInput from '../ui/OtpInput';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue = {
  token: '',
  email: '',
};

interface VerifyEmailFormProps {
  email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useSearchParams();

  const [body, setBody] = useState({ ...defaultValue, email });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOTPComplete = (otp: string) => {
    setBody({ ...body, token: otp });
  };

  const isFormValid = body.token.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = VerifyEmailFormSchema.validate(body);

      // Handle validation results
      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(verifyEmail(body));

      if (response.type === 'auth/verify-email/rejected') {
        throw new Error(response.payload.message);
      }

      if (response?.payload?.token) {
        if (response?.payload?.data?.role === SystemRole.USER) {
          return router.push('/dashboard/home');
        }
        return router.push('/home');
      } else {
        router.push(`/onboard/email-verified`);
      }
    } catch (error: any) {
      console.error('Email verified failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-4 mb-6 sm:mb-8'>
        <div className='space-y-4'>
          <div className='flex mt-5 mb-8 '>
            <OTPInput
              onComplete={handleOTPComplete}
              allowDarkMode={false}
              className='w-10 h-10 md:w-[50px] md:h-[50px]'
            />
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

export default VerifyEmailForm;
