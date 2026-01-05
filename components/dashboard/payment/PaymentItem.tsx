import React from 'react';
import Link from 'next/link';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { RootState } from '@/redux/store';
import { Payment } from '@/types/payment';
import {
  cn,
  formatMoney,
  getAvatar,
  PaymentStatus,
  shortenId,
} from '@/lib/utils';

interface PaymentItemProps {
  txn: Payment;
  idx: number;
}

const PaymentItem: React.FC<PaymentItemProps> = ({ txn, idx }) => {
  const { profile } = useSelector((state: RootState) => state.auth);

  const isEvenRow = idx % 2 === 0;
  const rowClasses = cn(
    'border-b dark:border-gray-700',
    isEvenRow ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
  );

  const user = txn.user;
  const businessUser = txn.business_info?.user;
  const profilePic =
    user?.profile?.profile_picture ||
    businessUser?.profile?.profile_picture ||
    null;

  const avatarSrc = getAvatar(
    profilePic as unknown as string,
    user?.name
  ) as string;
  const isCurrentUser = String(businessUser?.id) === String(profile?.id);
  const customerLink = user?.id
    ? `/customers/${user?.id}`
    : isCurrentUser
    ? '#'
    : `/customers/${businessUser?.id}`;
  const displayName =
    user?.name || (isCurrentUser ? 'You' : businessUser?.name);

  const formattedDate = moment(txn.created_at).format('lll');
  const formattedAmount = formatMoney(Number(txn.amount), txn.currency);
  const formattedEarnedAmount = formatMoney(
    Number(txn.final_amount),
    txn.currency
  );

  const statusClasses = cn(
    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
    txn.payment_status === PaymentStatus.SUCCESS
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
  );

  return (
    <tr key={txn.id} className={rowClasses}>
      {/* Date */}
      <td className='px-6 py-2 min-w-[140px] text-sm'>{formattedDate}</td>

      {/* Transaction ID */}
      <td className='px-6 py-2'>
        <Link
          href={`/payments/${txn.id}/details`}
          className={cn(
            'hover:underline font-medium flex items-center gap-1 underline-offset'
          )}
        >
          {shortenId(txn.id)}
          <PencilIcon size={13} />
        </Link>
      </td>

      {/* Type */}
      <td className='px-6 py-2'>
        {txn.purchase_type || txn.transaction_type || '—'}
      </td>

      {/* User */}
      <td className='px-6 py-2 min-w-[200px]'>
        <Link
          href={customerLink}
          className={cn(
            'flex items-center gap-3',
            !isCurrentUser && 'underline-offset',
            isCurrentUser && 'hover:cursor-default'
          )}
        >
          {avatarSrc && (
            <img
              src={avatarSrc}
              alt={user?.name || 'User Avatar'}
              className='w-10 h-10 rounded-full object-cover'
            />
          )}
          <span className='font-semibold truncate text-gray-800 dark:text-gray-100 flex items-center gap-1'>
            {displayName}
            {!isCurrentUser && <EyeIcon size={13} />}
          </span>
        </Link>
      </td>

      {/* Amount Paid */}
      <td className='px-6 py-2 font-medium'>{formattedAmount}</td>

      {/* Amount Earned */}
      <td className='px-6 py-2 font-medium'>{formattedEarnedAmount}</td>

      {/* Status */}
      <td className='px-6 py-2'>
        <span className={statusClasses}>{txn.payment_status}</span>
      </td>
    </tr>
  );
};

export default PaymentItem;
