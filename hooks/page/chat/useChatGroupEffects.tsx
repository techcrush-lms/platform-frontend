import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useSocket } from '@/context/SocketProvider';
import { useDebounce } from '@/hooks/use-debounce';
import { socketService } from '@/lib/services/socketService';
import {
  chatsRetrieved,
  groupChatCreated,
  groupChatsRetrieved,
  groupChatUpdated,
  recentChatRetrieved,
  retrieveChats,
  retrieveGroupChats,
  switchChatTab,
} from '@/redux/slices/chatSlice';
import { ChatReadStatus, ChatTab, SystemRole } from '@/lib/utils';
import { RecentChatRetrievedResponse } from '@/types/chat';
import {
  CreatedChatGroupResponse,
  FetchChatGroupsResponse,
  LeftChatGroupResponse,
  UpdatedChatGroupResponse,
} from '@/types/chat-group';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useChatGroupEffects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // redux state
  const { chat, chat_groups, chatTab } = useSelector(
    (state: RootState) => state.chat
  );
  const { token, profile } = useSelector((state: RootState) => state.auth);

  // ui state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // debounce search input
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // socket
  const { isConnected } = useSocket();

  /* ------------------ Fetch Chat groups ------------------ */
  const fetchChatGroups = useCallback(
    (tab?: ChatTab, query: string = '') => {
      if (!token) return;

      setIsLoading(true);
      if (tab) {
        dispatch(switchChatTab(tab));
      }

      dispatch(
        retrieveGroupChats({
          token,
          ...(query && { q: query }),
        })
      ).finally(() => setIsLoading(false));
    },
    [token, dispatch]
  );

  /* ------------------ Effects ------------------ */
  // initial fetch
  useEffect(() => {
    if (token && profile?.id) fetchChatGroups(chatTab, searchQuery);
  }, [token, profile?.id, chatTab, fetchChatGroups, searchQuery]);

  // fetch on search input
  useEffect(() => {
    if (debouncedSearchQuery && token && profile?.id) {
      fetchChatGroups(chatTab, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, token, profile?.id, chatTab, fetchChatGroups]);

  // fetch if socket reconnects and no chat groups are loaded
  useEffect(() => {
    if (isConnected && token && profile?.id && chat_groups.length === 0) {
      fetchChatGroups(chatTab);
    }
  }, [
    isConnected,
    token,
    profile?.id,
    chatTab,
    chat_groups.length,
    fetchChatGroups,
  ]);

  // socket listeners for chat updates
  useEffect(() => {
    if (!isConnected || !token || !profile?.id) return;

    const userId = profile.id;

    const handleCreatedGroupChat = (response: CreatedChatGroupResponse) => {
      if (response.status === 'success') {
        dispatch(groupChatCreated(response.data));

        const chat_details = response.data.chat;
        if (chat_details?.initiator_id === profile.id) {
          if (
            [
              SystemRole.BUSINESS_ADMIN,
              SystemRole.BUSINESS_SUPER_ADMIN,
            ].includes(profile.role.role_id as SystemRole)
          ) {
            router.push(
              `/messages/${chat_details.id}/chat-group/${chat_details.chat_group_id}`
            );
          }
        }
      }
    };

    const handleGroupChats = (response: FetchChatGroupsResponse) => {
      if (response.status === 'success') {
        dispatch(groupChatsRetrieved(response.data.result));
      }
    };

    const handleUpdatedGroupChat = (response: UpdatedChatGroupResponse) => {
      if (response.status === 'success') {
        const chat_details = response.data.chat;

        // dispatch(retrieveChats({ token }));
        // dispatch(retrieveGroupChats({ token }));

        dispatch(groupChatUpdated(response.data));

        if (chat_details?.initiator_id === profile.id) {
          if (
            [
              SystemRole.BUSINESS_ADMIN,
              SystemRole.BUSINESS_SUPER_ADMIN,
            ].includes(profile.role.role_id as SystemRole)
          ) {
            router.push(
              `/messages/${chat_details.id}/chat-group/${chat_details.chat_group_id}`
            );
          }
        }
      }
    };

    const handleLeftGroupChat = (response: LeftChatGroupResponse) => {
      if (response.status === 'success') {
        console.log(response.data);

        const chat_group_details = response.data;

        dispatch(
          retrieveChats({
            token,
          })
        );

        if (chat_group_details.member_id === profile.id) {
          if (
            [
              SystemRole.BUSINESS_ADMIN,
              SystemRole.BUSINESS_SUPER_ADMIN,
            ].includes(profile.role.role_id as SystemRole)
          ) {
            router.push(`/messages`);
          } else {
            router.push(`/dashboard/messages`);
          }
        }
      }
    };

    socketService.on(`groupChatCreated:${userId}`, handleCreatedGroupChat);
    socketService.on(`groupChatsRetrieved:${userId}`, handleGroupChats);
    socketService.on(`groupChatUpdated:${userId}`, handleUpdatedGroupChat);
    socketService.on(`groupChatLeft:${userId}`, handleLeftGroupChat);

    return () => {
      socketService.off(`groupChatCreated:${userId}`, handleCreatedGroupChat);
      socketService.off(`groupChatsRetrieved:${userId}`, handleGroupChats);
      socketService.off(`groupChatUpdated:${userId}`, handleUpdatedGroupChat);
      socketService.off(`groupChatLeft:${userId}`, handleLeftGroupChat);
    };
  }, [isConnected, token, profile?.id, dispatch]);

  return {
    chat_groups,
    chatTab,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchChatGroups,
  };
};
