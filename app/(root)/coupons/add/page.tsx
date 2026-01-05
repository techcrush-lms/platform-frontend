'use client';

import AddCouponForm from '@/components/dashboard/coupons/AddCouponForm';
import PageHeading from '@/components/PageHeading';
import React from 'react';

const AddCoupon = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Coupon'
          enableBreadCrumb={true}
          layer3='Coupon'
          layer4='Add Coupon'
          enableBackButton={true}
        />

        <section>
          <AddCouponForm />
        </section>
      </div>
    </main>
  );
};

export default AddCoupon;
