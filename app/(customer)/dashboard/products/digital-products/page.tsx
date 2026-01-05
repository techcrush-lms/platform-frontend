'use client';

import ProductFilters from '@/components/dashboard/product/course/ProductFilters';
import PublicProductGridItem from '@/components/dashboard/product/course/PublicCourseGridItem';
import PageHeading from '@/components/PageHeading';
import Pagination from '@/components/Pagination';
import NotFound from '@/components/ui/NotFound';
import useProducts from '@/hooks/page/useProducts';
import { ProductType } from '@/lib/utils';
import React, { useState } from 'react';

const DigitalProducts = () => {
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('All Prices');
  const {
    products = [],
    count = 0,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    limit = 10,
    currentPage,
  } = useProducts(ProductType.DIGITAL_PRODUCT, search, priceRange);

  return (
    <main className='min-h-screen bg-black text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Digital Products'
          brief='Buy your digital products with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/dashboard/products'
          layer3='Digital Products'
          layer3Link='/dashboard/products/digtatal-products'
        />
        <div className='flex flex-col gap-4 mt-2'>
          <ProductFilters
            search={search}
            priceRange={priceRange}
            onSearch={setSearch}
            onPriceRangeChange={setPriceRange}
          />
          {loading ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className='bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 animate-pulse'
                >
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded'></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <NotFound
              title='No Digital Product Found'
              description='No digital product are currently available. Check back later or try searching for different courses.'
              searchPlaceholder='Search for digital products...'
              onSearch={handleSearchSubmit}
            />
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {products.map((product) => (
                <PublicProductGridItem
                  key={product.id}
                  id={product.id}
                  details={product}
                  type={product.type}
                  title={product.title}
                  imageSrc={product.multimedia?.url}
                  price={product.price!}
                  onView={() => {}}
                  onBuy={() => {}}
                />
              ))}
            </div>
          )}

          {!loading && count > limit && (
            <Pagination
              currentPage={currentPage}
              total={count}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default DigitalProducts;
