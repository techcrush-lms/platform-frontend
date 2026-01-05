'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { NotificationKind } from '@/lib/utils';
import InstantCampaignsList from '@/components/dashboard/campaigns/email/instant/InstantCampaignsList';

const InstantEmailCampaign = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Instant Campaigns'
          brief='Track your email campaigns'
          enableBreadCrumb={true}
          layer2='Campaigns'
          layer3='Email'
          layer4='Instant'
          layer3Link='/campaigns/email'
          enableBackButton={true}
        />

        <InstantCampaignsList />
      </div>
    </main>
  );
};

export default InstantEmailCampaign;
