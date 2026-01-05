import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BusinessProfile } from '@/types/org';
import { useDispatch } from 'react-redux';
import { switchToOrg } from '@/redux/slices/orgSlice';
import { useRouter } from 'next/navigation';

interface SelectOrgModalProps {
  isOpen: boolean;
  organizations: BusinessProfile[];
}

const SelectOrgModal = ({ isOpen, organizations }: SelectOrgModalProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelectOrg = (orgId: string) => {
    dispatch(switchToOrg({ business_id: orgId }));
  };

  const navigateToBusinessPage = () => {
    router.push('/settings?tab=business-account');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <div className='p-6'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-600 dark:text-gray-300'>
          Select Organization
        </h2>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          Please select an organization to continue. You must select an
          organization before proceeding.
        </p>

        <div className='space-y-3'>
          {organizations.map((org) => (
            <div
              key={org.id}
              className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors'
              onClick={() => handleSelectOrg(org.id)}
            >
              <h3 className='font-medium text-gray-600 dark:text-gray-300'>
                {org?.business_name}
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {org?.location}
              </p>
            </div>
          ))}
        </div>

        {organizations.length === 0 && (
          <div className='text-center py-8'>
            <p className='text-gray-500 dark:text-gray-400'>
              No business profile found.
            </p>
            <Button
              variant='primary'
              className='mt-4'
              onClick={navigateToBusinessPage}
            >
              Create a business profile
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SelectOrgModal;
