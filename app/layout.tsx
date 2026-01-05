import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';
import ProgressBar from '@/components/ProgressBar';
import 'nprogress/nprogress.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });

import ReduxProvider from '@/redux/redux-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import FirebaseNotificationProvider from './firebase/FirebaseProvider';

export const metadata: Metadata = {
  title: 'TechCrush LMS',
  description: 'Learn. Grow. Succeed.',
  icons: {
    icon: '/icons/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <FirebaseNotificationProvider>
        <html lang='en'>
          <head>
            <link rel='icon' href='/icons/icon.png' />
            <meta property='og:image' content='/icons/icon.png' />
            <meta name='twitter:image' content='/icons/icon.png' />
            <script
              type='application/ld+json'
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'TechCrush LMS',
                  url: 'https://lms.techcrush.pro',
                  logo: 'https://lms.techcrush.pro/icons/icon.png',
                  sameAs: [
                    'https://twitter.com/techcrushhq',
                    'https://www.linkedin.com/company/techcrushhq/',
                  ],
                }),
              }}
            />
          </head>
          <ConfettiProvider />
          <ToastProvider />
          <ProgressBar />
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <body className={`${nunito.className}`}>{children}</body>
          </ThemeProvider>
        </html>
      </FirebaseNotificationProvider>
    </ReduxProvider>
  );
}
