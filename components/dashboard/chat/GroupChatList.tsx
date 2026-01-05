'use client';

import { Chat } from '@/types/chat';
import MessageListContent from './MessageListContent';
import { PlusCircle } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { ChatGroup, ChatGroupData } from '@/types/chat-group';
import GroupListContent from './GroupListContent';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SystemRole } from '@/lib/utils';

export interface GroupChatListProps {
  groups: ChatGroupData[];
  openCreateTeamModal: boolean;
  setOpenCreateTeamModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GroupChatList({
  groups,
  openCreateTeamModal,
  setOpenCreateTeamModal,
}: GroupChatListProps) {
  const { profile } = useSelector((state: RootState) => state.auth);
  return (
    <>
      {groups.length > 0 ? (
        <div className='relative w-full mx-auto bg-white dark:bg-gray-800 rounded-md flex flex-col max-h-[70vh] md:max-h-[60vh] lg:max-h-[66vh] h-[70vh] md:h-[60vh] lg:h-[82vh]'>
          {/* Scrollable list of group chats */}
          <div className='flex-1 overflow-y-auto pr-1'>
            {groups.map((group, index) => (
              <GroupListContent index={index} group={group} groups={groups} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title='No groups yet'
          text={
            [
              SystemRole.BUSINESS_SUPER_ADMIN,
              SystemRole.BUSINESS_ADMIN,
            ].includes(profile?.role.role_id as SystemRole) ? (
              <span
                className='flex items-center gap-1 hover:cursor-pointer'
                onClick={() => setOpenCreateTeamModal(true)}
              >
                <PlusCircle size='15' /> Create your first group chat.
              </span>
            ) : (
              'You’re not part of any groups yet.'
            )
          }
        />
      )}
      {/* </div>
      </div> */}
    </>
  );
}
