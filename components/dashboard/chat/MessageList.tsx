'use client';

import { Chat } from '@/types/chat';
import MessageListContent from './MessageListContent';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { switchChatTab } from '@/redux/slices/chatSlice';
import { ChatTab } from '@/lib/utils';

export interface MessageListProps {
  chats: Chat[];
}

export default function MessageList({ chats }: MessageListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { chatTab } = useSelector((state: RootState) => state.chat);
  return (
    <div className='relative w-full md:max-w-md mx-auto bg-white dark:bg-gray-800 rounded-md max-h-[64vh] md:max-h-[60vh] lg:max-h-[66vh] flex flex-col h-[64vh] md:h-[60vh] lg:h-[82vh]'>
      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto pr-1'>
        {chats.map((chat, index) => (
          <MessageListContent
            key={index}
            index={index}
            chat={chat}
            chats={chats}
          />
        ))}
      </div>
    </div>
  );
}
