'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { NotificationKind } from '@/lib/utils';
import InstantNotificationList from '@/components/dashboard/campaigns/email/instant/InstantCampaignsList';

const InstantEmailCampaign = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Instant Emails'
          brief='Track your email notifications'
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Email'
          layer4='Instant'
          layer3Link='/notifications/email'
          enableBackButton={true}
        />

        <InstantNotificationList />
      </div>
    </main>
  );
};

export default InstantEmailCampaign;
