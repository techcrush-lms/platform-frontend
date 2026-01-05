'use client';

import Avatar from '@/components/ui/Avatar';
import {
  getAvatar,
  getPurchaseTypeLabel,
  reformatText,
  shortenId,
} from '@/lib/utils';
import { RootState } from '@/redux/store';
import React from 'react';
import {
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
  FaCreditCard,
  FaExchangeAlt,
  FaGraduationCap,
  FaTicketAlt,
  FaShoppingCart,
  FaTag,
  FaClock,
  FaSync,
  FaCheckCircle,
  FaTimesCircle,
  FaRegCreditCard,
  FaSignInAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { formatCurrency } from '@/lib/utils';
import { Payment } from '@/types/payment';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';

const getPurchaseTypeIcon = (type: string) => {
  switch (type) {
    case 'COURSE':
      return <FaGraduationCap className='text-blue-500' />;
    case 'TICKET':
      return <FaTicketAlt className='text-purple-500' />;
    case 'SUBSCRIPTION':
      return <FaRegCreditCard className='text-green-500' />;
    default:
      return <FaShoppingCart className='text-gray-500' />;
  }
};

const PaymentCard = ({ payment }: { payment: Payment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <ThemeDivBorder className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-3'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            {getPurchaseTypeIcon(payment.purchase_type)}
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {getPurchaseTypeLabel(payment.purchase_type)}
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            payment.payment_status
          )}`}
        >
          {payment.payment_status}
        </span>
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Amount
          </span>
          <span className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>

        {payment.discount_applied && (
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Discount
            </span>
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              {formatCurrency(payment.discount_applied, payment.currency)}
            </span>
          </div>
        )}

        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>Date</span>
          <span className='text-sm text-gray-700 dark:text-gray-300'>
            {new Date(payment.created_at).toLocaleDateString()}
          </span>
        </div>

        {payment.purchase?.items && payment.purchase.items.length > 0 && (
          <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-2 mb-2'>
              <FaExchangeAlt className='text-gray-400 dark:text-gray-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Items
              </span>
            </div>
            <div className='space-y-1'>
              {payment.purchase.items.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between items-center text-sm'
                >
                  <div
                    className='flex items-center gap-2'
                    title={item.purchase_type}
                  >
                    {getPurchaseTypeIcon(item.purchase_type)}
                    <span className='text-gray-600 dark:text-gray-400'>
                      {item.name}
                    </span>
                  </div>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {formatCurrency(item.price.toString(), payment.currency)} x{' '}
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <FaCreditCard className='text-gray-400 dark:text-gray-500' />
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                Payment Method
              </span>
            </div>
            <span className='text-xs text-gray-700 dark:text-gray-300'>
              {payment.payment_method}
            </span>
          </div>
          <div className='flex justify-between items-center mt-2'>
            <div className='flex items-center gap-2'>
              <FaTag className='text-gray-400 dark:text-gray-500' />
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                Transaction ID
              </span>
            </div>
            <span className='text-xs text-gray-700 dark:text-gray-300 font-mono'>
              #{shortenId(payment.id)}
            </span>
          </div>
        </div>
      </div>
    </ThemeDivBorder>
  );
};

const SubscriptionCard = ({ payment }: { payment: Payment }) => {
  if (!payment.subscription_plan) return null;

  const isActive = payment.payment_status === 'SUCCESS' && !payment.deleted_at;
  const isAutoRenew = payment.auto_renew;

  return (
    <ThemeDivBorder className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-3'>
        <div className='flex items-center gap-2'>
          <FaRegCreditCard className='text-green-500' />
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            {payment.subscription_plan.name}
          </span>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Plan Price
          </span>
          <span className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>

        <div className='flex justify-between items-center'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Start Date
          </span>
          <span className='text-sm text-gray-700 dark:text-gray-300'>
            {new Date(payment.created_at).toLocaleDateString()}
          </span>
        </div>

        {payment.interval && (
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Billing Interval
            </span>
            <span className='text-sm text-gray-700 dark:text-gray-300 capitalize'>
              {payment.interval.toLowerCase()}
            </span>
          </div>
        )}

        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FaSync
                className={`${
                  isAutoRenew
                    ? 'text-green-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Auto Renew
              </span>
            </div>
            {isAutoRenew ? (
              <FaCheckCircle className='text-green-500' />
            ) : (
              <FaTimesCircle className='text-gray-400 dark:text-gray-500' />
            )}
          </div>
        </div>

        {payment.billing_info && (
          <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-2 mb-2'>
              <FaClock className='text-gray-400 dark:text-gray-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Billing Information
              </span>
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              {payment.billing_info.address}
              {payment.billing_info.apartment &&
                `, ${payment.billing_info.apartment}`}
              <br />
              {payment.billing_info.city}, {payment.billing_info.state}
              <br />
              {payment.billing_info.postal_code}, {payment.billing_info.country}
            </div>
          </div>
        )}

        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <FaTag className='text-gray-400 dark:text-gray-500' />
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                Subscription ID
              </span>
            </div>
            <span className='text-xs text-gray-700 dark:text-gray-300 font-mono'>
              #{shortenId(payment.id)}
            </span>
          </div>
        </div>
      </div>
    </ThemeDivBorder>
  );
};

const ViewCustomer = () => {
  const { customer } = useSelector((state: RootState) => state.org);

  // Filter subscription payments
  const subscriptionPayments =
    customer?.payments?.filter(
      (payment) => payment.purchase_type === 'SUBSCRIPTION'
    ) || [];

  return (
    <div className='space-y-6'>
      {/* Profile Card */}
      <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center gap-5'>
          {customer?.profile?.profile_picture ? (
            <Avatar
              src={customer?.profile?.profile_picture!}
              alt={customer?.name!}
              size='xl'
            />
          ) : (
            <img
              src={getAvatar(
                customer?.profile?.profile_picture!,
                customer?.name!
              )}
              alt={customer?.name}
              className='w-[100px] h-[100px] rounded-full object-cover'
            />
          )}

          <div>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
              {customer?.name}
            </h2>
          </div>
        </div>

        {/* Info Grid */}
        <div className='grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300'>
          <div className='flex items-center gap-2'>
            <FaEnvelope className='text-gray-400 dark:text-gray-500' />
            <span>{customer?.email}</span>
          </div>
          <div className='flex items-center gap-2'>
            <FaPhone className='text-gray-400 dark:text-gray-500' />
            <span>{customer?.phone || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-2'>
            <FaCalendarAlt className='text-gray-400 dark:text-gray-500' />
            <span>
              Joined on {new Date(customer?.created_at!).toLocaleDateString()}
            </span>
          </div>
          {customer?.business_contacts[0]?.joined_via && (
            <div className='flex items-center gap-2'>
              <FaSignInAlt className='text-gray-400 dark:text-gray-500' />
              <span>
                Joined via{' '}
                <b>
                  {reformatText(
                    customer?.business_contacts[0].joined_via?.toLowerCase(),
                    '_'
                  )}
                </b>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payments Section */}
      <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
            Payment History
          </h3>
          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
            <FaMoneyBillWave />
            <span>Total Payments: {customer?.payments?.length || 0}</span>
          </div>
        </div>

        {customer?.payments && customer.payments.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            {customer.payments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
            No payment history available
          </div>
        )}
      </div>

      {/* Subscriptions Section */}
      {subscriptionPayments.length > 0 && (
        <div className='w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
              Active Subscriptions
            </h3>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <FaRegCreditCard />
              <span>Total Subscriptions: {subscriptionPayments.length}</span>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {subscriptionPayments.map((payment) => (
              <SubscriptionCard key={payment.id} payment={payment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCustomer;
