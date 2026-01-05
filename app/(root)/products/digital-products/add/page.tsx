'use client';

import AddDigitalProductForm from '@/components/dashboard/product/digital-product/AddDigitalProductForm';
import PageHeading, { BreadcrumbLayer } from '@/components/PageHeading';
import React, { Suspense } from 'react';

const BREADCRUMB_LAYERS: BreadcrumbLayer[] = [
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'Digital Products',
    href: '/products/digital-products',
  },
  {
    title: 'Add Digital Product',
    href: '/products/digital-products/add',
  },
];

const AddDigitalProduct = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add Digital Product'
          enableBreadCrumb={true}
          layer2={BREADCRUMB_LAYERS[0].title}
          layer2Link={BREADCRUMB_LAYERS[0].href}
          layer3={BREADCRUMB_LAYERS[1].title}
          layer3Link={BREADCRUMB_LAYERS[1].href}
          layer4={BREADCRUMB_LAYERS[2].title}
          enableBackButton={true}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <div className='mt-6'>
            <AddDigitalProductForm />
          </div>
        </Suspense>
      </div>
    </main>
  );
};

export default AddDigitalProduct;
