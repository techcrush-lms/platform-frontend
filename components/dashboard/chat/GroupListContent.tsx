import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ChatGroup, ChatGroupData } from '@/types/chat-group'; // <-- assuming you saved the provided interfaces in chatGroup.ts
import { ChatTab, getAvatar, SystemRole } from '@/lib/utils';
import { retrieveMessages, switchChatTab } from '@/redux/slices/chatSlice';
import { MessagesResponse } from '@/types/chat';
import { socketService } from '@/lib/services/socketService';

/* ------------------ Props ------------------ */
interface GroupListContentProps {
  index: number;
  group: ChatGroupData & { isShimmer?: boolean };
  groups: (ChatGroupData & { isShimmer?: boolean })[];
}

/* ------------------ Component ------------------ */
const GroupListContent = ({ index, group, groups }: GroupListContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, profile } = useSelector((state: RootState) => state.auth);
  const { id: activeChatId }: { id: string } = useParams();
  const router = useRouter();

  /* ------------------ Helpers ------------------ */
  const formatLastMessageTime = (timestamp?: string | null) => {
    if (!timestamp) return '';
    try {
      const messageDate = new Date(timestamp);
      const now = new Date();
      if (isNaN(messageDate.getTime())) return '';

      const diffInMinutes =
        (now.getTime() - messageDate.getTime()) / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      const diffInDays = diffInHours / 24;

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
      if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
      return `${Math.floor(diffInDays / 365)}y ago`;
    } catch {
      return '';
    }
  };

  const openGroupChat = () => {
    dispatch(retrieveMessages({ token: token || '', chatGroup: group.id }));

    const handleMessagesRetrieved = (response: MessagesResponse) => {
      if (response.status === 'success') {
        const chatId = response.data.chatId;

        const url =
          profile?.role.role_id === SystemRole.USER
            ? `/dashboard/messages/${chatId}/chat-group/${group.id}`
            : `/messages/${chatId}/chat-group/${group.id}`;

        router.push(url);
        dispatch(switchChatTab(ChatTab.ALL));
      }
    };

    socketService.on(
      `messagesRetrieved:${profile?.id}`,
      handleMessagesRetrieved
    );
  };

  const getGroupName = () => group.name ?? 'Unnamed Group';

  const getGroupAvatar = () => {
    if (group.multimedia?.url) {
      return group.multimedia.url;
    }
    return getAvatar('', group.name || 'Group');
  };

  useEffect(() => {
    return () => {
      socketService.off(`messagesRetrieved:${profile?.id}`);
    };
  }, []);

  /* ------------------ Render ------------------ */
  return (
    <div
      key={index}
      className={clsx(
        'flex items-center px-4 py-3 border-b dark:border-black-2 border-gray-400 cursor-pointer hover:bg-primary-main hover:text-white dark:hover:text-white',
        activeChatId === group.id && 'bg-primary-main text-white',
        index === groups.length - 1 && 'border-b-0',
        index === 0 && 'pb-3'
      )}
      onClick={() => openGroupChat()}
    >
      <img
        src={getGroupAvatar()}
        alt={getGroupName()}
        className='w-10 h-10 rounded-full object-cover'
      />
      <div className='ml-3 flex-1 min-w-0'>
        <div className='flex justify-between items-center'>
          <p
            className={clsx(
              'font-bold text-sm truncate',
              activeChatId === group.id ? 'text-white' : 'dark:text-gray-100'
            )}
          >
            {getGroupName()}
          </p>
          <span className='text-xs font-medium'>
            {formatLastMessageTime(group.lastMessage?.created_at)}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <p className='text-sm truncate'>{group.lastMessage?.message || ''}</p>
          {/* Optionally show unread count if backend supports */}
          {/* {group.chat?.unread?.some((u) => u.unread) && (
            <span className='ml-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-primary-main font-semibold'>
              {group.chat.unread.reduce((sum, u) => sum + u.count, 0)}
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default GroupListContent;
