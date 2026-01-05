'use client';

import EditPushForm from '@/components/dashboard/campaigns/push/EditPushForm';
import PageHeading from '@/components/PageHeading';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

const EditJobPush = () => {
  const router = useRouter();

  const heading = (
    <div className='flex gap-1 items-center'>
      <HiOutlineChevronLeft
        className='cursor-pointer'
        onClick={() => router.back()}
      />
      Edit Push Notification
    </div>
  );
  return (
    <main className='section-container'>
      <header>
        {/* Page Heading */}
        <PageHeading
          title={heading}
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Push'
          layer4='Edit'
        />
      </header>

      <div className='p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
        <EditPushForm />
      </div>
    </main>
  );
};

export default EditJobPush;
