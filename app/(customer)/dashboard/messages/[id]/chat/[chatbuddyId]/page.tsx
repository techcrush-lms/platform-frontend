'use client';

import Chat from '@/components/dashboard/chat/Chat';
import { useParams } from 'next/navigation';
import React from 'react';

const ChatPage = () => {
  const params = useParams();
  const { id: chatId, chatbuddyId } = params;

  return (
    <div className='w-full rounded-xl h-full border dark:border-black-2 mb-3 flex'>
      <Chat
        chatId={chatId as string}
        chatbuddyId={chatbuddyId as string}
        height='max-h-[64vh] md:max-h-[60vh] lg:max-h-[68vh]'
        enabledBackButton={true}
      />
    </div>
  );
};

export default ChatPage;
