'use client';

import React from 'react';
import PageHeading from '@/components/PageHeading';

const PushNotification = () => {
  return (
    <main>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Push'
        />
      </header>

      <div className='flex flex-col gap-6'></div>
    </main>
  );
};

export default PushNotification;
