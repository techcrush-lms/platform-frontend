'use client';

import React from 'react';
import LogItem from './LogItem';
import Pagination from '../Pagination';
import TableEndRecord from '../ui/TableEndRecord';
import { ActivityLog } from '@/types/log';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';

interface LogsListProps {
  logs: ActivityLog[];
  count: number;
  onClickNext: () => Promise<void>;
  onClickPrev: () => Promise<void>;
  currentPage: number;
  loading: boolean;
}
const LogsList = ({
  logs,
  count,
  onClickNext,
  onClickPrev,
  currentPage,
  loading,
}: LogsListProps) => {
  const searchParams = useSearchParams();
  if (loading) return <LoadingSkeleton />;

  const noFoundText = searchParams.has('q') ? 'No record found.' : undefined;

  return (
    <div>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Action
            </th>
            <th scope='col' className='px-6 py-3'>
              Metadata
            </th>
            <th scope='col' className='px-6 py-3'>
              Entity
            </th>
            <th scope='col' className='px-6 py-3'>
              User Agent
            </th>
            <th scope='col' className='px-6 py-3'>
              IP Address
            </th>
            <th scope='col' className='px-6 py-3'>
              Date Created
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}

          {!logs.length && <TableEndRecord colspan={6} text={noFoundText} />}
        </tbody>
      </table>
      {/* Pagination */}
      <Pagination
        total={count}
        currentPage={currentPage}
        onClickNext={onClickNext}
        onClickPrev={onClickPrev}
        noMoreNextPage={logs.length === 0}
      />
    </div>
  );
};

export default LogsList;
