import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { socketService } from '@/lib/services/socketService';
import {
  CreateChatProps,
  CreateGroupChatProps,
  LeaveGroupChatProps,
  RetrieveChatsProps,
  RetrieveGroupChatsProps,
  RetrieveMessagesProps,
  SendMessageProps,
  UpdateGroupChatProps,
} from '@/lib/schema/chat.schema';
import {
  Chat,
  ChatMessagesStat,
  CreatedChatResponse,
  Message,
} from '@/types/chat';
import api from '@/lib/api';
import { BusinessProps, ContactInfo, ContactInfoResponse } from '@/types/org';
import { PaginationProps } from '@/types';
import { ChatTab } from '@/lib/utils';
import { ChatGroup, ChatGroupData, GroupMember } from '@/types/chat-group';

interface ChatState {
  chats: Chat[];
  chat_groups: ChatGroupData[];
  chat: Chat | null;
  chat_extra_details: ChatMessagesStat | null;
  chat_group: ChatGroupData | null;
  messages: Message[];
  latestMessage: Message | null;
  currentChat: string | null;
  loading: boolean;
  error: string | null;
  onlineUsers: Set<string>;

  contactsLoading: boolean;
  contacts: ContactInfo[];
  contactsCount: number;
  contactsCurrentPage: number;

  chatTab: ChatTab;
}

const initialState: ChatState = {
  chats: [],
  chat: null,
  chat_extra_details: null,
  chat_groups: [],
  chat_group: null,
  messages: [],
  latestMessage: null,
  currentChat: null,
  loading: false,
  contactsLoading: false,
  error: null,
  onlineUsers: new Set(),
  contacts: [],
  contactsCount: 0,
  contactsCurrentPage: 1,
  chatTab: ChatTab.ALL,
};

// 🔹 Utility to sort chats by latest message
// const sortChatsByLastMessage = (chats: Chat[]): Chat[] =>
//   [...chats].sort((a, b) => {
//     const aDate = new Date(a?.last_message_at || a.messages[0]?.updated_at);
//     const bDate = new Date(b?.last_message_at || b.messages[0]?.updated_at);
//     return bDate.getTime() - aDate.getTime();
//   });

const sortChatsByLastMessage = (chats: Chat[]): Chat[] => {
  const uniqueChatsMap = new Map<string, Chat>();

  // Deduplicate by chat.id (keeps the latest one encountered)
  for (const chat of chats) {
    if (!uniqueChatsMap.has(chat.id)) {
      uniqueChatsMap.set(chat.id, chat);
    }
  }

  const uniqueChats = Array.from(uniqueChatsMap.values());

  return uniqueChats.sort((a, b) => {
    const aDate = new Date(a?.last_message_at || a.messages[0]?.updated_at);
    const bDate = new Date(b?.last_message_at || b.messages[0]?.updated_at);
    return bDate.getTime() - aDate.getTime();
  });
};

// 🔹 Utility to sort group chats
const sortGroupChatsByLastMessage = (
  group_chats: ChatGroupData[]
): ChatGroupData[] =>
  [...group_chats].sort((a, b) => {
    const aDate = new Date(a?.lastMessage?.updated_at || a.created_at);
    const bDate = new Date(b?.lastMessage?.updated_at || b.created_at);
    return bDate.getTime() - aDate.getTime();
  });

// --------------------
// 🔹 Async Thunks
// --------------------
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (
    {
      page,
      limit,
      q,
      startDate,
      endDate,
      business_id,
    }: PaginationProps & BusinessProps,
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;
    if (business_id !== undefined) params.business_id = business_id;

    try {
      const response = await api.get<ContactInfoResponse>(
        `/contact/fetch-contacts`,
        {
          params,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch contacts'
      );
    }
  }
);

export const fetchOrgContacts = createAsyncThunk(
  'contacts/fetchOrgContacts',
  async (
    {
      page,
      limit,
      q,
      startDate,
      endDate,
      business_id,
    }: PaginationProps & BusinessProps,
    { rejectWithValue }
  ) => {
    const params: Record<string, any> = {};

    if (page !== undefined) params['pagination[page]'] = page;
    if (limit !== undefined) params['pagination[limit]'] = limit;
    if (q !== undefined) params.q = q;
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;
    if (business_id !== undefined) params.business_id = business_id;

    try {
      const response = await api.get<ContactInfoResponse>(
        `/contact/fetch-org-contacts`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch org contacts'
      );
    }
  }
);

export const retrieveChats = createAsyncThunk(
  'chat/retrieveChats',
  async (payload: RetrieveChatsProps, { rejectWithValue }) => {
    try {
      return await socketService.retrieveChats(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const retrieveMessages = createAsyncThunk(
  'chat/retrieveMessages',
  async (payload: RetrieveMessagesProps, { rejectWithValue }) => {
    try {
      return await socketService.retrieveMessages(payload);
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessageProps) => {
    return await socketService.sendMessage(payload);
  }
);

export const createGroupChat = createAsyncThunk<Chat, CreateGroupChatProps>(
  'chat/createGroupChat',
  async (payload) => await socketService.createGroupChat(payload)
);

export const leaveGroupChat = createAsyncThunk<Chat, LeaveGroupChatProps>(
  'chat/leaveGroupChat',
  async (payload) => await socketService.leaveGroupChat(payload)
);

export const retrieveGroupChats = createAsyncThunk(
  'chat/retrieveGroupChats',
  async (payload: RetrieveGroupChatsProps, { rejectWithValue }) => {
    try {
      return await socketService.retrieveGroupChats(payload);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGroupChat = createAsyncThunk<Chat, UpdateGroupChatProps>(
  'chat/updateGroupChat',
  async (payload) => await socketService.updateGroupChat(payload)
);

export const createChat = createAsyncThunk(
  'chat/create',
  async ({ initiator, chatBuddy }: CreateChatProps, { rejectWithValue }) => {
    try {
      const { data } = await api.post<CreatedChatResponse>('/chat/create', {
        initiator,
        chatBuddy,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create chat');
    }
  }
);

// --------------------
// 🔹 Slice
// --------------------
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    chatsRetrieved: (state, action: PayloadAction<Chat[]>) => {
      state.chats = sortChatsByLastMessage(action.payload);
    },
    groupChatsRetrieved: (state, action: PayloadAction<ChatGroupData[]>) => {
      state.chat_groups = sortGroupChatsByLastMessage(action.payload);
    },
    groupChatCreated: (state, action: PayloadAction<ChatGroupData>) => {
      state.chat_groups = [action.payload, ...state.chat_groups];
      state.chat_group = action.payload;

      const chat = action.payload.chat;
      state.chats = [chat, ...state.chats];
    },
    groupChatUpdated: (state, action: PayloadAction<ChatGroupData>) => {
      const group_index = state.chat_groups.findIndex(
        (chat_group) => chat_group.id === action.payload.id
      );
      if (group_index === -1) {
        state.chat_groups = [action.payload, ...state.chat_groups];
      }

      if (state.chat?.chat_group?.id === action.payload.id) {
        state.chat_group = action.payload;
        // @ts-ignore
        state.chat?.chat_group?.group_members?.push(
          ...action.payload?.members_details!
        );
      }

      const chat_details = action.payload;
      const chat_index = state.chats.findIndex(
        (chat) => chat.id === chat_details.id
      );
      if (chat_index === -1) {
        state.chats = sortChatsByLastMessage([
          chat_details.chat,
          ...state.chats,
        ]);
      }
    },
    messagesRetrieved: (
      state,
      action: PayloadAction<{
        messages: Message[];
        chatId?: string;
        chat: Chat;
        isInitialLoad?: boolean;
        stats: ChatMessagesStat;
      }>
    ) => {
      const { messages, chatId, chat, isInitialLoad } = action.payload;

      state.messages = isInitialLoad
        ? messages
        : [
            ...messages.filter(
              (msg) => !state.messages.some((m) => m.id === msg.id)
            ),
            ...state.messages,
          ];

      state.chat = chat;
      state.chat_extra_details = action.payload.stats;
      state.currentChat = chatId || null;
    },
    userOnline: (state, action: PayloadAction<string>) => {
      state.onlineUsers.add(action.payload);
    },
    userOffline: (state, action: PayloadAction<string>) => {
      state.onlineUsers.delete(action.payload);
    },
    messagesSent: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      state.messages.push(message);
      state.latestMessage = message;

      state.chats = sortChatsByLastMessage(
        state.chats.map((chat) =>
          chat.id === message.chat_id
            ? {
                ...chat,
                last_message: message.message,
                last_message_at: message.chat?.last_message_at!,
                created_at: message.updated_at,
                updated_at: message.chat?.last_message_at!,
              }
            : chat
        )
      );
    },
    recentChatRetrieved: (state, action: PayloadAction<Chat>) => {
      // const chat = action.payload;
      state.chats = sortChatsByLastMessage(
        state.chats.map((chat) =>
          chat.id === action.payload.id
            ? {
                ...chat,
                last_message: action.payload.last_message,
                last_message_at: action.payload.last_message_at,
                created_at: action.payload.updated_at,
                updated_at: action.payload.updated_at,
              }
            : chat
        )
      );

      state.chat_groups = sortGroupChatsByLastMessage(
        state.chat_groups.map((chat_group) =>
          chat_group.id === action.payload.chat_group?.id
            ? { ...chat_group, ...action.payload.chat_group }
            : chat_group
        )
      );
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ messageId: string; read: boolean }>
    ) => {
      state.messages = state.messages.map((msg) =>
        msg.id === action.payload.messageId
          ? { ...msg, read: action.payload.read }
          : msg
      );
    },
    updateMessagesReadStatus: (
      state,
      action: PayloadAction<{ chatId: string; readBy: string }>
    ) => {
      const { chatId, readBy } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);

      if (chat) {
        chat.messages.forEach((msg) => {
          if (msg.initiator_id !== readBy) msg.read = true;
        });
        chat.unread = 0;
      }
    },
    clearChatState: () => initialState,
    switchChatTab: (state, action: PayloadAction<ChatTab>) => {
      state.chatTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    const mergeUniqueById = <T extends { id: string }>(
      prev: T[],
      next: T[]
    ) => {
      const map = new Map(prev.map((i) => [i.id, i]));
      for (const item of next) map.set(item.id, item);
      return Array.from(map.values());
    };

    builder
      // 🔹 Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.contactsLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contactsLoading = false;
        state.contacts = mergeUniqueById(state.contacts, action.payload.data);
        state.contactsCount = action.payload.count;
        state.contactsCurrentPage =
          action.meta.arg.page ?? state.contactsCurrentPage;
      })
      .addCase(fetchContacts.rejected, (state, action: any) => {
        state.contactsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrgContacts.pending, (state) => {
        state.contactsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrgContacts.fulfilled,
        (state, action: PayloadAction<ContactInfoResponse>) => {
          state.contactsLoading = false;
          state.contacts = action.payload.data;
          state.contactsCount = action.payload.count;
        }
      )
      .addCase(fetchOrgContacts.rejected, (state, action: any) => {
        state.contactsLoading = false;
        state.error = action.payload;
      })
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createChat.fulfilled,
        (state, action: PayloadAction<CreatedChatResponse>) => {
          state.loading = false;
        }
      )
      .addCase(createChat.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create chat';
      })
      // 🔹 Generic async matcher
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const {
  chatsRetrieved,
  groupChatsRetrieved,
  groupChatCreated,
  groupChatUpdated,
  messagesRetrieved,
  messagesSent,
  recentChatRetrieved,
  userOnline,
  userOffline,
  updateMessageStatus,
  clearChatState,
  updateMessagesReadStatus,
  switchChatTab,
} = chatSlice.actions;

export default chatSlice.reducer;
