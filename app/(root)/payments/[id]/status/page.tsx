'use client';

import React, { useEffect, useState } from 'react';
import PageHeading from '@/components/PageHeading';
import { CheckCircle, XCircle, Clock, QrCode } from 'lucide-react';
import usePaymentQr from '@/hooks/page/usePaymentQr';
import { PaymentData } from '@/types/payment';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SelectOrgModal from '@/components/dashboard/SelectOrgModal';

const PaymentStatus = () => {
  const { payment_qr_details, payment_qr_message: message } = usePaymentQr();

  const [showOrgModal, setShowOrgModal] = useState(false);

  const { orgs, org } = useSelector((state: RootState) => state.org);

  const data: PaymentData | null = payment_qr_details;

  /** --------------------------------------------------
   *  ONLY ALLOW EVENT TICKETS
   * -------------------------------------------------- */
  const purchaseItem = data?.purchase?.items?.[0] ?? null;
  const isEventTicket = purchaseItem?.purchase_type === 'TICKET';

  /** --------------------------------------------------
   *  STATUS LOGIC
   * -------------------------------------------------- */
  const isSuccess = data?.qr_confirmed === true;
  const isExpired = data?.qr_expiry
    ? new Date(data.qr_expiry) < new Date()
    : false;
  const isFailed = !isSuccess && !isExpired;

  const getIcon = () => {
    if (isSuccess)
      return (
        <CheckCircle className='w-16 h-16 text-green-600 dark:text-green-400' />
      );
    if (isExpired)
      return (
        <Clock className='w-16 h-16 text-yellow-600 dark:text-yellow-400' />
      );
    return <XCircle className='w-16 h-16 text-red-600 dark:text-red-400' />;
  };

  const getStatusColor = () => {
    if (isSuccess) return 'text-green-700 dark:text-green-400';
    if (isExpired) return 'text-yellow-700 dark:text-yellow-400';
    return 'text-red-700 dark:text-red-400';
  };

  const getStatusLabel = () => {
    if (isSuccess) return 'QR Code Validated';
    if (isExpired) return 'QR Code Expired';
    return 'QR Code Not Valid';
  };

  useEffect(() => {
    // Show org selection modal if no org is selected
    if (!org && orgs.length > 0) {
      setShowOrgModal(true);
    }
  }, [org, orgs]);

  // Early returns after all hooks are called
  if (!org && orgs.length > 0) {
    return <SelectOrgModal isOpen={true} organizations={orgs} />;
  }

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-2'>
        <PageHeading
          title='Event Ticket Status'
          layer2='Payments'
          layer3='Ticket Validation'
          layer2Link='/payments'
          enableBreadCrumb={true}
        />

        <div className='bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-xl mx-auto text-center space-y-6'>
          {/* STATUS ICON */}
          <div className='flex justify-center'>{getIcon()}</div>

          {/* STATUS LABEL */}
          <h2 className={`text-2xl font-bold ${getStatusColor()}`}>
            {getStatusLabel()}
          </h2>

          {/* API MESSAGE */}
          {message && (
            <p className='text-gray-600 dark:text-gray-300'>{message}</p>
          )}

          {/* --- NON-TICKET WARNING --- */}
          {!isEventTicket && (
            <p className='text-red-600 dark:text-red-400 font-semibold mt-4'>
              QR Code only applies to event tickets.
            </p>
          )}

          {/* USER INFO (ONLY IF TICKET) */}
          {isEventTicket && (
            <div className='mt-6 space-y-3 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl'>
              <div className='flex items-center justify-center space-x-2'>
                <QrCode className='w-5 h-5 text-gray-500 dark:text-gray-300' />
                <span className='font-semibold text-gray-700 dark:text-gray-200'>
                  Ticket Holder:
                </span>
              </div>

              <p className='text-gray-900 dark:text-gray-100 text-lg'>
                {data?.user?.name ?? 'Unknown User'}
              </p>

              <p className='text-gray-500 dark:text-gray-300 text-sm'>
                {data?.user?.email ?? 'No email available'}
              </p>

              {/* VALIDATED TIME */}
              {isSuccess && data?.updated_at && (
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-4'>
                  Validated At: {new Date(data.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* TICKET DETAILS */}
          {isEventTicket && purchaseItem && (
            <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-xl space-y-2 mt-4'>
              <p className='text-gray-700 dark:text-gray-200 font-semibold'>
                Ticket Details
              </p>

              <p className='text-gray-900 dark:text-gray-100'>
                {purchaseItem.name}
              </p>

              <p className='text-gray-600 dark:text-gray-300 text-sm'>
                Tier: {purchaseItem.tier_name ?? 'General'}
              </p>

              <p className='text-gray-600 dark:text-gray-300 text-sm'>
                Price: ₦{purchaseItem.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* RETRY BUTTON */}
          {isFailed && (
            <button
              onClick={() => location.reload()}
              className='w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold'
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentStatus;
