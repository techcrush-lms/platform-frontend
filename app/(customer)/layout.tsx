'use client';

import React, { useEffect, useState } from 'react';

import Bar from '@/components/bar/Index';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { SocketProvider } from '@/context/SocketProvider';
import useCart from '@/hooks/page/useCart';
import { safeRouterPush } from '@/lib/utils';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isClient, setIsClient] = useState(false);
  const { user, loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Log auth state for debugging
  useEffect(() => {
    if (isClient) {
      // console.log('RootLayout: Auth state changed', {
      //   hasToken: !!token,
      //   tokenLength: token?.length,
      //   hasUser: !!user,
      //   loading,
      // });
    }
  }, [token, user, loading, isClient]);

  // Handle redirect on client side only
  useEffect(() => {
    if (isClient && !token) {
      // console.log('RootLayout: No token, redirecting to signin');
      safeRouterPush(router, '/auth/signin');
    }
  }, [token, isClient, router]);

  // Show loading or redirect while on server
  if (!isClient) {
    return (
      <main className='flex h-screen w-full font-gilroy bg-white dark:bg-gray-900'>
        <div className='flex size-full flex-col'>
          <div className='main-container'>
            <div className='flex items-center justify-center h-screen'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main'></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Don't render children if no token (will redirect)
  if (!token) {
    return (
      <main className='flex h-screen w-full font-gilroy bg-white dark:bg-gray-900'>
        <div className='flex size-full flex-col'>
          <div className='main-container'>
            <div className='flex items-center justify-center h-screen'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main'></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // console.log('RootLayout: Rendering with token, setting up SocketProvider');

  return (
    <SocketProvider>
      <main className='flex h-screen w-full font-gilroy bg-white dark:bg-gray-900'>
        <div className='flex size-full flex-col'>
          <div className='main-container'>
            <Bar />
            {children}
          </div>
        </div>
      </main>
    </SocketProvider>
  );
};

export default RootLayout;
