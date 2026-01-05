'use client';

import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import WithdrawalItem from './WithdrawalItem';
import { Withdrawal } from '@/types/withdrawal';
import useWithdrawals from '@/hooks/page/useWithdrawals';

export enum RetrievalType {
  RECENT = 'recent',
  ALL = 'all',
}

interface WithdrawalListProps {
  retrieve?: RetrievalType;
}

const WithdrawalList = ({
  retrieve = RetrievalType.RECENT,
}: WithdrawalListProps) => {
  const limit = retrieve === RetrievalType.RECENT ? 5 : 10;

  const {
    withdrawals,
    count,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useWithdrawals(limit);

  const noFoundText = 'No record found.';

  return (
    <section
      className={cn(
        '',
        retrieve === RetrievalType.RECENT &&
          'rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm'
      )}
    >
      {/* Recent header */}
      {retrieve === RetrievalType.RECENT && (
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
            Recent Withdrawals
          </h3>
          <Link href='/withdrawals' className='dark:text-white'>
            View All
          </Link>
        </div>
      )}

      {/* Filter for ALL */}
      {retrieve === RetrievalType.ALL && (
        <Filter
          searchPlaceholder='Search withdrawals'
          showPeriod={false}
          showSearch={true}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
      )}

      {/* Table */}
      <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
        <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
          <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
            <tr>
              {[
                'Date',
                'Transaction ID',
                'Amount',
                'Requested By',
                'Status',
              ].map((heading) => (
                <th key={heading} className='px-6 py-3 whitespace-nowrap'>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <LoadingSkeleton length={limit} columns={5} />
          ) : (
            <tbody className='text-sm'>
              {withdrawals.map((w: Withdrawal, idx: number) => (
                <WithdrawalItem key={idx} txn={w} idx={idx} />
              ))}
              {!withdrawals.length && (
                <TableEndRecord colspan={5} text={noFoundText} />
              )}
            </tbody>
          )}
        </table>
      </div>

      {retrieve === RetrievalType.ALL && !loading && (
        <Pagination
          noMoreNextPage={withdrawals.length === 0}
          total={count}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
        />
      )}
    </section>
  );
};

export default WithdrawalList;
