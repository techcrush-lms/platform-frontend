'use client';

import ProductGridItem from '@/components/dashboard/product/ProductGridItem';
import Filter from '@/components/Filter';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';
import useTickets from '@/hooks/page/useTickets'; // assuming path is correct
import ProductGridItemSkeleton from '@/components/dashboard/product/ProductGridItemSkeleton';
import { PAGINATION_LIMIT, ProductType } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import { TicketIcon } from 'lucide-react';

const Tickets = () => {
  const {
    tickets,
    loading,
    error,
    count,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useTickets();

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Event Tickets'
          brief='Create and manage your event tickets with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Event Tickets'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/products/tickets/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Ticket
              </Link>
            </div>
          }
        />

        <div className='mb-2'>
          <Filter
            pageTitle='All Event Tickets'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={handleSearchSubmit}
            handleRefresh={handleRefresh}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
          />
        </div>

        {/* Todo later */}
        {/* <div className='flex space-x-4 mb-6 overflow-x-auto whitespace-nowrap'>
          {['upcoming', 'past'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm ${
                index === 0
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-gray-500 dark:text-white font-medium hover:text-gray-700 dark:hover:text-gray-400'
              }`}
              // You can implement tab switching logic here
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div> */}

        {loading ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductGridItemSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <p className='text-center text-red-500'>Failed to load tickets</p>
        ) : tickets?.length === 0 ? (
          <div className='col-span-full flex flex-col items-center justify-center py-16 text-center'>
            <TicketIcon className='w-10 h-10 text-gray-500 dark:text-gray-400 mb-2' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              {tickets.length === 0 ? 'No Tickets Found' : 'No Tickets Yet'}
            </h3>
            <p className='text-gray-500 dark:text-gray-400 max-w-md'>
              {tickets.length === 0
                ? 'Start by creating your first physical product. You can add products that customers can purchase and ship to them.'
                : "Try adjusting your search terms or filters to find what you're looking for."}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {tickets.map((ticket) => (
              <ProductGridItem
                key={ticket.id}
                id={ticket.id}
                imageSrc={ticket.multimedia.url || '/images/course/course2.png'} // fallback image
                title={ticket.title}
                type={ProductType.TICKET}
                data={ticket}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && count > PAGINATION_LIMIT && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={tickets.length === 0}
          />
        )}
      </div>
    </main>
  );
};

export default Tickets;
