import { cn, formatMoney, getAvatar, shortenId } from '@/lib/utils';
import { Withdrawal } from '@/types/withdrawal';
import moment from 'moment-timezone';
import Link from 'next/link';
import React from 'react';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface WithdrawalItemProps {
    txn: Withdrawal;
    idx: number;
}

const WithdrawalItem = ({ txn, idx }: WithdrawalItemProps) => {

    const { profile } = useSelector((state: RootState) => state.auth);
    const isEvenRow = idx % 2 === 0;
    const rowClasses = cn(
        'border-b dark:border-gray-700',
        isEvenRow ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
    );

    const user = txn.requested_by;
    const profilePic = '';
    const displayAvatar = profilePic || user?.name;

    return (
        <tr key={txn.id} className={rowClasses}>

            <td className='px-6 py-2 min-w-[140px] text-sm'>
                {moment(txn.created_at).format('lll')}
            </td>


            <td className='px-6 py-2'>
                <Link
                    href={`/withdrawals/${txn.id}`}
                    className='hover:underline font-medium flex items-center gap-1 underline-offset'>
                    {shortenId(txn.id)}
                    <PencilIcon size='13' />
                </Link>
            </td>

            <td className='px-6 py-2 font-medium'>
                {formatMoney(+txn.amount, txn.currency)}
            </td>


            <td className='px-6 py-2 min-w-[200px]'>
                <Link
                    href={`/team/${user.id}`}
                    className='flex items-center gap-3 underline-offset'>

                    {/* Avatar */}
                    {displayAvatar && (
                        <img src={getAvatar(profilePic!, user?.name)} alt={user?.name} className='size-8 rounded-full object-cover' />
                    )}

                    {/* Name + Icon */}
                    <div className={cn(
                        'flex items-center gap-1 underline underline-offset-4 dark:text-gray-200',
                        user?.id === profile?.id && 'no-underline'
                    )}>
                        <span className='font-semibold truncate text-gray-800 dark:text-gray-100'>
                            {user?.id === profile?.id ? 'You' : user?.name || '-'}
                        </span>

                        {user?.id !== profile?.id && (
                            <EyeIcon size='13' />
                        )}
                    </div>
                </Link>
            </td>


            {/* Status */}
            <td className="px-6 py-2">
                <span
                    className={cn(
                        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                        txn.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : txn.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : txn.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                    )}>
                    {txn.status}
                </span>
            </td>
        </tr>
    );
};

export default WithdrawalItem;
