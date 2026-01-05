'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const OnboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return router.push('/');
  }
  return <>{children}</>;
};

export default OnboardLayout;
