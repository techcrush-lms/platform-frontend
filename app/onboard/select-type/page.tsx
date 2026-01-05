'use client';

import { cn, SignupRole } from '@/lib/utils';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SelectType = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/onboard/signup?role=${selectedRole}`);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-light'>
      <Head>
        <title>Select User Type</title>
      </Head>

      <div className='w-full max-w-2xl border-2 border-white rounded-2xl bg-primary-light p-4 sm:p-8 md:p-10'>
        <div className='w-full rounded-2xl p-6 sm:p-8 bg-white flex flex-col items-center justify-center'>
          <Link
            href={'/'}
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
            Select User Type
          </h1>

          <p className='text-sm sm:text-base text-gray-600 text-center mb-6'>
            Please select your role to proceed
          </p>

          <div className='w-full space-y-4 mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <button
                onClick={() => handleRoleSelect(SignupRole.BUSINESS_OWNER)}
                className={cn(
                  'flex flex-col items-center rounded-xl border-2 transition-all p-4 sm:p-6 w-full sm:w-auto',
                  selectedRole === SignupRole.BUSINESS_OWNER
                    ? 'border-primary-main bg-primary-main text-white'
                    : 'border-gray-300 hover:border-gray-400 text-primary-main'
                )}
              >
                <Image
                  src={'/icons/user-type/business-owner.svg'}
                  alt='business-owner'
                  width={50}
                  height={50}
                  className={cn(
                    'mb-2',
                    selectedRole === SignupRole.BUSINESS_OWNER &&
                      'invert brightness-0'
                  )}
                />
                <span className='text-sm sm:text-base'>Business Owner</span>
              </button>

              <button
                onClick={() => handleRoleSelect(SignupRole.CUSTOMER)}
                className={cn(
                  'flex flex-col items-center rounded-xl border-2 transition-all p-4 sm:p-6 w-full sm:w-auto',
                  selectedRole === SignupRole.CUSTOMER
                    ? 'border-primary-main bg-primary-main text-white'
                    : 'border-gray-300 hover:border-gray-400 text-primary-main'
                )}
              >
                <Image
                  src='/icons/user-type/client.svg'
                  alt='client'
                  width={50}
                  height={50}
                  className={cn(
                    'mb-2',
                    selectedRole === SignupRole.CUSTOMER &&
                      'invert brightness-0'
                  )}
                />
                <span className='text-sm sm:text-base'>Customer</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              selectedRole
                ? 'bg-primary-main hover:bg-primary-800'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectType;
