'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiLogout } from 'react-icons/hi';
import { Store } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { baseUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

const BottomMenu = ({ handleClose }: { handleClose?: () => void }) => {
  const router = useRouter();
  const { org } = useSelector((state: RootState) => state.org);
  const [logoutOpenModal, setLogoutOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allowAction, setAllowAction] = useState(false);

  const handleLogoutNavigation = () => {
    router.push('/logout');
    if (typeof handleClose === 'function') handleClose();
  };

  const handleVisitStore = () => {
    if (org?.business_slug) {
      window.open(
        `${baseUrl}/b/${org.business_slug}`,
        '_blank',
        'noopener,noreferrer'
      );
      toast.success('Opened in new tab!');
      if (typeof handleClose === 'function') handleClose();
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleLogoutNavigation();
      setAllowAction(false);
    }
  }, [allowAction]);

  return (
    <div className='w-full mt-auto px-4 py-4'>
      {/* Preferences Section */}
      <div>
        <p className='text-xs uppercase'>Preferences</p>
        <div className='flex flex-col gap-3 mt-2'>
          <ThemeToggle />
          <button
            onClick={() => setLogoutOpenModal(true)}
            className='w-full flex items-center gap-3 text-sm text-red-600 dark:text-red-200 hover:bg-red-50 hover:dark:bg-gray-700 rounded-lg px-3 py-2 transition'
            disabled={isLoading}
          >
            <HiLogout className='text-lg' />
            <span>Log out</span>
          </button>
          <ActionConfirmationModal
            openModal={logoutOpenModal}
            setOpenModal={setLogoutOpenModal}
            allowAction={allowAction}
            setAllowAction={setAllowAction}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomMenu;
