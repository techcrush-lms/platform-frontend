'use client';

import ComposeEmailForm from '@/components/dashboard/campaigns/email/ComposeEmailForm';
import PageHeading from '@/components/PageHeading';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

const ComposeEmail = () => {
  const router = useRouter();

  const heading = (
    <div className='flex gap-1 items-center'>
      <HiOutlineChevronLeft
        className='cursor-pointer'
        onClick={() => router.back()}
      />
      New Email
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
          layer3='Email'
          layer4='Instant'
          layer3Link='/notifications/email'
          layer4Link='/notifications/email/instant'
        />
      </header>

      <ComposeEmailForm />
    </main>
  );
};

export default ComposeEmail;
