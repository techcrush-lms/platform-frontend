'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn, formatMoney, getAvatar, shortenId } from '@/lib/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { Customer } from '@/types/notification';
import { EyeIcon, PencilIcon } from 'lucide-react';
import moment from 'moment-timezone';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface CustomerItemProps {
  customer: Customer;
}
const CustomerItem = ({ customer }: CustomerItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const { org } = useSelector((state: RootState) => state.org);

  const handleOpenSubscription = () => {
    setIsPlanModalOpen(true);
  };

  let total_expenses;

  if (customer.payments) {
    total_expenses = formatMoney(customer.total_expenses);
  } else {
    total_expenses = formatMoney(0);
  }

  return (
    <>
      <tr
        key={customer.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <Link
            href={`/customers/${customer.id}`}
            className='hover:text-primary-400 p-0 underline underline-offset-4 flex items-center gap-1'
            title={customer.id}
          >
            {shortenId(customer.id)} <PencilIcon size='13' />
          </Link>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <p className={cn('flex items-center gap-1 hover:text-primary-400')}>
            {(customer?.profile?.profile_picture! || customer.name) && (
              <img
                src={getAvatar(
                  customer?.profile?.profile_picture!,
                  customer.name
                )}
                alt={customer.name}
                className='w-8 h-8 rounded-full object-cover'
              />
            )}
            {customer.name}
          </p>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.email}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {customer.phone || 'N/A'}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {total_expenses}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(customer.created_at).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(customer.updated_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Update Plan Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title='Update plan'
        className='max-w-xl my-[50%] overflow-y-auto'
      >
        <div></div>
      </Modal>
    </>
  );
};

export default CustomerItem;
