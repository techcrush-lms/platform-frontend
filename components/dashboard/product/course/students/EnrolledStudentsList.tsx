'use client';

import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import ThemeDiv from '@/components/ui/ThemeDiv';
import useProductCategory from '@/hooks/page/useProductCategory';
import { cn, shortenId } from '@/lib/utils';
import { CategoryWithCreator } from '@/types/product';
import { PencilIcon } from 'lucide-react';
import moment from 'moment-timezone';
import Image from 'next/image';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const EnrolledStudentsList = () => {
  const searchParams = useSearchParams();

  const {
    categories,
    currentPage,
    count,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useProductCategory();

  const renderTableBody = (
    categories: CategoryWithCreator[],
    noText: string,
  ) => (
    <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
      {categories.map((category, index) => (
        <tr
          key={index}
          className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
        >
          <td className='px-4 py-4 font-medium text-gray-800 dark:text-gray-100'>
            <Link
              href={`/courses/categories/${category.id}`}
              className=' flex items-center hover:underline gap-1'
            >
              <span>{shortenId(category.id)}</span>
              <PencilIcon size='13' />
            </Link>
          </td>
          <td className='px-4 py-3'>
            <Image
              src={category.multimedia.url}
              alt={category.name}
              className='rounded-md'
              width={50}
              height={50}
            />
          </td>
          <td className='px-4 py-3'>{category.name}</td>

          <td className='px-4 py-2'>
            {moment(category.created_at).format('DD MMM, YYYY')}
          </td>
          <td className='px-4 py-2'>
            {moment(category.updated_at).format('DD MMM, YYYY')}
          </td>
        </tr>
      ))}

      {!categories.length && <TableEndRecord colspan={5} text={noText} />}
    </tbody>
  );

  return (
    <>
      <Filter
        searchPlaceholder='Search enrolled students'
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
                'Student ID',
                'Image',
                'Name',
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
            <LoadingSkeleton length={12} columns={5} />
          ) : (
            renderTableBody(categories, 'No categories found.')
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
          noMoreNextPage={categories.length === 0}
        />
      )}
    </>
  );
};

export default EnrolledStudentsList;
