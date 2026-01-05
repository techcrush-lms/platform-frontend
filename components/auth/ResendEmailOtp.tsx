'use client';

import { LoginProps } from '@/lib/schema/auth.schema';
import { decryptInput } from '@/lib/utils';
import { login } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import LoadingIcon from '../ui/icons/LoadingIcon';

const defaultValue = {
  email: '',
  password: '',
};

const COUNTDOWN_DURATION = 60; // 1 minute in seconds
const COUNTDOWN_STORAGE_KEY = 'resendOtpCountdown';

const ResendEmailOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const decyptedData = JSON.parse(
    decryptInput(params.get('token')!)
  ) as LoginProps;

  const [body, setBody] = useState({
    ...defaultValue,
    email: decyptedData.email,
    password: decyptedData.password,
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

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response: any = await dispatch(login(body));

      if (response.type === 'auth/request-account-otp/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      startCountdown();
    } catch (error: any) {
      console.error('Resend otp failed:', error);
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
    <div className='flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8 text-sm sm:text-base'>
      <p>Didn't receive any code? </p>
      <button
        type='button'
        onClick={handleResendOtp}
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
          'Resend'
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

export default ResendEmailOtp;
