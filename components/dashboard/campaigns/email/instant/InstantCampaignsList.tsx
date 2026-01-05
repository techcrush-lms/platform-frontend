import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import TableEndRecord from '@/components/ui/TableEndRecord';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { InstantNotification } from '@/types/notification';
import InstantNotificationItem from './InstantCampaignItem';
import Filter from '@/components/Filter';
import useInstantNotification from '@/hooks/page/useInstantNotification';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

const InstantNotificationsList = () => {
  const searchParams = useSearchParams();
  const {
    instantNotifications: notifications,
    totalInstantNotifications: count,
    onClickNext,
    onClickPrev,
    currentPage,
    instantNotificationLoading: loading,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useInstantNotification();

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      <section>
        {/* Filter */}
        <Filter
          showPeriod={false}
          handleSearchSubmit={handleSearchSubmit}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          extra={
            <>
              <Link
                href={`/campaigns/email/compose`}
                className='text-white bg-primary-main hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-main dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-1'
              >
                {' '}
                <HiPlus />
                Compose
              </Link>
            </>
          }
        />
        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-300'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300'>
              <tr>
                {['Subject', 'Sender', 'Status', 'Date Created', ''].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope='col'
                      className='px-6 py-3 whitespace-nowrap'
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {loading ? (

              <LoadingSkeleton length={12} columns={5} />

            ) : (

              <tbody>

                {notifications.map((notification) => (
                  <InstantNotificationItem notification={notification} />
                ))}

                {!notifications.length && (
                  <TableEndRecord colspan={8} text={noFoundText} />
                )}
              </tbody>

            )}

          </table>
        </div>
        {/* Pagination */}

        {!loading && (
          <Pagination
            total={count}
            paddingRequired={false}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={notifications.length === 0}
          />
        )}

      </section>
    </>
  );
};

export default InstantNotificationsList;
