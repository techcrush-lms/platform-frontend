import { socketService } from '@/lib/services/socketService';
import { ChatTab, getAvatar, SystemRole } from '@/lib/utils';
import {
  fetchContacts,
  fetchOrgContacts,
  retrieveMessages,
  switchChatTab,
} from '@/redux/slices/chatSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { MessagesResponse } from '@/types/chat';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useContacts from '@/hooks/page/useContacts';

const ContactSkeleton = ({ length = 5 }) => {
  return (
    <div className='w-full'>
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className='flex items-center px-4 py-3 border-b border-gray-300 dark:border-black-2 animate-pulse'
        >
          <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700' />
          <div className='ml-3 flex-1 min-w-0'>
            <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1' />
            <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2' />
          </div>
        </div>
      ))}
    </div>
  );
};

const ContactLists = ({ searchQuery }: { searchQuery: string }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token, profile } = useSelector((state: RootState) => state.auth);
  const { org } = useSelector((state: RootState) => state.org);
  const { contacts, contactsLoading } = useContacts();

  const groupByFirstLetter = <T,>(
    items: T[],
    key: keyof T | ((item: T) => string)
  ) => {
    const grouped: Record<string, T[]> = {};

    items.forEach((item) => {
      const value = typeof key === 'function' ? key(item) : item[key];

      if (typeof value === 'string' && value.length > 0) {
        const firstLetter = value[0].toUpperCase();
        if (!grouped[firstLetter]) grouped[firstLetter] = [];
        grouped[firstLetter].push(item);
      }
    });

    const sortedGrouped: Record<string, T[]> = {};
    Object.keys(grouped)
      .sort()
      .forEach((letter) => {
        sortedGrouped[letter] = grouped[letter];
      });

    return sortedGrouped;
  };

  // 1. Filter contacts using searchQuery
  const filteredContacts = contacts?.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Group filtered contacts by first letter
  const groupedContacts = groupByFirstLetter(filteredContacts, 'name');

  const openChat = (contactId: string) => {
    dispatch(retrieveMessages({ token: token || '', chatBuddy: contactId }));

    const handleMessagesRetrieved = (response: MessagesResponse) => {
      if (response.status === 'success') {
        const chatId = response.data.chatId;

        const url =
          profile?.role.role_id === SystemRole.USER
            ? `/dashboard/messages/${chatId}/chat/${contactId}`
            : `/messages/${chatId}/chat/${contactId}`;

        router.push(url);
        dispatch(switchChatTab(ChatTab.ALL));
      }
    };

    socketService.on(
      `messagesRetrieved:${profile?.id}`,
      handleMessagesRetrieved
    );
  };

  useEffect(() => {
    return () => {
      socketService.off(`messagesRetrieved:${profile?.id}`);
    };
  }, []);

  return (
    <div className='w-full overflow-y-auto rounded-md h-[64vh] max-h-[64vh] md:max-h-[60vh] lg:max-h-[66vh]'>
      {contactsLoading ? (
        <ContactSkeleton />
      ) : filteredContacts.length === 0 ? (
        <div className='text-center text-gray-500 dark:text-gray-400 py-6'>
          No contacts found.
        </div>
      ) : (
        <>
          {Object.keys(groupedContacts).map((letter) => (
            <div key={letter} className='px-4 py-2'>
              <h4 className='font-semibold text-xs text-gray-500 mb-1'>
                {letter}
              </h4>
              <ul>
                {groupedContacts[letter].map((contact: any, index: number) => (
                  <li
                    onClick={() => openChat(contact.id)}
                    key={index}
                    className='flex items-center px-2 py-2 border-b dark:border-black-2 border-gray-300 cursor-pointer hover:bg-primary-main hover:text-white dark:hover:text-white'
                  >
                    {(contact?.profile?.profile_picture || contact?.name) && (
                      <img
                        src={getAvatar(
                          contact.profile?.profile_picture,
                          contact.name
                        )}
                        alt={contact.name}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    )}
                    <div className='ml-3 flex-1 min-w-0'>
                      <p className='font-medium text-sm truncate'>
                        {contact.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ContactLists;
