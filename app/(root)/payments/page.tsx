'use client';

import PaymentList, {
  RetrievalType,
} from '@/components/dashboard/payment/PaymentList';
import PageHeading from '@/components/PageHeading';
import usePayments from '@/hooks/page/usePayments';
import React from 'react';

const Payments = () => {
  const {
    payments,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    count,
  } = usePayments();

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        {/* Header */}
        <PageHeading
          title='Payments'
          brief='Manage your payments seamlessly'
          enableBreadCrumb={true}
          layer2='Payments'
        />

        <PaymentList
          retrieve={RetrievalType.ALL}
          payments={payments}
          loading={loading}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          count={count}
        />
      </div>
    </main>
  );
};

export default Payments;
