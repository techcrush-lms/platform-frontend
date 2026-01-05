import XIcon from '@/components/ui/icons/XIcon';
import Badge from '@/components/ui/SystemBadge';
import { getColor, NOTIFICATION_STATUS } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { stat } from 'fs';
import { capitalize } from 'lodash';
import moment from 'moment-timezone';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';

interface ViewNotificationProps {
  setIsNotificationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  recipients?: string[];
  htmlTemplate?: string;
}

const ViewNotification = ({
  setIsNotificationModalOpen,
}: ViewNotificationProps) => {
  const { org } = useSelector((state: RootState) => state.org);
  const { notification } = useSelector(
    (state: RootState) => state.notification
  );

  const recipients = notification?.is_scheduled
    ? notification.schedule_info.recipients
    : notification?.recipients;

  const status = notification?.schedule_info
    ? notification?.schedule_info?.status
    : notification?.status
    ? NOTIFICATION_STATUS.DELIVERED
    : NOTIFICATION_STATUS.FAILED;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'
      onClick={() => setIsNotificationModalOpen(false)}
    >
      <div
        className='bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
          onClick={() => setIsNotificationModalOpen(false)}
        >
          <XIcon />
        </button>

        {/* Title */}
        <h2 className='text-xl font-bold mb-4 text-gray-800 dark:text-white'>
          📢 {notification?.title}
        </h2>

        <div>
          <Badge color={getColor(status!)!} text={capitalize(status)} />
        </div>

        {notification?.is_scheduled && (
          <div>
            {/* Scheduled time */}
            <p className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Scheduled time:
            </p>
            <p className='mb-4 text-gray-800 dark:text-white'>
              {moment(notification?.schedule_info.scheduled_time).format(
                'LLLL'
              )}
            </p>
          </div>
        )}

        {/* Recipients */}
        <div className='mb-4'>
          <p className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>
            Recipients:
          </p>
          <div className='flex flex-wrap gap-2'>
            {notification?.is_scheduled
              ? notification?.schedule_info.recipients.map((recipient, idx) => (
                  <span
                    key={idx}
                    className='bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200'
                  >
                    {recipient.user.email}
                  </span>
                ))
              : notification?.recipients.map((recipient, idx) => (
                  <span
                    key={idx}
                    className='bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200'
                  >
                    {recipient.email}
                  </span>
                ))}
          </div>
        </div>

        {/* HTML Content */}
        <div>
          <p className='font-semibold text-gray-700 dark:text-gray-300 mb-1'>
            Message Preview:
          </p>
          {/* <div
            className='border rounded p-4 bg-gray-50 dark:bg-gray-800 dark:text-white'
            dangerouslySetInnerHTML={{ __html: notification?.message! }}
          /> */}
          <div className='flex-1 border border-dashed rounded-lg'>
            <div className='space-y-6 p-4 sm:p-6 md:p-8 w-full'>
              <div className='flex flex-col items-start justify-start pt-8 mx-auto pt:mt-0 '>
                <a
                  href='#'
                  className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white text-gray-600'
                >
                  <Image
                    src={org?.logo_url!}
                    width={70}
                    height={70}
                    alt='Logo'
                    className='m-auto block dark:hidden'
                    priority
                  />
                  <Image
                    src={org?.logo_url!}
                    width={70}
                    height={70}
                    alt='Logo'
                    className='m-auto hidden dark:block'
                    priority
                  />
                </a>

                <div className='overflow-hidden dark:text-white text-gray-600 w-full'>
                  <div
                    dangerouslySetInnerHTML={{ __html: notification?.message! }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotification;
