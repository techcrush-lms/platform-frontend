'use client';

import Chat from '@/components/dashboard/chat/Chat';
import ViewCustomer from '@/components/dashboard/customers/ViewCustomer';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import useCustomer from '@/hooks/page/useCustomer';
import { PlusIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosChatboxes } from 'react-icons/io';

const Customer = () => {
  const { customer } = useCustomer();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Customer Details'
          brief='Manage your customer'
          enableBreadCrumb
          layer2='Customer'
          layer3='Customer Details'
          layer2Link='/customers'
          enableBackButton
          ctaButtons={
            <div className='flex flex-shrink-0 self-start gap-2'>
              <Button
                variant='primary'
                className='text-md bg-primary gap-1 py-2 rounded-lg flex items-center px-3'
                onClick={() => setChatOpen(!chatOpen)}
              >
                <IoIosChatboxes className='text-lg' />
                {chatOpen ? 'Close Chat' : 'Chat'}
              </Button>
              <Link
                href={`/campaigns/email/compose?customerId=${customer?.id}`}
                className='text-md border-primary-main text-primary-main py-1 dark:text-white hover:bg-primary-800 hover:text-white px-3 flex items-center gap-1 border rounded-lg'
                // onClick={() => setChatOpen(!chatOpen)}
              >
                <PlusIcon className='text-md' />
                Compose
              </Link>
            </div>
          }
        />

        <ViewCustomer />

        {customer && chatOpen && (
          <div className='fixed bottom-4 right-4 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-10 '>
            <>
              <Chat
                chatbuddyId={customer?.id!}
                // height='h-[50vh] max-h-[40vh] md:max-h-[30vh] lg:max-h-[38vh]'
                enabledBackButton={false}
                rightSideComponent={
                  <button onClick={() => setChatOpen(false)}>
                    <XIcon />
                  </button>
                }
              />
            </>
          </div>
        )}
      </div>
    </main>
  );
};

export default Customer;
