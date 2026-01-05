'use client';

import { NotificationType, NOTIFICATION_STATUS } from '@/lib/utils';
import { Dropdown } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  HiBan,
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiTrash,
} from 'react-icons/hi';
import ActionConfirmationModal from './ActionConfirmationModal';

const ActionDropdown = ({
  id,
  status,
  notificationType,
  table = 'email',
}: {
  id: string;
  status: NOTIFICATION_STATUS;
  notificationType: NotificationType;
  table?: string;
}) => {
  const router = useRouter();
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const notificationTypesForEdit = [
    NOTIFICATION_STATUS.SCHEDULED,
    NOTIFICATION_STATUS.NONE,
  ];
  const notificationTypesForCancel = [NOTIFICATION_STATUS.SCHEDULED];
  const notificationTypesForDelete = [
    NOTIFICATION_STATUS.PENDING,
    NOTIFICATION_STATUS.NONE,
    NOTIFICATION_STATUS.DELIVERED,
    NOTIFICATION_STATUS.CANCELED,
    NOTIFICATION_STATUS.SCHEDULED,
  ];

  const handleEditNav = () => {
    let editLink = '';
    if (table === 'email') {
      editLink = `/notifications/email/${id}/edit?type=${notificationType}`;
    } else if (table === 'push') {
      editLink = `/notifications/push/${id}/edit?type=${notificationType}`;
    }
    router.push(editLink);
  };

  return (
    <>
      <Dropdown
        label=''
        dismissOnClick={false}
        placement='left-start'
        renderTrigger={() => (
          <span className='cursor-pointer'>
            <HiDotsVertical />
          </span>
        )}
      >
        {notificationTypesForEdit.includes(status) && (
          <Dropdown.Item className='flex gap-1' onClick={handleEditNav}>
            <HiOutlinePencilAlt />
            Edit
          </Dropdown.Item>
        )}
        {notificationTypesForCancel.includes(status) && (
          <Dropdown.Item
            className='flex gap-1 text-orange-400  dark:text-orange-500'
            onClick={() => setOpenCancelModal(true)}
          >
            <HiBan />
            Cancel
          </Dropdown.Item>
        )}
        {notificationTypesForDelete.includes(status) && (
          <Dropdown.Item
            className='flex gap-1 text-red-400  dark:text-red-500'
            onClick={() => setOpenDeleteModal(true)}
          >
            <HiTrash />
            Delete
          </Dropdown.Item>
        )}
      </Dropdown>
      <ActionConfirmationModal
        body='Are you sure you want to cancel'
        openModal={openCancelModal}
        setOpenModal={setOpenCancelModal}
      />
      <ActionConfirmationModal
        body='Are you sure you want to delete'
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
    </>
  );
};

export default ActionDropdown;
