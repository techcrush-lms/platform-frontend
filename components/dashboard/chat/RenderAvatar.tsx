import { getAvatar } from '@/lib/utils';
import { Chat } from '@/types/chat';

export const renderAvatar = (chat: Chat) => {
  if (chat?.is_group && chat.chat_group) {
    return (
      <img
        src={getAvatar(chat.chat_group.multimedia.url, chat.chat_group.name)}
        alt={chat.chat_group.name}
        className='w-10 h-10 rounded-full object-cover'
      />
    );
  } else if (chat?.chat_buddy) {
    return (
      <img
        src={getAvatar(
          chat.chat_buddy.profile?.profile_picture!,
          chat.chat_buddy.name
        )}
        alt={chat.chat_buddy.name}
        className='w-10 h-10 rounded-full object-cover'
      />
    );
  }
  return null;
};
