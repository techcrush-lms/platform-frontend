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
  const [notificationType, setNotificationType] = useState(
    NotificationKind.SCHEDULED
  );

  const {
    scheduledNotifications,
    scheduledNotificationLoading,
    totalScheduledNotifications,
    onClickNext,
    onClickPrev,
    currentPage,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useScheduledNotification();

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Scheduled Campaigns'
          brief='Track your scheduled emails'
          enableBreadCrumb={true}
          layer2='Campaigns'
          layer3='Email'
          layer4='Scheduled'
          layer3Link='/campaigns/email'
          enableBackButton={true}
        />

        <ScheduledNotificationsList />
      </div>
    </main>
  );
};

export default ScheduledEmailNotification;
