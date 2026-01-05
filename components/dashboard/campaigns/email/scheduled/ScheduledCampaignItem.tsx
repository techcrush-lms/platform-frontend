import Badge from '@/components/ui/SystemBadge';
import { getColor, shortenId } from '@/lib/utils';
import { ScheduledNotification } from '@/types/notification';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import ActionDropdown from '../../ActionDropdown';
import moment from 'moment-timezone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  viewInstantNotification,
  viewScheduledNotification,
} from '@/redux/slices/notificationSlice';
import { Modal } from '@/components/ui/Modal';
import ViewNotification from '../instant/ViewCampaign';
import { EyeIcon } from 'lucide-react';

interface ScheduledNotificationItemProps {
  notification: ScheduledNotification;
}
const ScheduledNotificationItem = ({
  notification,
}: ScheduledNotificationItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const sender = notification.owner
    ? `${notification.owner?.name} (${shortenId(notification.owner?.id!)})`
    : notification.business
    ? `${notification.business?.business_name} (${shortenId(
        notification.business?.id!
      )})`
    : 'N/A';

  const status = notification.schedule_info?.status;

  const handleOpenNotification = () => {
    dispatch(viewScheduledNotification(notification.id));

    setIsNotificationModalOpen(true);
  };

  return (
    <>
      <tr
        key={notification.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
      >
        <td className='px-6 py-4 max-w-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-900 dark:text-white font-bold'>
          <button
            className='hover:text-primary-400 flex items-center gap-1 underline-offset'
            onClick={handleOpenNotification}
            title={notification.id}
          >
            {notification.title}
            <EyeIcon size='13' />
          </button>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {sender}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(notification.schedule_info?.scheduled_time).format(
            'MMMM D, YYYY HH:MM'
          )}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <Badge
            color={getColor(notification.schedule_info?.status!)!}
            text={capitalize(status)}
          />
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(notification.created_at).format('MMMM D, YYYY')}
        </td>

        <td className='flex px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <ActionDropdown
            id={notification.id}
            status={
              notification.schedule_info?.status.toLocaleLowerCase() as any
            }
            notificationType={notification.type}
            notification={notification}
          />
        </td>
      </tr>
      {/* View Notification Modal */}
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title='Scheduled Notification Message'
        className='max-w-xl my-[50%] overflow-y-auto'
      >
        <ViewNotification
          setIsNotificationModalOpen={setIsNotificationModalOpen}
        />
      </Modal>
    </>
  );
};

export default ScheduledNotificationItem;
