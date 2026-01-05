import {
  NotificationType,
  NotificationStatusTypes,
  NotificationKind,
} from '@/lib/utils';
import React from 'react';

const NotificationStatus = ({
  setNotificationType,
  notificationType,
}: {
  setNotificationType: React.Dispatch<React.SetStateAction<NotificationKind>>;
  notificationType: NotificationKind;
}) => {
  return (
    <>
      <form className='w-full'>
        <select
          id='email-type'
          className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 flex p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          onChange={(e: any) => setNotificationType(e.target.value)}
          value={notificationType}
        >
          {NotificationStatusTypes.map((type) => (
            <option key={type.slug} value={type.slug}>
              {type.name}
            </option>
          ))}
        </select>
      </form>
    </>
  );
};

export default NotificationStatus;
