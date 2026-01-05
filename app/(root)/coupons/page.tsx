'use client';

import PageHeading from '@/components/PageHeading';
import React from 'react';
import CouponsList from '@/components/dashboard/coupons/CouponsList';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

const Coupons = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Page heading */}
        <PageHeading
          title='Coupons'
          brief='Create and manage discount coupons effortlessly'
          enableBreadCrumb={true}
          layer2='Coupons'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/coupons/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add
              </Link>
            </div>
          }
        />

        <CouponsList />
      </div>
    </main>
  );
};

export default Coupons;
