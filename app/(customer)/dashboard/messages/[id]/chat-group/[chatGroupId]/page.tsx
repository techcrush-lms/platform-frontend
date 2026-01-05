'use client';

import Chat from '@/components/dashboard/chat/Chat';
import { useParams } from 'next/navigation';
import React from 'react';

const UserChatGroupMessageBox = () => {
  const { id: chatId, chatGroupId }: { id: string; chatGroupId: string } =
    useParams();
  return (
    <div className='w-full rounded-xl h-[80vh] md:h-full border dark:border-black-2 mb-3'>
      <Chat chatId={chatId} chatGroup={chatGroupId} />
    </div>
  );
};

export default UserChatGroupMessageBox;
