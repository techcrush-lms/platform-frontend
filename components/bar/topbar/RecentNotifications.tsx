'use client';

import React from 'react';
import { Dropdown, Avatar } from 'flowbite-react';
import { HiBell } from 'react-icons/hi';
import moment from 'moment';
import useInstantNotification from '@/hooks/page/useInstantNotification';
import { InstantNotification } from '@/types/notification';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '@/redux/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

const RecentNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { org } = useSelector((state: RootState) => state.org);
  const { instantNotifications, instantNotificationLoading, unReadCount } =
    useInstantNotification({ initialLimit: 10, initialType: 'push' });

  const handleClickNotification = (id: string) => {
    dispatch(markNotificationRead({ id, business_id: org?.id }));
    router.push('/notifications');
  };

  // helper to shorten message
  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n) + '...' : str;
  };

  return (
    <Dropdown
      inline
      label={
        <div className='relative'>
          <HiBell
            className='w-7 h-7 p-1.5 text-gray-500 rounded-full border border-gray-300 
            hover:text-gray-900 hover:bg-gray-100 
            dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 
            focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
          />
          {unReadCount > 0 && (
            <span className='absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full'>
              {unReadCount}
            </span>
          )}
        </div>
      }
      arrowIcon={false}
      className='w-100 max-w-sm bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600 shadow-lg rounded-xl overflow-hidden'
    >
      <Dropdown.Header className='text-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 font-medium'>
        Notifications
      </Dropdown.Header>

      {instantNotificationLoading ? (
        <div className='p-4 space-y-3 w-96'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex items-start space-x-3 animate-pulse'>
              <div className='w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4'></div>
                <div className='h-2 bg-gray-200 dark:bg-gray-500 rounded w-1/2'></div>
              </div>
            </div>
          ))}
        </div>
      ) : instantNotifications.length === 0 ? (
        <Dropdown.Item className='flex items-center justify-center w-96 py-3 text-gray-500 dark:text-gray-400'>
          No Notifications yet.
        </Dropdown.Item>
      ) : (
        <>
          <div className='max-h-96 overflow-y-auto'>
            {instantNotifications.map((notification: InstantNotification) => (
              <Dropdown.Item
                key={notification.id}
                onClick={() => handleClickNotification(notification.id)}
                className='flex items-start border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 !text-left'
              >
                <Avatar
                  img={notification.icon_url || '/favicon.ico'}
                  alt='Notification'
                  className='mr-3'
                />
                <div className='flex-1'>
                  <div
                    className='text-gray-500 dark:text-gray-400 text-sm mb-1.5 line-clamp-3'
                    dangerouslySetInnerHTML={{
                      __html: `<span class="font-semibold text-gray-900 dark:text-white">${notification.title}</span> – ${notification.message}`,
                    }}
                  />
                  <div className='flex items-center gap-2 justify-between'>
                    <div className='text-xs font-medium text-primary-600 dark:text-primary-500'>
                      {moment(notification.created_at).fromNow()}
                    </div>
                    {!notification.read && (
                      <div className='size-2 rounded-full bg-[#27BE69]'></div>
                    )}
                  </div>
                </div>
              </Dropdown.Item>
            ))}
          </div>

          <div className='flex items-center justify-between bg-gray-50 dark:bg-gray-600 mt-4'>
            <Dropdown.Item
              href='/notifications'
              className='flex-1 text-sm font-medium text-center text-gray-900 hover:bg-gray-100 dark:text-white'
            >
              View all
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() =>
                dispatch(markAllNotificationsRead({ business_id: org?.id }))
              }
              className='flex-1 text-sm font-medium text-center text-gray-900 hover:bg-gray-100 dark:text-white cursor-pointer'
            >
              Mark all as read
            </Dropdown.Item>
          </div>
        </>
      )}
    </Dropdown>
  );
};

export default RecentNotifications;
