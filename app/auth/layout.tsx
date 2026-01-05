'use client';

import { AppDispatch, RootState } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AuthLayoutContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (token) {
      const redirUrl = searchParams.get('redirect_url');

      if (redirUrl) {
        // Decode the URL if it's encoded
        const decodedUrl = decodeURIComponent(redirUrl);

        // Validate that it's a relative URL or same origin for security
        try {
          if (typeof window !== 'undefined') {
            const url = new URL(decodedUrl, window.location.origin);

            // Only allow redirects to same origin or relative paths
            if (
              url.origin === window.location.origin ||
              decodedUrl.startsWith('/')
            ) {
              router.push(decodedUrl);
            } else {
              console.warn('Invalid redirect URL:', decodedUrl);
              // Fallback to dashboard if invalid URL
              router.push('/dashboard/home');
            }
          }
        } catch (error) {
          console.warn('Invalid redirect URL format:', decodedUrl);
          // Fallback to dashboard if invalid URL format
          router.push('/dashboard/home');
        }
      } else {
        // Default redirect if no redir_url
        router.push('/dashboard/home');
      }
    }
  }, [token, searchParams, router]);

  return <>{children}</>;
};

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </Suspense>
  );
};

export default AuthLayout;
