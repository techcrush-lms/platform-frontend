'use client';

import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Invoice } from '@/types/invoice';
import InvoiceItem from './InvoiceItem';
import { RetrievalType } from '@/lib/schema/invoice.schema';

interface InvoiceListProps {
  activeTab: RetrievalType;
  setActiveTab: React.Dispatch<React.SetStateAction<RetrievalType>>;
  invoices: Invoice[];
  loading: Boolean;
  onClickNext: () => void;
  onClickPrev: () => void;
  handleSearchSubmit: (input: string) => void;
  handleFilterByDateSubmit: (
    startDate: string,
    endDate: string,
    setOpenModal: (value: React.SetStateAction<boolean>) => void
  ) => void;
  handleRefresh: () => void;
  count: number;
}

const TABS = [
  { label: 'All', value: RetrievalType.ALL },
  { label: 'Published', value: RetrievalType.PUBLISHED },
  { label: 'Draft', value: RetrievalType.DRAFT },
  { label: 'Paid', value: RetrievalType.PAID },
  { label: 'Awaiting Payment', value: RetrievalType.UNPAID },
];

const InvoiceList = ({
  activeTab,
  setActiveTab,
  invoices,
  loading,
  onClickNext,
  onClickPrev,
  handleSearchSubmit,
  handleFilterByDateSubmit,
  handleRefresh,
  count,
}: InvoiceListProps) => {
  const searchParams = useSearchParams();

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      {/* Invoices */}
      <section>
        {/* {activeTab === RetrievalType.ALL && ( */}
        <Filter
          searchPlaceholder='Search invoices'
          showPeriod={false}
          showSearch={true}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          handleSearchSubmit={handleSearchSubmit}
        />
        {/* )} */}

        {/* Tabs */}
        <div className='mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700'>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 text-sm font-medium transition
                  ${
                    isActive
                      ? 'border-b-2 border-primary text-primary text-gray-500 dark:text-gray-300'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
              <tr>
                {[
                  'Date',
                  'Invoice No.',
                  'Title',
                  'User',
                  'Amount',
                  'Status',
                  'Paid',
                ].map((heading) => (
                  <th key={heading} className='px-6 py-3 whitespace-nowrap'>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <LoadingSkeleton length={12} columns={6} />
            ) : (
              <tbody className='text-sm'>
                {invoices.map((invoice, idx) => (
                  <InvoiceItem key={idx} invoice={invoice} idx={idx} />
                ))}
                {!invoices.length && (
                  <TableEndRecord colspan={10} text={noFoundText} />
                )}
              </tbody>
            )}
          </table>
        </div>

        {!loading && (
          <Pagination
            noMoreNextPage={invoices.length === 0}
            total={count}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
          />
        )}
      </section>
    </>
  );
};

export default InvoiceList;
