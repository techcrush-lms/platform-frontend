'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decryptInput } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { ResendEmailFormSchema } from '@/lib/schema/auth.schema';
import { resendEmail } from '@/redux/slices/authSlice';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue = {
  email: '',
  allowOtp: '',
};

const COUNTDOWN_DURATION = 60; // 1 minute in seconds
const COUNTDOWN_STORAGE_KEY = 'resendEmailCountdown';

interface ResendEmailProps {
  email: string;
}
const ResendEmail = ({ email }: ResendEmailProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendEmailContent email={email} />
    </Suspense>
  );
};

const ResendEmailContent = ({ email }: ResendEmailProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const [body, setBody] = useState({
    ...defaultValue,
    email,
    allowOtp: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [isActive, setIsActive] = useState(true);
  const [hasInitialCountdownRun, setHasInitialCountdownRun] = useState(false);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initialize countdown from localStorage on component mount
  useEffect(() => {
    const savedCountdown = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
    if (savedCountdown && !hasInitialCountdownRun) {
      const { timestamp, duration } = JSON.parse(savedCountdown);
      const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);
      const remaining = Math.max(0, duration - elapsedSeconds);

      if (remaining > 0) {
        setCountdown(remaining);
        setIsActive(false);
        startCountdown(remaining);
      } else {
        localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      }
      setHasInitialCountdownRun(true);
    }
  }, [hasInitialCountdownRun]);

  // Start new countdown
  const startCountdown = (initialCountdown = COUNTDOWN_DURATION) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const startTime = Date.now();
    localStorage.setItem(
      COUNTDOWN_STORAGE_KEY,
      JSON.stringify({ timestamp: startTime, duration: initialCountdown })
    );

    setIsActive(false);
    setCountdown(initialCountdown);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(true);
          localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendEmail = async () => {
    try {
      setIsSubmitting(true);

      const { error, value } = ResendEmailFormSchema.validate(body);

      if (error) {
        throw new Error(error.details[0].message);
      }

      const response: any = await dispatch(resendEmail(body));

      if (response.type === 'auth/resend-email/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      startCountdown();
    } catch (error: any) {
      console.error('Email resending failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onClick={handleResendEmail}
        disabled={isSubmitting || !isActive}
        className={`font-bold ${
          isSubmitting || !isActive
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-primary-main hover:text-primary-dark'
        }`}
      >
        {isSubmitting ? (
          <span className='flex items-center justify-center'>
            Processing...
          </span>
        ) : (
          'Resend Email'
        )}
      </button>

      {!isActive && (
        <p className='text-sm text-gray-500'>
          Available in {formatCountdown(countdown)}
        </p>
      )}
    </div>
  );
};

export default ResendEmail;
