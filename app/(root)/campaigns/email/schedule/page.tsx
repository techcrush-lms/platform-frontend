'use client';

import ScheduleEmailForm from '@/components/dashboard/campaigns/email/ScheduleEmailForm';
import PageHeading from '@/components/PageHeading';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

const ScheduleEmail = () => {
  const router = useRouter();

  const heading = (
    <div className='flex gap-1 items-center'>
      <HiOutlineChevronLeft
        className='cursor-pointer'
        onClick={() => router.back()}
      />
      New Email Schedule
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
          layer4='Scheduled'
          layer3Link='/campaigns/email'
          layer4Link='/campaigns/email/scheduled'
        />
      </header>

      <ScheduleEmailForm />
    </main>
  );
};

export default ScheduleEmail;
