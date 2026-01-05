import {
  cn,
  formatMoney,
  getAvatar,
  PaymentStatus,
  shortenId,
} from '@/lib/utils';
import Icon from '../ui/Icon';
import { Payment } from '@/types/payment';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ArrowDown, ArrowUp, Clock, EyeIcon } from 'lucide-react';

interface RecentTransactionsProps {
  payments: Payment[];
}

export function RecentTransactions({ payments }: RecentTransactionsProps) {
  const { profile } = useSelector((state: RootState) => state.auth);

  if (!payments?.length) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
        <Icon url='/icons/landing/calendar-check.svg' width={48} height={48} />
        <p className='mt-3 text-base font-medium'>No recent transactions</p>
        <p className='text-xs'>Your recent transactions will appear here.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {payments.map((payment, index) => {
        const isWithdrawal = payment.transaction_type === 'WITHDRAWAL';
        const status = payment.payment_status?.toUpperCase?.();
        const formattedDate = format(
          new Date(payment.created_at),
          'MMM d, yyyy - h:mm a'
        );

        const user = payment.user;
        const businessUser = payment.business_info?.user;
        const isCurrentUser = String(businessUser?.id) === String(profile?.id);

        const displayName =
          user?.name || (isCurrentUser ? 'You' : businessUser?.name);
        const customerLink = user?.id
          ? `/customers/${user?.id}`
          : isCurrentUser
          ? '#'
          : `/customers/${businessUser?.id}`;

        const grossAmount = +payment.amount;
        const finalAmount = +payment.final_amount || grossAmount;
        const feeAmount = grossAmount - finalAmount;

        return (
          <div
            key={payment.id}
            className={cn(
              'flex items-start gap-3',
              payments.length - 1 !== index && 'border-b pb-3'
            )}
          >
            {/* Transaction Icon */}
            <div className='mt-1 flex-shrink-0'>
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105',
                  payment.payment_status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-600'
                    : payment.payment_status === 'FAILED'
                    ? 'bg-red-100 text-red-600'
                    : isWithdrawal
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-700'
                )}
              >
                {payment.payment_status === 'PENDING' ? (
                  <Clock className='w-4 h-4' />
                ) : payment.payment_status === 'FAILED' ? (
                  <ArrowUp className='w-4 h-4' />
                ) : isWithdrawal ? (
                  <ArrowUp className='w-4 h-4' />
                ) : (
                  <ArrowDown className='w-4 h-4' />
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div className='flex flex-col w-full'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold text-foreground'>
                  {isWithdrawal ? 'Withdrawal' : 'Payment'} •{' '}
                  <Link
                    href={`/payments/${payment.id}/details`}
                    className='hover:underline'
                  >
                    {shortenId(payment.id)}
                  </Link>
                </p>
                <Badge
                  variant={
                    status === PaymentStatus.SUCCESS
                      ? 'success'
                      : status === PaymentStatus.FAILED
                      ? 'destructive'
                      : 'warning'
                  }
                >
                  {status}
                </Badge>
              </div>

              <Link
                href={customerLink}
                className={cn(
                  'flex items-center gap-2 mt-0.5 text-sm',
                  !isCurrentUser && 'underline-offset',
                  isCurrentUser && 'hover:cursor-default'
                )}
              >
                <span className='truncate text-gray-800 dark:text-gray-100 flex items-center gap-1'>
                  {displayName}
                  {!isCurrentUser && <EyeIcon size={13} />}
                </span>
              </Link>

              {/* Amount Section */}
              <div className='mt-1 flex items-center justify-between'>
                <div className='flex flex-col'>
                  <p className='text-base font-semibold leading-tight'>
                    {formatMoney(finalAmount, payment.currency)}{' '}
                    <span className='text-xs text-muted-foreground ml-1'>
                      (net)
                    </span>
                  </p>
                  {feeAmount > 0 && (
                    <p className='text-xs text-muted-foreground'>
                      Gross: {formatMoney(grossAmount, payment.currency)} • Fee:{' '}
                      {formatMoney(feeAmount, payment.currency)}
                    </p>
                  )}
                </div>
                <p className='text-xs text-muted-foreground'>{formattedDate}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
