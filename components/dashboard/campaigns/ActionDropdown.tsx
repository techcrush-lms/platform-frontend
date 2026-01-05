'use client';

import { NotificationType, NOTIFICATION_STATUS } from '@/lib/utils';
import { Dropdown } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  HiBan,
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiTrash,
} from 'react-icons/hi';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import {
  InstantNotification,
  ScheduledNotification,
} from '@/types/notification';
import {
  deleteNotification,
  fetchInstant,
} from '@/redux/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';

const ActionDropdown = ({
  id,
  status,
  notificationType,
  table = 'email',
  notification,
}: {
  id: string;
  status: NOTIFICATION_STATUS;
  notificationType: NotificationType;
  table?: string;
  notification?: InstantNotification | ScheduledNotification;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allowDeleteAction, setAllowDeleteAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      const response: any = await dispatch(
        deleteNotification({ id: notification?.id!, business_id: org?.id! })
      );

      if (response.type === 'notification-track/:id/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      dispatch(fetchInstant({ business_id: org?.id! }));
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (allowDeleteAction) {
      handleDelete();
      setAllowDeleteAction(false);
    }
  }, [allowDeleteAction]);

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
        body={`Are you sure you want to delete this notification record - ${notification?.title}`}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        allowAction={allowDeleteAction}
        setAllowAction={setAllowDeleteAction}
      />
    </>
  );
};

export default ActionDropdown;
