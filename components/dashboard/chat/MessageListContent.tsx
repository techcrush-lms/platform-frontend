import Icon from '@/components/ui/Icon';
import { getAvatar, SystemRole } from '@/lib/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { Chat } from '@/types/chat';
import { Unread } from '@/types/chat-group';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface MessageListContentProps {
  index: number;
  chat: Chat & { isShimmer?: boolean };
  chats: (Chat & { isShimmer?: boolean })[];
}

const MessageListContent = ({
  index,
  chat,
  chats,
}: MessageListContentProps) => {
  // Format last message time with proper fallback
  const formatLastMessageTime = (timestamp?: string | null) => {
    if (!timestamp) return '';

    try {
      const messageDate = new Date(timestamp);
      const now = new Date();

      // Check if date is valid
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
    } catch (error) {
      return '';
    }
  };

  const router = useRouter();
  const { profile } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const { id: chatId }: { id: string } = useParams();

  const openChat = () => {
    let url = '';
    if (chat.is_group && chat.chat_group) {
      url =
        profile?.role.role_id === SystemRole.USER
          ? `/dashboard/messages/${chat.id}/chat-group/${chat.chat_group.id}`
          : `/messages/${chat.id}/chat-group/${chat.chat_group.id}`;
    } else if (chat.chat_buddy) {
      url =
        profile?.role.role_id === SystemRole.USER
          ? `/dashboard/messages/${chat.id}/chat/${chat.chat_buddy.id}`
          : `/messages/${chat.id}/chat/${chat.chat_buddy.id}`;
    }

    router.push(url);
  };

  const getChatName = () => {
    if (chat?.is_group || chat?.chat_group) {
      return chat?.chat_group?.name;
    } else if (chat.chat_buddy) {
      return chat.chat_buddy.name;
    }
    return 'Unknown';
  };

  const getChatAvatar = () => {
    if (chat?.is_group || chat.chat_group?.multimedia?.url) {
      return chat?.chat_group?.multimedia.url;
    } else if (chat.chat_buddy) {
      return getAvatar(
        chat.chat_buddy?.profile?.profile_picture!,
        chat.chat_buddy?.name
      );
    }
    return getAvatar('', 'Group');
  };

  // const myUnread = JSON.parse(chat?.unread as Unread[]).find(
  //   (unread_data: Unread) => unread_data.user_id === profile?.id
  // );

  // console.log(myUnread);

  return (
    <div
      key={index}
      className={clsx(
        'flex items-center px-4 py-3 border-b dark:border-black-2 border-gray-400 cursor-pointer hover:bg-primary-main hover:text-white dark:hover:text-white',
        chatId === chat.id && 'bg-primary-main text-white',
        index === chats.length - 1 && 'border-b-0',
        index === 0 && 'pb-3'
      )}
      onClick={() => openChat()}
    >
      <img
        src={getChatAvatar()}
        alt={getChatName()}
        className='w-10 h-10 rounded-full object-cover'
      />
      <div className='ml-3 flex-1 min-w-0'>
        <div className='flex justify-between items-center'>
          <p
            className={clsx(
              'font-bold text-sm truncate',
              chatId === chat.id ? 'text-white' : ' dark:text-gray-100'
            )}
          >
            {getChatName()}
          </p>
          <span className={clsx('text-xs font-medium')}>
            {formatLastMessageTime(chat.last_message_at)}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <p className={clsx('text-sm truncate')}>{chat.last_message}</p>
          {Boolean(chat?.unread) && (
            <span
              className={clsx(
                'ml-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-primary-main font-semibold'
              )}
            >
              {chat?.unread as number}
            </span>
          )}
          {chat.messages[0]?.read && <Icon url='/icons/chat/check.svg' />}
        </div>
      </div>
    </div>
  );
};

export default MessageListContent;
