import PageHeading from '@/components/PageHeading';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Clock, Send } from 'lucide-react';
import Link from 'next/link';
import ThemeDiv from '@/components/ui/ThemeDiv';

const EmailNotification = () => {
  return (
    <main className='h-[100vh]'>
      <header className='section-container'>
        {/* Page Heading */}
        <PageHeading
          title='Email Notifications'
          enableBreadCrumb={true}
          layer2='Notifications'
          layer3='Email'
        />
      </header>

      {/* Pre-header Section */}
      <section className='section-container-reduced-padding text-left md:text-center text-gray-900 dark:text-white'>
        <h2 className='text-2xl font-bold tracking-tight'>
          Manage Your Email Notifications
        </h2>
        <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
          Choose to send email notifications immediately or schedule them for a
          later time. Stay in control of your communication.
        </p>
      </section>

      {/* Notification Options */}
      <section className='section-container-reduced-padding grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 dark:text-white'>
        {/* Instant notification Card */}
        <ThemeDiv className='hover:shadow-lg transition-shadow duration-300'>
          <CardContent className='p-6 flex flex-col justify-between h-full'>
            <div className='flex items-center gap-4 mb-4'>
              <Send className='text-red-600' size={28} />
              <h3 className='text-xl font-semibold'>
                Send Instant Notification
              </h3>
            </div>
            <p className='text-muted-foreground mb-6'>
              Trigger an immediate email to selected recipients. Ideal for
              urgent updates or real-time communication.
            </p>
            <Link href='/notifications/email/instant'>
              <Button variant='primary' className='w-full'>
                Send Now
              </Button>
            </Link>
          </CardContent>
        </ThemeDiv>

        {/* Scheduled notifications Card */}
        <ThemeDiv className='hover:shadow-lg transition-shadow duration-300'>
          <CardContent className='p-6 flex flex-col justify-between h-full'>
            <div className='flex items-center gap-4 mb-4'>
              <Clock className='text-green-600' size={28} />
              <h3 className='text-xl font-semibold'>Schedule an email</h3>
            </div>
            <p className='text-muted-foreground mb-6'>
              Plan and automate your email notifications by selecting a future
              date and time to notify your audience.
            </p>
            <Link href='/notifications/email/scheduled'>
              <Button variant='outline' className='w-full'>
                Schedule
              </Button>
            </Link>
          </CardContent>
        </ThemeDiv>
      </section>
    </main>
  );
};

export default EmailNotification;
