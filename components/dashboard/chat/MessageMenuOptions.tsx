import Icon from '@/components/ui/Icon';
import React from 'react';
import { MessageMenu } from './MessageMenu';

const MessageMenuOptions = () => {
  return (
    <>
      <div className='ml-auto flex items-center gap-5'>
        <button>
          <Icon
            url='/icons/chat/search.svg'
            className='dark:invert dark:brightness-0'
          />
        </button>

        <MessageMenu
          trigger={
            <button>
              <Icon
                url='/icons/chat/menu.svg'
                className='dark:invert dark:brightness-0 w-1 object-contain'
              />
            </button>
          }
          list={[{ title: 'View Profile', link: '/profile' }]}
        />
      </div>
    </>
  );
};

export default MessageMenuOptions;
