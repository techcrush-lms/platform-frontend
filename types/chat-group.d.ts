import { Chat as ChatInterface } from './chat';

// Payload when group chat is fetched
export interface FetchChatGroupsResponse {
  status: string; // e.g., "success"
  message: string; // e.g., "Group chats retrieved successfully."
  data: {
    result: ChatGroupData[];
    count: number;
  };
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string | null;
  created_at: string; // ISO string or timestamp
  updated_at: string; // ISO string or timestamp
  creator: User;
  members: User[];
  subscription_plan: SubscriptionPlan | null;
  multimedia: Multimedia | null;
  lastMessage: ChatMessage | null;
  chat: Chat;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  profile: Profile | null;
}

export interface GroupMember {
  id: string;
  member_id: string;
  is_admin: boolean;
  group_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  member: User;
}

export interface Role {
  role_id: string; // e.g., "business-super-administrator" or "user"
  name: string; // e.g., "Business Super Administrator"
}

export interface Profile {
  profile_picture: string | null; // can be empty string too
}

export interface SubscriptionPlan {
  // Add fields if available in your schema
  id?: string;
  name?: string;
  [key: string]: any;
}

export interface Multimedia {
  id: string;
  url: string;
  creator_id: string;
  business_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  provider: string; // e.g., "CLOUDINARY"
  type: string; // e.g., "IMAGE"
}

export interface ChatMessage {
  // Expand when backend sends structure
  id?: string;
  content?: string;
  created_at?: string;
  sender_id?: string;
  [key: string]: any;
}

export interface ChatGroupResponse {
  status: string;
  message: string;
  data: ChatGroup;
}

export interface ChatGroupData {
  id: string;
  name: string;
  description: string;
  multimedia_id: string;
  auto_created: boolean;
  subscription_plan_id: string | null;
  creator_id: string;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  deleted_at: string | null;
  multimedia: Multimedia;
  lastMessage: ChatMessage | null;
  // subscription_plan: string | null;
  subscription_plan: SubscriptionPlan | null;
  creator: User;
  members: User[];
  group_members: GroupMember[];
  chat: ChatInterface;
  chat_members: ChatMessage;
  members_details?: GroupMember[]; // available to updateGroupChat
  chat_messages: ChatMessageBasicDetails[];
}

export interface ChatMessageBasicDetails {
  id: string;
  message: string;
  file: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  chat_id: string;
  initiator_id: string;
  chat_buddy_id: string;
  chat_group_id: string;
}

export interface Multimedia {
  id: string;
  url: string;
  creator_id: string;
  business_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  provider: 'CLOUDINARY';
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | string;
}

export interface Member {
  member_id: string;
}

export interface Chat {
  id: string;
  last_message: string | null;
  last_message_at: string | null;
  is_archived: boolean;
  unread: Unread[];
  is_group: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  initiator_id: string;
  chat_buddy_id: string | null;
  chat_group_id: string | null;
  chat_buddy: ChatBuddy;
}

export interface Unread {
  count: number;
  unread: boolean;
  user_id?: string;
}

export interface ChatBuddy {
  id: string;
  name: string;
  profile: string | null;
}

// Payload when group chat is created
export interface CreatedChatGroupResponse {
  status: string;
  message: string;
  data: ChatGroupData;
}

// Payload when group chat is updated
export interface UpdatedChatGroupResponse {
  status: string;
  message: string;
  data: ChatGroupData;
}

// Payload when group chat is updated
export interface LeftChatGroupResponse {
  status: string;
  message: string;
  data: LeftChatGroup; // Develop this later
}
export interface LeftChatGroup {
  id: string;
  member_id: string;
  group_id: string;
  is_admin: string;
  created_at: string;
  updated_at: string;
  chat_group: ChatGroupData;
}

// Chat response data - when a chat group is created
export interface Chat {
  id: string;
  last_message: string | null;
  last_message_at: string | null;
  is_archived: boolean;
  unread: UnreadEntry[];
  is_group: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  initiator_id: string;
  chat_buddy_id: string | null;
  chat_group_id: string | null;
  chat_group?: ChatGroup | null;
  chat_buddy?: ChatBuddy | null;
}

export interface UnreadEntry {
  count: number;
  unread: boolean;
  user_id?: string;
}
