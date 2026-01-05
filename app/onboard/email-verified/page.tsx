'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const EmailVerified = () => {
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

          <p className='text-2xl font-bold text-center mb-6 max-w-md'>
            Your email address has been successfully verified.
          </p>

          <Link
            href='/auth/signin'
            className={`w-full text-center py-3 px-4 rounded-lg font-medium text-white transition-all bg-primary-main hover:bg-primary-800`}
          >
            Proceed to Signin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
