import { useCallback } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginOptions {
  onSuccess: (token: string) => void;
  onError?: (error: any) => void;
}

export const useGoogleLogin = () => {
  const loadGoogleScript = () => {
    return new Promise<void>((resolve) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const loginWithGoogle = useCallback(
    async ({ onSuccess, onError }: GoogleLoginOptions) => {
      try {
        await loadGoogleScript();

        const client = window.google.accounts.oauth2.initCodeClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY!,
          scope: 'profile email openid',
          redirect_uri: window.location.origin,
          callback: async (response: any) => {
            if (response.error) {
              onError?.(response.error);
              return;
            }

            try {
              const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  code: response.code,
                  client_id: process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY!,
                  client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
                  redirect_uri: window.location.origin,
                  grant_type: 'authorization_code',
                }),
              });

              const tokens = await tokenRes.json();

              if (tokens?.id_token) {
                onSuccess(tokens.id_token);
              } else {
                onError?.('No ID token received');
              }
            } catch (err) {
              onError?.(err);
            }
          },
          error_callback: (err: any) => {
            onError?.(err);
          },
        });

        client.requestCode();
      } catch (error) {
        onError?.(error);
      }
    },
    []
  );

  return { loginWithGoogle };
};
