'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import SigninForm from '@/components/auth/SigninForm';
import GoogleLogin from '@/components/auth/GoogleLogin';

const Signin = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Signin</title>
      </Head>

      <div className='w-full max-w-2xl border-0 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10 my-4 sm:my-8 md:my-12'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <Link
            href={'/'}
            className='flex items-center justify-center mb-6 sm:mb-8'
          >
            <Image
              src={'/icons/icon.png'}
              width={100}
              height={60}
              alt='Logo icon'
              priority
            />
          </Link>

          <h1 className='text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2'>
            Welcome!
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6 max-w-md'>
            Log in to TechCrush LMS and explore your experience.
          </p>

          <SigninForm />
        </div>
      </div>
    </div>
  );
};

export default Signin;
