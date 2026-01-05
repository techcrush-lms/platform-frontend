import { Chat } from '@/types/chat';

export const renderName = (chat: Chat) => {
  if (chat?.is_group && chat?.chat_group) {
    return chat.chat_group.name;
  } else if (chat?.chat_buddy) {
    return chat.chat_buddy.name;
  }
  return 'Unknown Chat';
};
