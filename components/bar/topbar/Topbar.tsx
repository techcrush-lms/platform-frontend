'use client';

import React, { useState } from 'react';
import Profile from './Profile';
import Link from 'next/link';
import MobileNav from '../sidebar/MobileNav';
import RecentNotifications from './RecentNotifications';
import Icon from '@/components/ui/Icon';
import useCart from '@/hooks/page/useCart';
import { ShoppingCart, Store, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SystemRole, baseUrl, isBusiness } from '@/lib/utils';
import { StoreLink } from '@/components/StoreLink';
import CurrencySwitcher from '@/components/dashboard/CurrencySwitcher';
import toast from 'react-hot-toast';

const Topbar = () => {
  const { count } = useCart();
  const { profile } = useSelector((state: RootState) => state.auth);
  const { org } = useSelector((state: RootState) => state.org);
  const [currency, setCurrency] = useState('NGN');

  const handleVisitStore = () => {
    if (org?.business_slug) {
      window.open(
        `${baseUrl}/b/${org.business_slug}`,
        '_blank',
        'noopener,noreferrer'
      );
      toast.success('Opened in new tab!');
    }
  };

  return (
    <nav className='md:ml-60 px-2 sm:px-4 py-2 sm:py-2.5 z-50 bg-neutral-2 border-b dark:border-none border-gray-200 dark:bg-gray-800 shadow-light'>
      <div className='flex flex-wrap justify-between items-center gap-2'>
        <div className='flex justify-start items-center min-w-0 flex-1'>
          <Link
            href='/'
            className='flex items-center justify-between mr-2 sm:mr-4 md:hidden flex-shrink-0'
          >
            <Icon
              url='/icons/icon-white.png'
              width={24}
              height={24}
              className='rounded-lg hidden dark:block sm:w-[30px] sm:h-[30px]'
            />
            <Icon
              url='/icons/icon.png'
              width={24}
              height={24}
              className='rounded-lg block dark:hidden sm:w-[30px] sm:h-[30px]'
            />
          </Link>
          {/* <Search /> */}
          {/* Mobile nav */}
          <MobileNav />

          <div className='hidden sm:block min-w-0 flex-1'>
            <StoreLink slug={org?.business_slug!} />
          </div>
        </div>
        <div className='flex items-center lg:order-2 gap-2 sm:gap-2 flex-shrink-0'>
          {/* Currency Switcher - Show when org is selected */}
          {org && !isBusiness(profile?.role?.role_id as SystemRole) && (
            <>
              {/* Mobile - Compact inline */}
              <div className='sm:hidden'>
                <CurrencySwitcher />
              </div>

              {/* Desktop - Full component */}
              <div className='hidden sm:block'>
                <CurrencySwitcher />
              </div>
            </>
          )}

          {/* Mobile Store Link - Icon only */}
          {org?.business_slug && (
            <button
              onClick={handleVisitStore}
              className='sm:hidden p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              title='Visit Store'
            >
              <Store size={18} />
            </button>
          )}

          <RecentNotifications />

          {/* Cart Icon with Badge */}
          {profile?.role?.role_id === SystemRole.USER && (
            <Link
              href='/dashboard/cart'
              className='relative flex items-center mx-1 sm:mx-2'
            >
              <ShoppingCart
                size={20}
                className='text-gray-700 dark:text-gray-200 sm:w-6 sm:h-6'
              />
              {count > 0 && (
                <span className='absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-primary-main text-white text-[10px] sm:text-xs font-bold rounded-full px-1 sm:px-1.5 py-0.5 min-w-[16px] sm:min-w-[20px] text-center'>
                  {count}
                </span>
              )}
            </Link>
          )}

          {/* Apps */}
          {/* <Apps isOpen={isOpen} setIsOpen={setIsOpen} /> */}

          {/* Profile */}
          <Profile />
        </div>
      </div>
      {/* Drawer for mobile view */}
    </nav>
  );
};

export default Topbar;
