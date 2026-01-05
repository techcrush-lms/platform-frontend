import React from 'react';
import { Payment } from '@/types/payment';
import { formatMoney, shortenId } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Eye,
  CreditCard,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientPaymentItemProps {
  payment: Payment;
  onViewDetails: (paymentId: string) => void;
}

const ClientPaymentItem: React.FC<ClientPaymentItemProps> = ({
  payment,
  onViewDetails,
}) => {
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'PENDING':
        return <Clock className='w-4 h-4 text-yellow-500' />;
      case 'FAILED':
        return <XCircle className='w-4 h-4 text-red-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPurchaseTypeLabel = (type: string) => {
    switch (type) {
      case 'TICKET':
        return 'Event Ticket';
      case 'COURSE':
        return 'Course';
      case 'SUBSCRIPTION':
        return 'Subscription';
      case 'PRODUCT':
        return 'Product';
      default:
        return type;
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        {/* Payment Info */}
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-3'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Payment #{shortenId(payment.id)}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                payment.payment_status
              )}`}
            >
              {getStatusIcon(payment.payment_status)}
              {payment.payment_status}
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400'>
            <div>
              <p className='font-medium text-gray-900 dark:text-white mb-1'>
                Payment Date
              </p>
              <p>{formatDate(payment.created_at)}</p>
            </div>
            <div>
              <p className='font-medium text-gray-900 dark:text-white mb-1'>
                Amount
              </p>
              <p className='text-lg font-semibold text-primary-main'>
                {formatMoney(Number(payment.amount), payment.currency)}
              </p>
            </div>
          </div>

          {/* Purchase Items Preview */}
          <div className='mt-4'>
            <p className='font-medium text-gray-900 dark:text-white mb-2'>
              Items ({payment.purchase?.items.length})
            </p>
            <div className='space-y-2'>
              {payment.purchase?.items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between text-sm'
                >
                  <span className='text-gray-600 dark:text-gray-400'>
                    {item.name} ({getPurchaseTypeLabel(item.purchase_type)}) x
                    {item.quantity}
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {formatMoney(item.price, payment.currency)}
                  </span>
                </div>
              ))}
              {payment.purchase?.items.length > 2 && (
                <p className='text-xs text-gray-500 dark:text-gray-500'>
                  +{payment.purchase?.items.length - 2} more items
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className='mt-3 flex items-center gap-2'>
            <CreditCard className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {payment.payment_method}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-2 lg:flex-shrink-0'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => onViewDetails(payment.id)}
            className='flex items-center gap-2'
          >
            <Eye className='w-4 h-4' />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientPaymentItem;
