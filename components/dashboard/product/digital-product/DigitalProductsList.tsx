'use client';

import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';
import ProductGridItem from '../ProductGridItem';
import Filter from '@/components/Filter';
import { PAGINATION_LIMIT, ProductStatus, ProductType } from '@/lib/utils';
import ProductGridItemSkeleton from '../ProductGridItemSkeleton';
import useDigitalProducts from '@/hooks/page/useDigitalProducts';
import Pagination from '@/components/Pagination';
import Icon from '@/components/ui/Icon';
import { useSearchParams } from 'next/navigation';
import { FileIcon } from 'lucide-react';

const DigitalProductsList = () => {
  const searchParams = useSearchParams();

  const {
    digitalProducts,
    count,
    currentPage,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = useDigitalProducts();

  return (
    <ThemeDiv className='mt-3 border-0 dark:bg-transparent'>
      <div className=''>
        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Digital Products'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />
        </div>

        {/* Digital products List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))}
            </>
          ) : digitalProducts.length > 0 ? (
            digitalProducts.map((item, index) => (
              <ProductGridItem
                key={index}
                id={item.id}
                imageSrc={item.multimedia.url}
                title={item.title}
                type={ProductType.DIGITAL_PRODUCT}
                data={item}
              />
            ))
          ) : (
            <div className='col-span-full flex flex-col items-center justify-center py-16 text-center'>
              <FileIcon className='w-10 h-10 text-gray-500 dark:text-gray-400 mb-2' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                {searchParams.has('q')
                  ? 'No Digital Products Found'
                  : 'No Digital Products Yet'}
              </h3>
              <p className='text-gray-500 dark:text-gray-400 max-w-md'>
                {searchParams.has('q')
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : 'Start by creating your first digital product. You can add downloadable files, software, courses, or any digital content that customers can purchase and access instantly.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && count > PAGINATION_LIMIT && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={digitalProducts.length === 0}
          />
        )}
      </div>
    </ThemeDiv>
  );
};

export default DigitalProductsList;
