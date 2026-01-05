'use client';

import ComposeEmailForm from '@/components/dashboard/campaigns/email/ComposeEmailForm';
import PageHeading from '@/components/PageHeading';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

const EditEmail = () => {
  const router = useRouter();

  const heading = (
    <div className='flex gap-1 items-center'>
      <HiOutlineChevronLeft
        className='cursor-pointer'
        onClick={() => router.back()}
      />
      Edit Email
    </div>
  );
  return (
    <main className='section-container'>
      <header>
        {/* Page Heading */}
        <PageHeading
          title={heading}
          enableBreadCrumb={true}
          layer2='Campaigns'
          layer3='Email'
          layer4='Edit'
          layer3Link='/campaigns/email'
        />
      </header>

      <div className='p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
        <ComposeEmailForm />
      </div>
    </main>
  );
};

export default EditEmail;
