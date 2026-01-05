import { groups, sidebarLinks } from '@/constants';
import { Drawer, Sidebar } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import SidebarMenu from './SidebarMenu';
import Logo from '@/components/ui/Logo';
import BottomMenu from './BottomMenu';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <aside>
      <button
        onClick={() => setIsOpen(true)}
        className='p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
        aria-label='Toggle sidebar'
      >
        <svg
          aria-hidden='true'
          className='w-6 h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          ></path>
        </svg>
        <svg
          aria-hidden='true'
          className='hidden w-6 h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          ></path>
        </svg>
      </button>
      <Drawer open={isOpen} onClose={handleClose} className='bg-neutral-2'>
        <Drawer.Items>
          <div className='h-full flex flex-col bg-neutral-2 dark:bg-gray-800'>
            <div className='flex justify-between items-start px-3'>
              <Link href='' className='flex items-center justify-between mr-4'>
                <Logo width={120} height={120} />
              </Link>
              <button onClick={handleClose}>
                <IoIosClose className='text-2xl' />
              </button>
            </div>
            <div className='flex-1 overflow-y-auto py-2'>
              <SidebarMenu handleClose={handleClose} />
            </div>

            <BottomMenu />
          </div>
        </Drawer.Items>
      </Drawer>
    </aside>
  );
};

export default MobileNav;
