'use client';

import React, { useState } from 'react';
import { Card } from '../Card';
import Input from '../../ui/Input';
import MessageList from './MessageList';
import { ChatTab, cn, SystemRole } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ContactLists from './ContactLists';
import CreateTeamChat from './CreateTeamChat';
import GroupChatList from './GroupChatList';
import { EmptyState } from './EmptyState';
import { useChatEffects } from '@/hooks/page/chat/useChatEffects';
import { useChatGroupEffects } from '@/hooks/page/chat/useChatGroupEffects';
import { switchChatTab } from '@/redux/slices/chatSlice';
import { Plus } from 'lucide-react';

const shimmerMessages = Array(5).fill(null);

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { profile } = useSelector((state: RootState) => state.auth);

  const [openCreateTeamModal, setOpenCreateTeamModal] = useState(false);

  // custom hook
  const { chats, chatTab, isLoading, searchQuery, setSearchQuery, fetchChats } =
    useChatEffects();
  const { chat_groups } = useChatGroupEffects();

  const ChatShimmer = shimmerMessages.map((_, index) => (
    <div
      key={`shimmer-${index}`}
      className={`flex items-center gap-3 p-4 ${
        index !== shimmerMessages.length - 1
          ? 'border-b border-gray-100 dark:border-gray-700'
          : ''
      }`}
    >
      <div className='h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse' />
      <div className='flex-1 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
        <div className='h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
      </div>
      <div className='h-3 w-10 rounded bg-gray-200 dark:bg-gray-600 animate-pulse' />
    </div>
  ));

  return (
    <Card
      className={cn(
        'w-full md:w-[35%] h-full bg-neutral-2 p-4 flex-col rounded-lg',
        pathname === '/messages' || pathname === '/dashboard/messages'
          ? 'flex'
          : 'hidden md:flex'
      )}
    >
      {/* Tabs */}
      <div className='flex space-x-3 mb-4'>
        <TabButton
          label='All Chats'
          active={chatTab === ChatTab.ALL}
          onClick={() => fetchChats(ChatTab.ALL, searchQuery)}
        />
        <TabButton
          label='Unread'
          active={chatTab === ChatTab.UNREAD}
          onClick={() => fetchChats(ChatTab.UNREAD, searchQuery)}
        />
        <TabButton
          label='Groups'
          active={chatTab === ChatTab.GROUPS}
          onClick={() => fetchChats(ChatTab.GROUPS, searchQuery)}
        />
      </div>

      {/* Create Group */}
      {[SystemRole.BUSINESS_SUPER_ADMIN, SystemRole.BUSINESS_ADMIN].includes(
        profile?.role?.role_id as SystemRole
      ) &&
        chatTab === ChatTab.GROUPS && (
          <CreateTeamChat
            openCreateTeamModal={openCreateTeamModal}
            setOpenCreateTeamModal={setOpenCreateTeamModal}
          />
        )}

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        disabled={isLoading}
      />

      {/* Content */}
      {chatTab === ChatTab.CONTACTS && (
        <ContactLists searchQuery={searchQuery} />
      )}

      {chatTab === ChatTab.GROUPS && (
        <GroupChatList
          groups={chat_groups} // <-- replace later with group state from redux if needed
          openCreateTeamModal={openCreateTeamModal}
          setOpenCreateTeamModal={setOpenCreateTeamModal}
        />
      )}

      {[ChatTab.ALL, ChatTab.UNREAD].includes(chatTab) && (
        <>
          {isLoading ? (
            ChatShimmer
          ) : chats.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <MessageList chats={chats} />
          )}

          {/* Floating Action Button (inside card, not scrolling away) */}
          {chatTab === ChatTab.ALL && (
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={() => dispatch(switchChatTab(ChatTab.CONTACTS))}
                className=' bottom-4 right-4 bg-primary-main text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition'
              >
                <Plus className='w-6 h-6' />
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

/* Small subcomponents */
const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      'flex-1 text-xs font-bold py-2',
      active && 'bg-primary-main rounded-lg text-white'
    )}
    onClick={onClick}
  >
    {label}
  </button>
);

const SearchInput = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) => (
  <div className='relative mb-6'>
    <Input
      type='text'
      placeholder='Search'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className='w-full pl-8 pr-3 py-2 text-sm border rounded-md dark:border-black-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
    />
    <svg
      className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      />
    </svg>
  </div>
);

export default ChatSidebar;
