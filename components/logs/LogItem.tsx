import React, { useState } from 'react';

import moment from 'moment'; // Import moment.js
import { ActivityLog } from '@/types/log';

interface LogItemSchema {
  log: ActivityLog;
}
const LogItem = ({ log }: LogItemSchema) => {
  return (
    <>
      <tr
        key={log.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          {log.action}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {log.metadata}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {log.entity}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {log.user_agent}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {log.ip_address}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(log.created_at).format('MMM D, YYYY')}
        </td>
      </tr>
    </>
  );
};

export default LogItem;
