'use client';

import React from 'react';
import Select from '../Select';
import Icon from '../ui/Icon';

const ClientTableFilters = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* Subscription Status */}
      <div className='relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <Icon
            url='/icons/clients/terminal-black.svg'
            className='text-gray-400 w-5 h-5'
          />
        </div>
        <Select
          name='status'
          className='font-bold text-base pl-10 w-full' // w-full to fill grid cell
          data={['Subscription Status']}
          required={true}
          value={'Subscription Status'}
        />
      </div>

      {/* Date Joined */}
      <div className='relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <Icon
            url='/icons/clients/calendar.svg'
            className='text-gray-400 w-5 h-5'
          />
        </div>
        <Select
          name='date'
          className='font-bold text-base pl-10 w-full'
          data={['Date Joined']}
          required={true}
          value={'Date Joined'}
        />
      </div>

      {/* Location */}
      <div className='relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <Icon
            url='/icons/clients/location.svg'
            className='text-gray-400 w-5 h-5'
          />
        </div>
        <Select
          name='location'
          className='font-bold text-base pl-10 w-full'
          data={['Location']}
          required={true}
          value={''}
        />
      </div>

      {/* Services Subscribed */}
      <div className='relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <Icon
            url='/icons/clients/currency.svg'
            className='text-gray-400 w-5 h-5'
          />
        </div>
        <Select
          name='services'
          className='font-bold text-base pl-10 w-full'
          data={['Services Subscribed']}
          required={true}
          value={''}
        />
      </div>
    </div>
  );
};

export default ClientTableFilters;
