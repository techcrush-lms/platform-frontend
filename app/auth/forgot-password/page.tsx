'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ForgotPassword = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Forgot Password</title>
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

          <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
            Password Reset
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            Enter the email address associated with your Doexcess account
          </p>

          <ForgotPasswordForm />

          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 mt-4 sm:mt-8 mb-4 text-sm sm:text-base'>
            <Link
              href='/auth/signin'
              className='text-primary-main font-bold flex gap-2'
            >
              Back to log in
              <Image
                src={'/icons/auth/back-arrow.svg'}
                alt='Back arrow'
                width='20'
                height='20'
                objectFit='contain'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
