'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { NotificationKind } from '@/lib/utils';
import useScheduledNotification from '@/hooks/page/useScheduledNotification';
import ScheduledNotificationsList from '@/components/dashboard/campaigns/email/scheduled/ScheduledCampaignsList';

const ScheduledEmailNotification = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Scheduled Emails'
          brief='Track your scheduled emails'
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Email'
          layer4='Scheduled'
          layer3Link='/notifications/email'
          enableBackButton={true}
        />

        <ScheduledNotificationsList />
      </div>
    </main>
  );
};

export default ScheduledEmailNotification;
