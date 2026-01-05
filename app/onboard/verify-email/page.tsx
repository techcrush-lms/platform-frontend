'use client';

import ResendEmail from '@/components/auth/ResendEmail';
import VerifyEmailForm from '@/components/auth/VerifyEmailForm';
import LoadingScreen from '@/components/LoadingScreen';
import { useTokenDecrypt } from '@/hooks/useDecryptToken';
import { RegisterFormProps } from '@/lib/schema/auth.schema';
import { decryptInput, emailSplit, maskSensitiveData } from '@/lib/utils';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

const VerifyEmail = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VerifyEmailContent />
    </Suspense>
  );
};

const VerifyEmailContent = () => {
  const params = useSearchParams();
  const router = useRouter();

  const { emailData, setEmailData } = useTokenDecrypt<RegisterFormProps>(
    params.get('token')!
  );

  if (!emailData) {
    return <LoadingScreen />;
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Verify Email</title>
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center mb-6 sm:mb-8'>
            <Image
              src={'/icons/icon.png'}
              width={60}
              height={60}
              alt='Logo icon'
              className='rounded-lg'
              priority
            />
          </div>
          <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
            Verify Email Address
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            A 6-Digit code has been sent to{' '}
            {maskSensitiveData(emailData?.parts[0]!)}@{emailData?.parts[1]}.
            Enter code.
          </p>

          <VerifyEmailForm email={emailData.full} />

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 mb-4 text-sm sm:text-base'>
            <p>Didn't receive any code?</p>
            <ResendEmail email={emailData.full} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
