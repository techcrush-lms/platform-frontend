'use client';

import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Input from './ui/Input';
import { ActionKind } from '@/lib/utils';

const ActionConfirmationModal = ({
  body = 'Are you sure you want to proceed with this action?',
  action,
  openModal,
  setOpenModal,
  allowAction,
  setAllowAction,
  reason,
  setReason,
}: {
  body?: string;
  action?: ActionKind;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  allowAction?: boolean;
  setAllowAction?: React.Dispatch<React.SetStateAction<boolean>>;
  reason?: string;
  setReason?: any;
}) => {
  const handleAction = (allow: boolean) => {
    setAllowAction?.(allow);

    setOpenModal?.(false);
  };

  return (
    <>
      <Modal
        show={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-2'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              {body}
            </h3>
            {action === ActionKind.CRITICAL && (
              <div className=''>
                <textarea
                  id='message'
                  rows={4}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Write a reason'
                  onChange={(e: any) => setReason(e.target.value)}
                  value={reason}
                ></textarea>
              </div>
            )}
            <div className='flex justify-center gap-4 mt-4'>
              <Button
                type='button'
                color='failure'
                onClick={() => handleAction(true)}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                type='button'
                color='gray'
                onClick={() => handleAction(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionConfirmationModal;
