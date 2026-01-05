'use client';

import Chat from '@/components/dashboard/chat/Chat';
import { useParams } from 'next/navigation';
import React from 'react';

const MessageBox = () => {
  const { id: chatId, chatbuddyId }: { id: string; chatbuddyId: string } =
    useParams();
  return (
    <div className='w-full rounded-xl h-[80vh] md:h-full border dark:border-black-2 mb-3'>
      <Chat chatId={chatId} chatbuddyId={chatbuddyId} />
    </div>
  );
};

export default MessageBox;
