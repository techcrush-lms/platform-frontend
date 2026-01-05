'use client';

import React from 'react';
import PageHeading from '@/components/PageHeading';
import { MessageCircle, Clock, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const WhatsappNotification = () => {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='WhatsApp Campaigns'
          brief='Send personalized WhatsApp messages to your customers'
          enableBreadCrumb={true}
          layer2='Campaigns'
          layer3='WhatsApp'
          enableBackButton={true}
        />

        {/* Coming Soon Content */}
        <div className='flex flex-col items-center justify-center py-2'>
          {/* Main Coming Soon Card */}
          <Card className='w-full max-w-4xl dark:border-gray-600'>
            <CardContent className='p-8 sm:p-12'>
              <div className='text-center'>
                {/* Icon */}
                <div className='flex justify-center mb-6'>
                  <div className='relative'>
                    <div className='p-4 bg-green-100 dark:bg-green-900/20 rounded-full'>
                      <MessageCircle className='w-12 h-12 text-green-600 dark:text-green-400' />
                    </div>
                    <div className='absolute -top-2 -right-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full'>
                      <Clock className='w-6 h-6 text-yellow-600 dark:text-yellow-400' />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Coming Soon
                </h2>

                {/* Description */}
                <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto'>
                  We're working hard to bring you powerful WhatsApp campaign
                  features. Soon you'll be able to send personalized messages,
                  track delivery status, and engage with your customers directly
                  through WhatsApp.
                </p>

                {/* Features Preview */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                  <div className='text-center p-4'>
                    <div className='p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg inline-block mb-3'>
                      <MessageCircle className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Bulk Messaging
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Send personalized messages to multiple customers at once
                    </p>
                  </div>

                  <div className='text-center p-4'>
                    <div className='p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg inline-block mb-3'>
                      <Zap className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Instant Delivery
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Reach your customers instantly with real-time delivery
                    </p>
                  </div>

                  <div className='text-center p-4'>
                    <div className='p-3 bg-green-100 dark:bg-green-900/20 rounded-lg inline-block mb-3'>
                      <MessageCircle className='w-6 h-6 text-green-600 dark:text-green-400' />
                    </div>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Rich Media
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Send images, videos, and documents to enhance engagement
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Button
                    variant='primary'
                    className='px-6 py-3'
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Go Back
                  </Button>
                  <Link href='/campaigns/email'>
                    <Button variant='outline' className='px-6 py-3'>
                      Try Email Campaigns
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default WhatsappNotification;
