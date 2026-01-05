// hooks/useNewAccountToken.ts
import { verifyEmailToken } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { VerificationTokenDetails } from '@/types/account';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type TokenStatus = 'loading' | 'valid' | 'expired' | 'used' | 'invalid';

export const useNewAccountToken = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();
  const router = useRouter();

  const [userDetails, setUserDetails] =
    useState<VerificationTokenDetails | null>(null);
  const [status, setStatus] = useState<TokenStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      setStatus('loading');
      setError(null);

      const token = params.get('token');
      if (!token) {
        setStatus('invalid');
        setError('Invalid link');
        return;
      }

      try {
        const response: any = await dispatch(verifyEmailToken({ token }));

        if (response.type === 'auth/verify-email-token/rejected') {
          const errMsg = response.payload?.message || 'Invalid link';

          if (errMsg.includes('expired')) {
            setStatus('expired');
            setUserDetails(response.payload?.data);
          } else if (errMsg.includes('already used')) {
            setStatus('used');
          } else {
            setStatus('invalid');
          }

          setError(errMsg);
          return;
        }

        setStatus('valid');
      } catch (err) {
        setStatus('invalid');
        setError(err instanceof Error ? err.message : 'Invalid link');
      }
    };

    initialize();
  }, [params, dispatch]);

  console.log();

  return {
    userDetails,
    status,
    error,
    token: params.get('token'),
  };
};
