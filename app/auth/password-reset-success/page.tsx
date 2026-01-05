import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

const PasswordResetSuccess = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light text-black-1'>
      <Head>
        <title>Password Reset Successful</title>
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
            Your have successfully reset your password.
          </p>

          <button
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all bg-primary-main hover:bg-primary-800`}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
