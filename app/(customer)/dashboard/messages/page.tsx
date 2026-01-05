'use client';

import Icon from '@/components/ui/Icon';
import Logo from '@/components/ui/Logo';
import { useParams } from 'next/navigation';
import React from 'react';

const Messages = () => {
  const params = useParams();

  return (
    <div className='w-full rounded-xl h-full border dark:border-black-2 mb-3 hidden md:flex'>
      <div className='flex flex-col justify-center items-center h-full space-y-10 mx-auto'>
        <Logo />
        <div className='text-xs md:text-sm font-bold flex flex-col justify-center items-center'>
          <span className='flex gap-1 dark:text-white'>
            <Icon
              url='/icons/chat/lock.svg'
              width={15}
              height={15}
              className='dark:invert dark:brightness-0'
            />
            Messages are sent and encrypted with{' '}
          </span>
          <span className='text-primary-main dark:text-primary-faded'>
            end to end encryption
          </span>
        </div>
      </div>
    </div>
  );
};

export default Messages;
