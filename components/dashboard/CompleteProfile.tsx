import React from 'react';
import { Button } from '@/components/ui/Button';
import { SystemRole } from '@/lib/utils';
import { Profile } from '@/types/account';
import { BusinessProfile } from '@/types/org';

interface CompleteProfileProps {
  profile: Profile;
  orgs: BusinessProfile[];
  setShowProfileModal: (show: boolean) => void;
}

const CompleteProfile = ({
  profile,
  orgs,
  setShowProfileModal,
}: CompleteProfileProps) => {
  return (
    <>
      {profile?.role.role_id === SystemRole.BUSINESS_SUPER_ADMIN &&
        !orgs.length && (
          <>
            <div className='mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
              <div className='flex flex-col md:flex-row gap-2 items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
                      Complete Your Profile
                    </h3>
                    <p className='mt-1 text-sm text-red-700 dark:text-red-300'>
                      Please complete your business profile to access all
                      features.
                    </p>
                  </div>
                </div>
                <Button
                  variant='primary'
                  onClick={() => setShowProfileModal(true)}
                  className='bg-red-600 hover:bg-red-700 text-white ml-auto'
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </>
        )}
    </>
  );
};

export default CompleteProfile;
