import { CouponType, formatMoney } from '@/lib/utils';
import React, { useState } from 'react';
import { Drawer } from '@/components/ui/drawer'; // Import a drawer component

import moment from 'moment'; // Import moment.js
import Link from 'next/link';
import { Coupon } from '@/types/coupon';
import { useParams } from 'next/navigation';
import { PencilIcon } from 'lucide-react';

interface CouponItemProps {
  coupon: Coupon;
}
const CouponItem = ({ coupon }: CouponItemProps) => {
  const params = useParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const valueData =
    coupon.type === CouponType.FLAT
      ? formatMoney(+coupon.value, coupon.currency)
      : `${coupon.value}%`;

  let statusColor = '';

  if (!coupon.is_active) {
    statusColor = `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
  } else {
    statusColor = `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
  }

  const createdBy = params?.id ? (
    coupon.creator.name
  ) : (
    <>
      {' '}
      <b>{coupon.creator.name}</b> from{' '}
      <Link
        href={`/organizations/${coupon.business.id}/details`}
        className='font-bold hover:text-primary-400'
      >
        {coupon.business.business_name}
      </Link>
    </>
  );

  return (
    <>
      <tr
        key={coupon.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <Link
            href={`/coupons/${coupon.id}/edit`}
            className='hover:text-primary-400 flex items-center gap-1 underline-offset'
            title={coupon.code}
          >
            {coupon.code}
            <PencilIcon size='13' />
          </Link>
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {coupon.type}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {valueData}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {moment(coupon.start_date).format('MMM D, YYYY')} -{' '}
          {moment(coupon.end_date).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {coupon.usage_limit}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {coupon.user_limit}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {formatMoney(+coupon.min_purchase, coupon.currency)}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          <span
            className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded`}
          >
            {coupon.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(coupon.created_at).format('MMM D, YYYY')}
        </td>
      </tr>
    </>
  );
};

export default CouponItem;
