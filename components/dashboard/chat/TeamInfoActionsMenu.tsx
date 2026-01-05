import { leaveGroupChat } from '@/redux/slices/chatSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  onClose: () => void;
}

export default function TeamInfoActionsMenu({ onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { chat } = useSelector((state: RootState) => state.chat);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleLeaveGroup = async () => {
    dispatch(
      leaveGroupChat({ token: token!, group_id: chat?.chat_group?.id! })
    );
  };

  // close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className='absolute right-0 mt-2 w-56 rounded-xl shadow-lg border 
                 bg-white border-gray-200 
                 dark:bg-gray-800 dark:border-gray-700
                 z-50'
    >
      <ul className='py-2 text-sm text-gray-700 dark:text-gray-200'>
        {/* <li>
          <button className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
            Edit team details
          </button>
        </li>
        <li>
          <button className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
            Invite members
          </button>
        </li>
        <li>
          <button className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
            Export chat history
          </button>
        </li> */}
        <li>
          <button
            type='button'
            className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            onClick={handleLeaveGroup}
          >
            Leave group
          </button>
        </li>
      </ul>
    </div>
  );
}
