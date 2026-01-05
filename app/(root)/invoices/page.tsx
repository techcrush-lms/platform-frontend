'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/PageHeading';
import usePayments from '@/hooks/page/usePayments';
import InvoiceList from '@/components/dashboard/invoice/InvoiceList';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import useInvoices from '@/hooks/page/useInvoices';
import { RetrievalType } from '@/lib/schema/invoice.schema';

const Invoices = () => {
  const [activeTab, setActiveTab] = useState<RetrievalType>(RetrievalType.ALL);

  const {
    invoices,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    count,
  } = useInvoices({ activeTab }); // 👈 pass tab to hook if supported

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container'>
        <PageHeading
          title='Invoices'
          brief='Track and manage invoice payments in one place'
          enableBreadCrumb={true}
          layer2='Invoices'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/invoices/create'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Create Invoice
              </Link>
            </div>
          }
        />

        <InvoiceList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          invoices={invoices}
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

export default Invoices;
