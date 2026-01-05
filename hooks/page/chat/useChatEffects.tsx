import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useSocket } from '@/context/SocketProvider';
import { useDebounce } from '@/hooks/use-debounce';
import { socketService } from '@/lib/services/socketService';
import {
  chatsRetrieved,
  recentChatRetrieved,
  retrieveChats,
  switchChatTab,
} from '@/redux/slices/chatSlice';
import { ChatReadStatus, ChatTab } from '@/lib/utils';
import { RecentChatRetrievedResponse } from '@/types/chat';

export const useChatEffects = () => {
  const dispatch = useDispatch<AppDispatch>();

  // redux state
  const { chats, chatTab } = useSelector((state: RootState) => state.chat);
  const { token, profile } = useSelector((state: RootState) => state.auth);

  // ui state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // debounce search input
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // socket
  const { isConnected } = useSocket();

  /* ------------------ Fetch Chats ------------------ */
  const fetchChats = useCallback(
    (tab: ChatTab, query: string = '') => {
      if (!token) return;

      setIsLoading(true);
      dispatch(switchChatTab(tab));

      dispatch(
        retrieveChats({
          token,
          status: tab === ChatTab.UNREAD ? ChatReadStatus.UNREAD : undefined,
          ...(query && { q: query }),
        })
      ).finally(() => setIsLoading(false));
    },
    [token, dispatch]
  );

  /* ------------------ Effects ------------------ */
  // initial fetch
  useEffect(() => {
    if (token && profile?.id) fetchChats(chatTab);
  }, [token, profile?.id, chatTab, fetchChats]);

  // fetch on search input
  useEffect(() => {
    if (debouncedSearchQuery && token && profile?.id) {
      fetchChats(chatTab, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, token, profile?.id, chatTab, fetchChats]);

  // fetch if socket reconnects and no chats loaded
  useEffect(() => {
    if (isConnected && token && profile?.id && chats.length === 0) {
      fetchChats(chatTab);
    }
  }, [isConnected, token, profile?.id, chatTab, chats.length, fetchChats]);

  // socket listeners for chat updates
  useEffect(() => {
    if (!isConnected || !token || !profile?.id) return;

    const userId = profile.id;

    const handleRecentChat = (response: RecentChatRetrievedResponse) => {
      if (response.status === 'success') {
        // console.log(response.data.chat_group);

        dispatch(recentChatRetrieved(response.data));
      }
    };

    const handleChats = (response: any) => {
      if (response.status === 'success') {
        dispatch(chatsRetrieved(response.data.result));
      }
    };

    socketService.on(`recentChatRetrieved:${userId}`, handleRecentChat);
    socketService.on(`chatsRetrieved:${userId}`, handleChats);

    return () => {
      socketService.off(`recentChatRetrieved:${userId}`, handleRecentChat);
      socketService.off(`chatsRetrieved:${userId}`, handleChats);
    };
  }, [isConnected, token, profile?.id, dispatch]);

  return {
    chats,
    chatTab,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchChats,
  };
};
