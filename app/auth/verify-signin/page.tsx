'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import VerifySigninForm from '@/components/auth/VerifySigninForm';
import { LoginProps } from '@/lib/schema/auth.schema';
import { maskSensitiveData } from '@/lib/utils';
import { useTokenDecrypt } from '@/hooks/useDecryptToken';
import LoadingScreen from '@/components/LoadingScreen';

const VerifySignin = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VerifySigninContent />
    </Suspense>
  );
};

const VerifySigninContent = () => {
  const params = useSearchParams();
  const router = useRouter();

  const { emailData, setEmailData } = useTokenDecrypt<LoginProps>(
    params.get('token')!
  );

  if (!emailData) {
    return <LoadingScreen />;
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Verify Signin</title>
        <meta
          name='description'
          content='Verify your signin with the code sent to your email'
        />
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <LogoSection />

          <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
            Verify Signin
          </h1>

          <EmailMessage emailParts={emailData.parts} />

          <VerifySigninForm email={emailData.full} />

          <BackToLoginLink />
          
        </div>
      </div>
    </div>
  );
};

const LogoSection = () => (
  <div className='flex items-center justify-center mb-6 sm:mb-8'>
    <Image
      src='/icons/icon.png'
      width={60}
      height={60}
      alt='Company Logo'
      className='rounded-lg'
      priority
    />
  </div>
);

const EmailMessage = ({ emailParts }: { emailParts: string[] }) => (
  <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
    A 6-Digit code has been sent to {maskSensitiveData(emailParts[0])}@
    {emailParts[1]}. Enter the code.
  </p>
);

const BackToLoginLink = () => (
  <div className='flex flex-wrap justify-center gap-1 sm:gap-2 sm:mt-8 mb-4 text-sm sm:text-base'>
    <Link
      href='/auth/signin'
      className='text-primary-main font-bold flex gap-2 items-center hover:opacity-80 transition-opacity'
    >
      Back to log in
      <Image
        src='/icons/auth/back-arrow.svg'
        alt=''
        width={20}
        height={20}
        className='object-contain'
      />
    </Link>
  </div>
);

export default VerifySignin;
