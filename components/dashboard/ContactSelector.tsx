import { useEffect, useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { BusinessProps } from '@/types/org';
import { getAvatar } from '@/lib/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import useContacts from '@/hooks/page/useContacts';
import { fetchContacts } from '@/redux/slices/chatSlice';
import { PaginationProps } from '@/types';
import LoadingIcon from '../ui/icons/LoadingIcon';
import { GroupMember } from '@/types/chat-group';

interface ContactSelectorProps {
  selectedMembers: { member_id: string }[];
  setSelectedMembers: React.Dispatch<
    React.SetStateAction<{ member_id: string }[]>
  >;
  addedMembers?: GroupMember[];
  isEditGroup?: boolean;
}

export default function ContactSelector({
  selectedMembers,
  setSelectedMembers,
  addedMembers = [],
  isEditGroup = false,
}: ContactSelectorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { contacts, contactsCount, contactsCurrentPage, limit } = useContacts();

  const [isLoadingOtherContacts, setIsloadingOtherContacts] = useState(false);

  // Collect ids of already-added members
  const addedMemberIds = addedMembers.map((m) => m.member.id);

  const toggleSelection = (id: string) => {
    // prevent toggling if already in group
    if (addedMemberIds.includes(id)) return;

    setSelectedMembers((prev) =>
      prev.some((member) => member.member_id === id)
        ? prev.filter((member) => member.member_id !== id)
        : [...prev, { member_id: id }]
    );
  };

  const loadMore = async () => {
    try {
      setIsloadingOtherContacts(true);
      await dispatch(
        fetchContacts({
          ...(limit && { limit }),
          ...(org?.id && { business_id: org.id as string }),
          ...(contactsCurrentPage && { page: contactsCurrentPage + 1 }),
        } as PaginationProps & BusinessProps)
      );
    } finally {
      setIsloadingOtherContacts(false);
    }
  };

  useEffect(() => {
    if (isEditGroup && addedMembers.length) {
      const preSelected = addedMembers.map((m) => ({
        member_id: m.member.id,
      }));

      setSelectedMembers((prev) => {
        const existingIds = new Set(prev.map((m) => m.member_id));
        return [
          ...prev,
          ...preSelected.filter((m) => !existingIds.has(m.member_id)),
        ];
      });
    }
  }, [isEditGroup, addedMembers, setSelectedMembers]);

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-semibold mb-4'>
        {/* Take out yourself from the count */}
        Select Contacts (
        {isEditGroup ? selectedMembers.length - 1 : selectedMembers.length})
      </h3>

      {/* Contacts List */}
      <div
        className='space-y-2 max-h-64 overflow-y-auto'
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          if (
            scrollTop + clientHeight >= scrollHeight - 20 &&
            contacts.length < contactsCount
          ) {
            loadMore();
          }
        }}
      >
        {contacts.map((contact) => {
          const isAlreadyAdded = addedMemberIds.includes(contact.id);
          const isSelected =
            isAlreadyAdded ||
            selectedMembers.some((m) => m.member_id === contact.id);

          return (
            <div
              key={contact.id}
              onClick={() => toggleSelection(contact.id)}
              className={`flex items-center gap-3 rounded-lg p-3 
                ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-900/30'
                    : 'bg-gray-50 dark:bg-gray-800'
                }
                ${
                  isAlreadyAdded
                    ? 'cursor-not-allowed opacity-90'
                    : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {isSelected ? (
                <CheckSquare
                  className={`w-5 h-5 ${
                    isAlreadyAdded ? 'text-green-600' : 'text-primary-main'
                  }`}
                />
              ) : (
                <Square className='w-5 h-5 text-gray-400' />
              )}

              {(contact?.profile?.profile_picture || contact?.name) && (
                <img
                  src={getAvatar(
                    contact.profile?.profile_picture,
                    contact.name
                  )}
                  alt={contact.name}
                  className='w-10 h-10 rounded-full object-cover'
                />
              )}

              <div className='flex flex-col flex-1'>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {contact.name}
                </span>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {contact.email}
                </span>
              </div>

              {/* Badge for already added members */}
              {isAlreadyAdded && (
                <span className='ml-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full'>
                  Already in group
                </span>
              )}
            </div>
          );
        })}

        {isLoadingOtherContacts && (
          <span className='mt-4 flex items-center justify-center'>
            <LoadingIcon />
            Processing...
          </span>
        )}
      </div>
    </div>
  );
}
