// app/auth/set-password/page.tsx (or wherever you mount this page)
'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import PasswordCreationRequestForm from '@/components/auth/PasswordCreationRequestForm';
import SetNewPasswordForm from '@/components/auth/SetNewPasswordForm';
import { useNewAccountToken } from '@/hooks/useNewAccountToken';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const SetPassword = () => {
  const params = useSearchParams();
  const { userDetails, status } = useNewAccountToken();

  const token = params.get('token');

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <p className='text-gray-600'>Validating your link...</p>;

      case 'valid':
        return (
          <>
            <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
              Set Password
            </h1>
            <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
              Create a secure password to complete your account setup.
            </p>
            <SetNewPasswordForm token={token ?? ''} />
          </>
        );

      case 'expired':
        return (
          <>
            <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
              Link Expired 😕
            </h1>
            <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
              For your security, password setup links are only valid for 24
              hours. Don’t worry—you can request a new one below.
            </p>
            <PasswordCreationRequestForm email={userDetails?.email!} />
          </>
        );

      case 'used':
        return (
          <>
            <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
              Link Already Used ✅
            </h1>
            <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
              Your password has already been set. You can log in to your account
              below.
            </p>
            <Link
              href='/auth/signin'
              className='px-6 py-2 flex gap-1 bg-primary text-white rounded-lg'
            >
              Go to Login <ArrowRight fontSize={5} />
            </Link>
          </>
        );

      case 'invalid':
      default:
        return (
          <>
            <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
              Invalid Link ❌
            </h1>
            <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
              The link you used is invalid or broken. Request a new password
              setup link.
            </p>
            <Link
              href='/auth/signin'
              className='px-6 py-2 flex gap-1 bg-primary text-white rounded-lg'
            >
              Go to Login <ArrowRight fontSize={5} />
            </Link>
          </>
        );
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Set Password</title>
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <Link
            href='/'
            className='flex items-center justify-center mb-6 sm:mb-8'
          >
            <Image
              src={'/icons/icon.png'}
              width={60}
              height={60}
              alt='Logo icon'
              className='rounded-lg'
              priority
            />
          </Link>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
