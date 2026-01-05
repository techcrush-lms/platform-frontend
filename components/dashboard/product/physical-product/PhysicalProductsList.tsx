'use client';

import ThemeDiv from '@/components/ui/ThemeDiv';
import React from 'react';
import ProductGridItem from '../ProductGridItem';
import Filter from '@/components/Filter';
import { PAGINATION_LIMIT, ProductStatus, ProductType } from '@/lib/utils';
import ProductGridItemSkeleton from '../ProductGridItemSkeleton';
import Pagination from '@/components/Pagination';
import usePhysicalProducts from '@/hooks/page/usePhysicalProducts';
import Icon from '@/components/ui/Icon';
import { useSearchParams, useRouter } from 'next/navigation';
import { Package2Icon, AlertTriangle, MapPin, ArrowRight } from 'lucide-react';
import useShippingLocations from '@/hooks/page/useShippingLocations';
import { Button } from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const PhysicalProductsList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    physicalProducts,
    count,
    currentPage,
    loading,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    handleFilterByDateSubmit,
  } = usePhysicalProducts();

  const shippingLocations = useSelector(
    (state: RootState) => state.shipping.shippingLocations
  );

  return (
    <ThemeDiv className='mt-3 border-0 dark:bg-transparent'>
      <div className=''>
        {/* Shipping Location Warning */}
        {shippingLocations.length === 0 && (
          <div className='mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0' />
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1'>
                  Shipping Location Required
                </h4>
                <p className='text-sm text-amber-700 dark:text-amber-300 mb-3'>
                  You need to add at least one shipping location before you can
                  sell physical products. Customers need to know where you ship
                  from and the shipping costs.
                </p>
                <Button
                  onClick={() =>
                    router.push(
                      '/settings?tab=shipping-locations&redirect=/products/physical-products'
                    )
                  }
                  variant='outline'
                  size='sm'
                  className='bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                >
                  <MapPin className='w-4 h-4 mr-2' />
                  Add Shipping Location
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter - exact replication */}
        <div className='mb-2'>
          <Filter
            pageTitle='All Physical Products'
            pageTitleClass='text-xl'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />
        </div>

        {/* Physical products List - exact styling */}
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))}
            </>
          ) : physicalProducts.length > 0 ? (
            physicalProducts.map((item, index) => (
              <ProductGridItem
                key={index}
                id={item.id}
                imageSrc={item.multimedia.url}
                title={item.title}
                type={ProductType.PHYSICAL_PRODUCT}
                data={item}
              />
            ))
          ) : (
            <div className='col-span-full flex flex-col items-center justify-center py-16 text-center'>
              <Package2Icon className='w-10 h-10 text-gray-500 dark:text-gray-400 mb-2' />
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                {searchParams.has('q')
                  ? 'No Physical Products Found'
                  : 'No Physical Products Yet'}
              </h3>
              <p className='text-gray-500 dark:text-gray-400 max-w-md'>
                {searchParams.has('q')
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : shippingLocations.length === 0
                  ? 'Before you can add physical products, you need to set up at least one shipping location where you ship from.'
                  : 'Start by creating your first physical product. You can add products that customers can purchase and ship to them.'}
              </p>
              {searchParams.has('q') ? null : shippingLocations.length === 0 ? (
                <Button
                  onClick={() =>
                    router.push(
                      '/settings?tab=shipping-locations&redirect=/products/physical-products'
                    )
                  }
                  variant='primary'
                  size='sm'
                  className='mt-4'
                >
                  <MapPin className='w-4 h-4 mr-2' />
                  Set Up Shipping Location
                </Button>
              ) : null}
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
            noMoreNextPage={physicalProducts.length === 0}
          />
        )}
      </div>
    </ThemeDiv>
  );
};

export default PhysicalProductsList;
