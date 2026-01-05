'use client';

import React, { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { IoIosClose } from 'react-icons/io';
import BottomMenu from './BottomMenu';

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <aside className='fixed top-0 left-0 z-40 w-68 h-screen pt-6 transition-transform -translate-x-full bg-neutral-2 border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700'>
      <div className='h-full flex flex-col bg-neutral-2 dark:bg-gray-800'>
        <div className='flex justify-between items-start px-3'>
          <Link href='/' className='flex items-center justify-between mr-4'>
            <Logo width={120} height={120} />
          </Link>
        </div>
        <div className='flex-1 overflow-y-auto py-5'>
          <SidebarMenu />
        </div>
        <BottomMenu />
      </div>
    </aside>
  );
};

export default SidebarNav;
