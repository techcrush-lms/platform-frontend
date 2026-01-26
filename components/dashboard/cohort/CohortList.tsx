'use client';

import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import useCohorts from '@/hooks/page/useCohorts';
import { Cohort } from '@/types/cohort';
import { PencilIcon } from 'lucide-react';
import moment from 'moment-timezone';
import Image from 'next/image';

import Link from 'next/link';
import React from 'react';

const CohortList = () => {
  const {
    cohorts,
    currentPage,
    count,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useCohorts();

  const renderTableBody = (cohorts: Cohort[], noText: string) => (
    <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
      {cohorts.map((cohort, index) => (
        <tr
          key={index}
          className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
        >
          <td className='px-4 py-4 font-medium text-gray-800 dark:text-gray-100'>
            <Link
              href={`/cohorts/${cohort.id}`}
              className=' flex items-center hover:underline gap-1'
            >
              <span>{cohort.cohort_number}</span>
              <PencilIcon size='13' />
            </Link>
          </td>
          <td className='px-4 py-3'>
            <Image
              src={cohort.multimedia?.url!}
              alt={cohort.name}
              className='rounded-md'
              width={50}
              height={50}
            />
          </td>
          <td className='px-4 py-3'>{cohort.name}</td>
          <td className='px-4 py-3'>{cohort.cohort_month}</td>

          <td className='px-4 py-2'>
            {moment(cohort.created_at).format('DD MMM, YYYY')}
          </td>
          <td className='px-4 py-2'>
            {moment(cohort.updated_at).format('DD MMM, YYYY')}
          </td>
        </tr>
      ))}

      {!cohorts.length && <TableEndRecord colspan={6} text={noText} />}
    </tbody>
  );

  return (
    <>
      <Filter
        searchPlaceholder='Search cohorts'
        showPeriod={false}
        showSearch={true}
        handleFilterByDateSubmit={handleFilterByDateSubmit}
        handleRefresh={handleRefresh}
        handleSearchSubmit={handleSearchSubmit}
      />
      <section className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
        <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-200'>
          <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
            <tr>
              {[
                'Cohort ID',
                'Image',
                'Name',
                'Period',
                'Date Created',
                'Date Updated',
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
            renderTableBody(cohorts, 'No cohorts found.')
          )}
        </table>
      </section>

      {/* Pagination */}
      {!loading && (
        <Pagination
          paddingRequired={false}
          total={count}
          currentPage={currentPage}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
          noMoreNextPage={cohorts.length === 0}
        />
      )}
    </>
  );
};

export default CohortList;
