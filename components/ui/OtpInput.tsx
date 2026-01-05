'use client';

import { cn } from '@/lib/utils';
import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({
  length = 6,
  onComplete,
  className,
  allowDarkMode = true,
}: {
  length?: number;
  onComplete?: (otp: string) => void;
  className?: string;
  allowDarkMode?: boolean;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(newOtp);

    // Move to next input if current has value
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    checkCompletion(newOtp);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      // If empty, move to previous input
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      // Always clear current input on backspace
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // console.log(otp);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData('text/plain')
      .replace(/\D/g, '')
      .slice(0, length); // Get only first 6 digits

    if (pasteData.length > 0) {
      const newOtp = [...otp];

      // Fill OTP array with pasted digits
      pasteData.split('').forEach((char, i) => {
        if (i < length) newOtp[i] = char;
      });

      setOtp(newOtp);

      // Focus the next empty input or last one
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
      const focusIndex =
        nextEmptyIndex === -1
          ? length - 1
          : Math.min(nextEmptyIndex, length - 1);
      inputRefs.current[focusIndex]?.focus();

      checkCompletion(newOtp);
    }
  };

  const checkCompletion = (currentOtp: string[]) => {
    if (currentOtp.every((digit) => digit !== '')) {
      onComplete?.(currentOtp.join(''));
    }
  };

  return (
    <div className='flex space-x-2 justify-center'>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el: any) => (inputRefs.current[index] = el)}
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => inputRefs.current[index]?.select()}
          className={cn(
            'w-12 h-12 text-center text-lg md:text-xl font-medium bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            allowDarkMode &&
              'dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
            className
          )}
        />
      ))}
    </div>
  );
};

export default OTPInput;
