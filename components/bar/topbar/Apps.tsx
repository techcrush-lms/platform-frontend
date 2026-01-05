import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import React, { useState } from 'react';
import { HiArchive } from 'react-icons/hi';

const Apps = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: {
    profileDialog: boolean;
    appsDialog: boolean;
  };
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      profileDialog: boolean;
      appsDialog: boolean;
    }>
  >;
}) => {
  const handleToggle = () =>
    setIsOpen({ appsDialog: !isOpen.appsDialog, profileDialog: false });

  return (
    <div>
      <button
        type='button'
        onClick={handleToggle}
        className='relative p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
      >
        <span className='sr-only'>View apps</span>
        {/* <!-- Icon --> */}
        <svg
          className='w-6 h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'></path>
        </svg>
      </button>
      {/* <!-- Dropdown menu --> */}
      {isOpen.appsDialog && (
        <div className='absolute overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white divide-y divide-gray-100 shadow-lg dark:bg-gray-700 dark:divide-gray-600 rounded-xl right-12'>
          <div className='block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300'>
            Apps
          </div>
          <div className='grid grid-cols-3 gap-4 p-4'>
            {sidebarLinks.map((sidebarLink) => {
              const Icon = sidebarLink.icon;
              return (
                <Link
                  key={sidebarLink.route}
                  href={sidebarLink.route}
                  className='block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group'
                >
                  <>
                    <Icon className='mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400' />
                    <div className='text-sm text-gray-900 dark:text-white'>
                      {sidebarLink.label}
                    </div>
                  </>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Apps;
