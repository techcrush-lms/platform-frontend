import { io, Socket } from 'socket.io-client';
import { store } from '@/redux/store';
import {
  chatsRetrieved,
  messagesRetrieved,
  updateMessageStatus,
  userOnline,
  userOffline,
  recentChatRetrieved,
} from '@/redux/slices/chatSlice';
import {
  RetrieveChatsProps,
  RetrieveGroupChatsProps,
  RetrieveMessagesProps,
  SendMessageProps,
  createGroupChatSchema,
  leaveGroupChatSchema,
  retrieveChatGroupsSchema,
  retrieveChatsSchema,
  retrieveMessagesSchema,
  sendMessageSchema,
  updateGroupChatSchema,
} from '@/lib/schema/chat.schema';
import {
  Chat,
  ChatResponse,
  Message,
  MessagesResponse,
  SentMessageResponse,
} from '@/types/chat';

interface SocketAuth {
  token: string;
  userId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private listenerCallbacks: {
    [event: string]: ((...args: any[]) => void)[];
  } = {};

  private onlineUsers = new Set<string>();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public connect(token: string) {
    if (this.socket) return;

    // Extract user ID from token (assuming it's a JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { token, userId } as SocketAuth,
      transports: ['websocket'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      forceNew: true,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    // this.setupListeners();

    // Emit user online status when connecting
    this.socket.on('connect', () => {
      this.socket?.emit('userOnline', { userId });
    });

    // Emit user offline status when disconnecting
    this.socket.on('disconnect', () => {
      this.socket?.emit('userOffline', { userId });
    });

    // this.setupPresenceListeners();
  }

  // Call this after connection
  private setupPresenceListeners() {
    this.socket?.on(
      'presenceUpdate',
      ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        if (isOnline) {
          this.onlineUsers.add(userId);
        } else {
          this.onlineUsers.delete(userId);
        }
      }
    );
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  public on(event: string, callback: (...args: any[]) => void) {
    if (!this.listenerCallbacks[event]) {
      this.listenerCallbacks[event] = [];
    }
    this.listenerCallbacks[event].push(callback);

    // If socket is already connected, register immediately
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      this.listenerCallbacks[event] = this.listenerCallbacks[event]?.filter(
        (cb) => cb !== callback
      );
    } else {
      this.socket.off(event);
      delete this.listenerCallbacks[event];
    }
  }

  public async retrieveChats(payload: RetrieveChatsProps) {
    const { error } = retrieveChatsSchema.validate(payload);
    if (error) throw new Error(error.message);

    this.socket?.emit('retrieveChats', payload);
  }

  public async retrieveMessages(
    payload: RetrieveMessagesProps
  ): Promise<MessagesResponse> {
    const { error } = retrieveMessagesSchema.validate(payload);
    if (error) throw new Error(error.message);

    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'retrieveMessages',
        payload,
        (response: MessagesResponse) => {
          response.status === 'success'
            ? resolve(response)
            : reject(response.message);
        }
      );
    });
  }

  public async sendMessage(
    payload: SendMessageProps
  ): Promise<SentMessageResponse> {
    const { error } = sendMessageSchema.validate(payload);
    if (error) throw new Error(error.message);

    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'sendMessage',
        payload,
        (response: SentMessageResponse) => {
          response.status === 'success'
            ? resolve(response)
            : reject(response.message);
        }
      );
    });
  }

  public async createGroupChat(payload: {
    token: string;
    name: string;
    description?: string;
    multimedia_id: string;
    members: { member_id: string }[];
  }): Promise<any> {
    const { error } = createGroupChatSchema.validate(payload);
    if (error) throw new Error(error.message);

    return new Promise((resolve, reject) => {
      this.socket?.emit('createGroupChat', payload, (response: any) => {
        response.status === 'success'
          ? resolve(response)
          : reject(response.message);
      });
    });
  }

  public async leaveGroupChat(payload: { token: string }): Promise<any> {
    const { error } = leaveGroupChatSchema.validate(payload);
    if (error) throw new Error(error.message);

    return new Promise((resolve, reject) => {
      this.socket?.emit('leaveGroupChat', payload, (response: any) => {
        response.status === 'success'
          ? resolve(response)
          : reject(response.message);
      });
    });
  }

  public async retrieveGroupChats(
    payload: RetrieveGroupChatsProps
  ): Promise<MessagesResponse> {
    const { error } = retrieveChatGroupsSchema.validate(payload);
    if (error) throw new Error(error.message);

    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'retrieveGroupChats',
        payload,
        (response: MessagesResponse) => {
          response.status === 'success'
            ? resolve(response)
            : reject(response.message);
        }
      );
    });
  }

  public async updateGroupChat(payload: {
    group_id: string;
    token: string;
    name?: string;
    description?: string;
    multimedia_id?: string;
    members?: { member_id: string }[];
  }): Promise<any> {
    const { error } = updateGroupChatSchema.validate(payload);
    if (error) throw new Error(error.message);

    return new Promise((resolve, reject) => {
      this.socket?.emit('updateGroupChat', payload, (response: any) => {
        response.status === 'success'
          ? resolve(response)
          : reject(response.message);
      });
    });
  }

  public listenGroupChatCreated(userId: string) {
    this.socket?.on(`groupChatCreated:${userId}`, (chat: Chat) => {
      store.dispatch(recentChatRetrieved(chat));
    });
  }

  public emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  public setUserOnline(userId: string) {
    this.socket?.emit('userOnline', { userId });
  }

  public setUserOffline(userId: string) {
    this.socket?.emit('userOffline', { userId });
  }
}

export const socketService = SocketService.getInstance();
