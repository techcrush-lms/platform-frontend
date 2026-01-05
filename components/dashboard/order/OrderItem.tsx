import React from 'react';
import { Order, OrderStatus } from '@/types/order';
import { formatMoney } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Eye,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItemProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onViewDetails }) => {
  const router = useRouter();

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className='w-4 h-4 text-yellow-500' />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle className='w-4 h-4 text-blue-500' />;
      case OrderStatus.PROCESSING:
        return <Package className='w-4 h-4 text-purple-500' />;
      case OrderStatus.SHIPPED:
        return <Truck className='w-4 h-4 text-orange-500' />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case OrderStatus.CANCELLED:
        return <XCircle className='w-4 h-4 text-red-500' />;
      case OrderStatus.REFUNDED:
        return <RotateCcw className='w-4 h-4 text-gray-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case OrderStatus.PROCESSING:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case OrderStatus.SHIPPED:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case OrderStatus.REFUNDED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        {/* Order Info */}
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-3'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Order #{order.order_number}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400'>
            <div>
              <p className='font-medium text-gray-900 dark:text-white mb-1'>
                Order Date
              </p>
              <p>{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className='font-medium text-gray-900 dark:text-white mb-1'>
                Total Amount
              </p>
              <p className='text-lg font-semibold text-primary-main'>
                {formatMoney(Number(order.total_amount), order.currency)}
              </p>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className='mt-4'>
            <p className='font-medium text-gray-900 dark:text-white mb-2'>
              Items ({order.order_items.length})
            </p>
            <div className='space-y-2'>
              {order.order_items.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between text-sm'
                >
                  <span className='text-gray-600 dark:text-gray-400'>
                    {item.product_name} x{item.quantity}
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {formatMoney(Number(item.total_price), item.currency)}
                  </span>
                </div>
              ))}
              {order.order_items.length > 2 && (
                <p className='text-xs text-gray-500 dark:text-gray-500'>
                  +{order.order_items.length - 2} more items
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-2 lg:flex-shrink-0'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => onViewDetails(order.id)}
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

export default OrderItem;
