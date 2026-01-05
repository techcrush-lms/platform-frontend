import DigitalProductsList from '@/components/dashboard/product/digital-product/DigitalProductsList';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import React from 'react';

const DigitalProducts = () => {
  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Digital Products'
          brief='Simplify the way you build and manage digital products'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Digital Products'
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Link
                href='/products/digital-products/add'
                className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg'
              >
                <Icon url='/icons/landing/plus.svg' /> Add Digital Product
              </Link>
            </div>
          }
        />

        <section className='my-4'>
          <DigitalProductsList />
        </section>
      </div>
    </main>
  );
};

export default DigitalProducts;
