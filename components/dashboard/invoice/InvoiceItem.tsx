import React, { useState } from 'react';
import Link from 'next/link';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { Copy, EyeIcon, PencilIcon, Verified, X } from 'lucide-react';
import { RootState } from '@/redux/store';
import { Payment } from '@/types/payment';
import {
  cn,
  formatMoney,
  getAvatar,
  PaymentStatus,
  shortenId,
} from '@/lib/utils';
import { Invoice } from '@/types/invoice';
import { InvoiceStatus } from '@/lib/schema/invoice.schema';
import toast from 'react-hot-toast';

interface InvoiceItemProps {
  invoice: Invoice;
  idx: number;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ invoice, idx }) => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const [copied, setCopied] = useState(false);

  const isEvenRow = idx % 2 === 0;
  const rowClasses = cn(
    'border-b dark:border-gray-700',
    isEvenRow ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
  );

  const user = invoice.user;
  const businessUser = invoice.business_info?.user;
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

  const formattedDate = moment(invoice.created_at).format('lll');
  const formattedAmount = formatMoney(Number(invoice.amount), invoice.currency);

  const statusClasses = cn(
    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
    invoice.status === InvoiceStatus.PUBLISHED
      ? 'bg-green-100 text-green-800'
      : invoice.status === InvoiceStatus.DRAFT
      ? 'bg-blue-100 text-blue-800'
      : 'bg-yellow-100 text-yellow-800'
  );

  const paid = invoice.paid ? (
    <Verified className='text-green-600' />
  ) : (
    <X className='text-red-600' />
  );

  const handleCopyInvoiceLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const invoiceUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/invoice/${invoice.invoice_no}`;
    try {
      await navigator.clipboard.writeText(invoiceUrl);
      setCopied(true);
      toast.success('Invoice link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy invoice link');
    }
  };

  return (
    <tr key={invoice.id} className={rowClasses}>
      {/* Date */}
      <td className='px-6 py-2 min-w-[140px] text-sm'>{formattedDate}</td>

      {/* Transaction ID */}
      <td className='px-6 py-2 min-w-[180px]'>
        <button
          onClick={handleCopyInvoiceLink}
          className={cn(
            'hover:underline font-medium flex items-center gap-1 underline-offset cursor-pointer'
          )}
        >
          {invoice.invoice_no}
          <Copy size={13} />
          {copied && (
            <span className='text-xs text-green-600 ml-1'>(Copied!)</span>
          )}
        </button>
      </td>

      <td className='px-6 py-2 min-w-[240px]'>{invoice.title}</td>

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

      {/* Status */}
      <td className='px-6 py-2'>
        <span className={statusClasses}>{invoice.status}</span>
      </td>

      {/* Paid */}
      <td className='px-6 py-2'>{paid}</td>
    </tr>
  );
};

export default InvoiceItem;
