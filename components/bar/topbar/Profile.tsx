'use client';

import React, { useEffect, useState } from 'react';
import useProfile from '@/hooks/page/useProfile';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Icon from '@/components/ui/Icon';
import Link from 'next/link';
import useOrgs from '@/hooks/page/useOrgs';
import { IoIosAdd } from 'react-icons/io';
import { Settings, LogOut } from 'lucide-react';
import { fetchOrg } from '@/redux/slices/orgSlice';
import { cn, getAvatar, SystemRole } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

const Profile = ({ handleClose }: { handleClose?: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { profile } = useProfile();
  const { orgs } = useOrgs();
  const { org: organization } = useSelector((state: RootState) => state.org);
  const { isConnected } = useSocket();

  const [logoutOpenModal, setLogoutOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);

  const handleLogoutNavigation = () => {
    router.push('/logout');
    if (typeof handleClose === 'function') handleClose();
  };

  const handleSwitchOrg = (id: string) => {
    dispatch(fetchOrg(id));
  };

  useEffect(() => {
    if (allowAction) {
      handleLogoutNavigation();
      setAllowAction(false);
    }
  }, [allowAction]);

  return (
    <div className='relative'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            className='relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:opacity-80 transition-opacity duration-200'
            id='user-menu-button'
            aria-haspopup='true'
          >
            <span className='sr-only'>Open user menu</span>
            <Icon
              className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover'
              url={profile?.profile?.profile_picture || '/icons/icon.png'}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className={cn(
            'z-50 mt-2 w-64 text-base bg-white divide-y divide-gray-100 shadow-xl dark:bg-gray-700 dark:divide-gray-600 rounded-lg border border-gray-200 dark:border-gray-600'
          )}
        >
          <div className='py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-600 dark:to-gray-700'>
            <div className='flex items-center gap-3'>
              <Icon
                className='w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm'
                url={profile?.profile?.profile_picture || '/icons/icon.png'}
              />
              <div className='flex-1 min-w-0'>
                <span className='block text-sm font-semibold text-gray-900 dark:text-white truncate'>
                  {profile?.name}
                </span>
                <span className='block text-xs text-gray-600 dark:text-gray-300 truncate'>
                  {profile?.email}
                </span>
              </div>
            </div>
          </div>

          <ul className='py-2 text-gray-700 dark:text-gray-300'>
            <li>
              <Link
                href='/settings'
                className='flex items-center gap-3 py-2.5 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors'
              >
                <Settings className='w-4 h-4' />
                Settings
              </Link>
            </li>
            <li>
              <button
                onClick={() => setLogoutOpenModal(true)}
                className='flex items-center gap-3 w-full text-left py-2.5 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                <LogOut className='w-4 h-4' />
                Sign out
              </button>
            </li>
          </ul>

          {
            <div>
              <div className='pt-3 px-4'>
                <span className='block text-sm font-semibold text-gray-900 dark:text-white'>
                  {profile?.role?.role_id === SystemRole.USER
                    ? 'Switch Business Directory'
                    : 'Switch Business Account'}
                </span>
              </div>
              <ul className='py-1 text-gray-700 dark:text-gray-300'>
                {orgs.length > 0 &&
                  orgs.map((org) => (
                    <li key={org.id}>
                      <button
                        onClick={handleSwitchOrg.bind(this, org.id)}
                        className='flex items-center gap-2 w-full text-left py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white justify-between'
                      >
                        <p className='flex gap-1'>
                          {/* <img
                            src={org.logo_url}
                            alt={`${org.business_name} logo`}
                            className='w-5 h-5 rounded-full object-contain border dark:border-gray-600 border-graay-400 '
                          /> */}
                          <img
                            src={getAvatar(org.logo_url, org.business_name)}
                            alt={org.business_name}
                            className='w-5 h-5 rounded-full object-cover'
                          />
                          {org.business_name}{' '}
                        </p>
                        {org.id === organization?.id && (
                          <Icon url='/icons/course/selected.png' width={15} />
                        )}
                      </button>
                    </li>
                  ))}

                {[SystemRole.BUSINESS_SUPER_ADMIN].includes(
                  profile?.role?.role_id as SystemRole
                ) && (
                  <li>
                    <Link
                      href='/settings?tab=business-account'
                      className='flex items-center gap-2 py-2 px-4 text-sm font-medium text-primary-main hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-primary-faded dark:hover:text-white'
                    >
                      <IoIosAdd size={20} />
                      Create New Business
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          }
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionConfirmationModal
        openModal={logoutOpenModal}
        setOpenModal={setLogoutOpenModal}
        allowAction={allowAction}
        setAllowAction={setAllowAction}
      />
    </div>
  );
};

export default Profile;
