import { verifyPasswordToken } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

type UserData = {
  userId: string;
  email: string;
};

export const useVerifyToken = (token: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      setError(null);

      const token = params.get('token');

      if (!token) {
        handleError('Invalid verification link');
        return;
      }

      try {
        const response: any = await dispatch(verifyPasswordToken({ token }));

        if (response.type === 'auth/verify-password-token/rejected') {
          throw new Error(response.payload.message);
        }

        setUserDetails(response.payload.data);
      } catch (err) {
        console.error('Initialization error:', err);
        handleError(
          err instanceof Error ? err.message : 'Invalid verification link'
        );
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [params, router]);

  const handleError = (message: string) => {
    setError(message);
    toast.error(message);
    router.push('/auth/signin');
  };

  return {
    userDetails,
    isLoading,
    error,
    setUserDetails,
    token,
  };
};
