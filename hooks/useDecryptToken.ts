import { LoginProps, RegisterFormProps } from '@/lib/schema/auth.schema';
import { decryptInput, emailSplit } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type EmailData = {
  full: string;
  parts: string[];
};

export const useTokenDecrypt = <T extends LoginProps | RegisterFormProps>(
  token: string
) => {
  const params = useSearchParams();
  const router = useRouter();

  const [emailData, setEmailData] = useState<EmailData | null>(null);

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
        const decrypted = decryptInput(token);
        const { email } = JSON.parse(decrypted) as T;

        if (!email || typeof email !== 'string') {
          throw new Error('Invalid email in token');
        }

        const parts = emailSplit(email);
        setEmailData({ full: email, parts });
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
    router.back();
  };

  return {
    emailData,
    isLoading,
    error,
    setEmailData,
  };
};
