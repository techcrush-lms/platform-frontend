'use client';

import React from 'react';
import Pagination from '@/components/Pagination';
import TableEndRecord from '@/components/ui/TableEndRecord';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import CouponItem from './CouponItem';
import Filter from '@/components/Filter';
import useCoupons from '@/hooks/page/useCoupons';

const CouponsList = () => {
  const {
    coupons,
    loading,
    count,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useCoupons();
  const searchParams = useSearchParams();

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      <section>
        {/* Filter */}
        <Filter
          searchPlaceholder='Search coupons'
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
        />
        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-300'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300'>
              <tr>
                {[
                  'Code',
                  'Type',
                  'Value',
                  'Start/end date',
                  'Usage Limit',
                  'User Limit',
                  'Minimum Purchase',
                  'Status',
                  'Date Created',
                ].map((heading) => (
                  <th
                    key={heading}
                    scope='col'
                    className='px-6 py-3 whitespace-nowrap'
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (

              <LoadingSkeleton length={12} columns={9} />

            ) : (

              <tbody>
                {coupons.map((coupon) => (
                  <CouponItem coupon={coupon} />
                ))}

                {!coupons.length && (
                  <TableEndRecord colspan={9} text={noFoundText} />
                )}
              </tbody>

            )}

          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={coupons.length === 0}
          />
        )}

      </section>
    </>
  );
};

export default CouponsList;
