'use client';

import DigitalProductsList from '@/components/dashboard/product/digital-product/DigitalProductsList';
import PhysicalProductsList from '@/components/dashboard/product/physical-product/PhysicalProductsList';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import useShippingLocations from '@/hooks/page/useShippingLocations';
import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const PhysicalProducts = () => {
  const { shippingLocations } = useShippingLocations();

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Physical Products'
          brief='Simplify the way you build and manage physical products'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Physical Products'
          ctaButtons={
            shippingLocations.length > 0 ? (
              <div className='flex-shrink-0 self-start'>
                <Link
                  href='/products/physical-products/add'
                  className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg items-center'
                >
                  <Icon url='/icons/landing/plus.svg' /> Add Physical Product
                </Link>
              </div>
            ) : (
              <div className='flex-shrink-0 self-start'>
                <Link
                  href='/settings?tab=shipping-locations&redirect=/products/physical-products'
                  className='text-md flex gap-1 bg-primary p-2 px-4 rounded-lg items-center'
                >
                  <MapPin className='w-4 h-4 mr-1' /> Set Up Shipping Location
                </Link>
              </div>
            )
          }
        />

        <section className='my-4'>
          <PhysicalProductsList />
        </section>
      </div>
    </main>
  );
};

export default PhysicalProducts;
