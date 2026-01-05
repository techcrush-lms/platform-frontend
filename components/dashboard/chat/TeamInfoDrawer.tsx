import Icon from '@/components/ui/Icon';
import { MoreVertical, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import TeamInfoActionsMenu from './TeamInfoActionsMenu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { renderAvatar } from './RenderAvatar';
import { renderName } from './RenderName';
import { pluralizeText, SystemRole } from '@/lib/utils';
import Link from 'next/link';
import { createChat, retrieveChats } from '@/redux/slices/chatSlice';
import { useRouter } from 'next/navigation';
import AddUserToGroupChat from './AddUserToGroupChat';

interface TeamInfoDropdownProps {
  enabledBackButton?: boolean;
}
export default function TeamInfoDropdown({
  enabledBackButton,
}: TeamInfoDropdownProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { chat, chat_extra_details } = useSelector(
    (state: RootState) => state.chat
  );
  const { token, profile } = useSelector((state: RootState) => state.auth);

  const [editCreateTeamModal, setEditCreateTeamModal] = useState(false);

  const openChat = async (group_member_id: string) => {
    try {
      const response = await dispatch(
        createChat({
          initiator: profile?.id!,
          chatBuddy: group_member_id,
        })
      ).unwrap();

      dispatch(
        retrieveChats({
          token: token!,
        })
      );

      const url = `${chatLink}/${response.data.id}/chat/${group_member_id}`;

      return router.push(url);
    } catch (error) {
      console.log(error);
    }
  };

  const chatHeadingElement = (
    <div className='flex gap-2 items-center'>
      <div className='flex items-center'>
        {enabledBackButton && (
          <Link
            href={
              profile?.role.role_id === SystemRole.USER
                ? '/dashboard/messages'
                : '/messages'
            }
            className='flex md:hidden dark:invert dark:brightness-0'
          >
            <Icon url='/icons/clients/angle-left.svg' width={30} />
          </Link>
        )}
      </div>
      <button
        onClick={() => setOpen(true)}
        className='transition flex gap-2 items-center'
      >
        {renderAvatar(chat!)}
        <div className='flex flex-col'>
          <p className='font-semibold text-gray-800 dark:text-white'>
            {renderName(chat!)}
          </p>
        </div>
      </button>
    </div>
  );

  const membersDetails = (
    <>
      {chat?.chat_group?.group_members.length}{' '}
      {pluralizeText('member', chat?.chat_group?.group_members.length!)}
    </>
  );

  const isAdmin = () => {
    const group_member = chat?.chat_group?.group_members.find(
      (member) => member.member.id === profile?.id
    );
    return group_member?.is_admin;
  };

  const chatLink = [
    SystemRole.BUSINESS_SUPER_ADMIN,
    SystemRole.BUSINESS_ADMIN,
  ].includes(profile?.role.role_id as SystemRole)
    ? '/messages'
    : '/dashboard/messages';

  return (
    <div className='relative inline-block'>
      {/* Main Button */}

      {chatHeadingElement}

      {open && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
            onClick={() => {
              setOpen(false);
              setMenuOpen(false);
            }}
          />

          {/* Dropdown Panel */}
          <div
            className='absolute mt-2 w-80 rounded-lg shadow-xl border z-50
                       bg-white text-gray-700 border-gray-200
                       dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
                       animate-fadeIn'
          >
            {/* Header */}
            <div className='border-b border-gray-200 dark:border-gray-700'>
              <div className='px-4 py-3 flex flex-col gap-3'>
                <div className='flex justify-between items-center relative'>
                  <h2 className='text-lg font-semibold'>Group info</h2>
                  <div className='flex gap-2'>
                    {/* Vertical Menu */}
                    <div
                      onClick={() => setMenuOpen(!menuOpen)}
                      className='text-gray-500 dark:text-gray-400 hover:text-gray-600 relative hover:cursor-pointer'
                    >
                      <MoreVertical size={20} />
                      {menuOpen && (
                        <TeamInfoActionsMenu
                          onClose={() => setMenuOpen(false)}
                        />
                      )}
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setOpen(false);
                        setMenuOpen(false);
                      }}
                      className='text-gray-500 dark:text-gray-400 hover:text-gray-600'
                    >
                      <XCircleIcon size={20} />
                    </button>
                  </div>
                </div>

                {/* Team avatar + info */}
                <div className='flex items-center gap-3'>
                  {renderAvatar(chat!)}

                  <div>
                    <p className='font-medium'>{renderName(chat!)}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {membersDetails}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content (files & links) */}
            <div className='border-b border-gray-200 dark:border-gray-700'>
              <div className='p-4 space-y-3 text-gray-600 dark:text-gray-300'>
                <button className='flex gap-2'>
                  <Icon
                    url='/icons/chat/img/file.png'
                    width={15}
                    height={10}
                    className='object-contain'
                  />
                  <p>
                    {chat_extra_details?.totalFilesWithFormats}{' '}
                    {pluralizeText(
                      'file',
                      chat_extra_details?.totalFilesWithFormats!
                    )}{' '}
                  </p>
                </button>
                <button className='flex gap-2'>
                  <Icon
                    url='/icons/chat/img/link.png'
                    width={20}
                    height={10}
                    className='object-contain'
                  />
                  <p>
                    {chat_extra_details?.totalMessagesWithLinks}{' '}
                    {pluralizeText(
                      'shared link',
                      chat_extra_details?.totalMessagesWithLinks!
                    )}
                  </p>
                </button>
              </div>
            </div>

            {/* Members header */}
            <div className='border-b p-4 border-gray-200 dark:border-gray-700 flex justify-between'>
              <button className='flex gap-2 text-gray-600 dark:text-gray-300'>
                <Icon
                  url='/icons/chat/img/group.png'
                  width={20}
                  height={10}
                  className='object-contain'
                />
                <p>{membersDetails}</p>
              </button>
              <div className='flex gap-3'>
                {/* <button>
                  <Icon
                    url='/icons/chat/img/search.png'
                    width={20}
                    height={10}
                    className='object-contain'
                  />
                </button> */}
                {isAdmin() && (
                  // To add a user to the group
                  <AddUserToGroupChat
                    editCreateTeamModal={editCreateTeamModal}
                    setEditCreateTeamModal={setEditCreateTeamModal}
                  />
                )}
              </div>
            </div>

            {/* Members List */}
            <div className='space-y-2 p-4 mb-3 max-h-60 overflow-y-auto'>
              {chat?.chat_group?.group_members
                ?.slice() // clone array
                .sort((a, b) => {
                  // "You" comes first
                  if (a.member?.id === profile?.id) return -1;
                  if (b.member?.id === profile?.id) return 1;

                  // Admins come next
                  if (a.is_admin && !b.is_admin) return -1;
                  if (!a.is_admin && b.is_admin) return 1;

                  return 0; // keep the rest as they are
                })
                .map((group_member, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center p-1 hover:cursor-pointer'
                  >
                    <span>
                      {group_member?.member?.id === profile?.id ? (
                        'You'
                      ) : (
                        <button
                          onClick={() => openChat(group_member.member_id)}
                        >
                          {group_member?.member?.name}
                        </button>
                      )}
                    </span>

                    {group_member.is_admin && (
                      <span className='text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full'>
                        Admin
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
