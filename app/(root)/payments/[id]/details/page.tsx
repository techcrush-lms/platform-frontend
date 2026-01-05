'use client';

import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import {
  cn,
  formatMoney,
  getAvatar,
  maskSensitiveData,
  PaymentStatus,
  PurchaseItemType,
  shortenId,
} from '@/lib/utils';
import React, { useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { IoIosChatboxes } from 'react-icons/io';
import Chat from '@/components/dashboard/chat/Chat';
import usePayment from '@/hooks/page/usePayment';
import XIcon from '@/components/ui/icons/XIcon';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import ShimmerCard from '@/components/ShimmerCard';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { sendPurchaseQr } from '@/redux/slices/paymentSlice';

const ViewPayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);

  const { payment, loading } = usePayment();
  const [chatOpen, setChatOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const maskedEmail = (email: string) => {
    const [username, domain] = email.split('@')!;
    const maskedEmail = `${maskSensitiveData(username)}@${domain}`;
    return maskedEmail;
  };

  const handleSendPurchaseQr = async (tier_id: string) => {
    try {
      setIsSubmitting(true);

      const response = await dispatch(
        sendPurchaseQr({
          id: payment?.id!,
          tier_id,
          business_id: org?.id!,
        })
      ).unwrap();

      toast.success(response.message);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container space-y-2'>
        <PageHeading
          title='Payment Details'
          enableBreadCrumb={true}
          layer2='Payments'
          layer3='Details'
          layer2Link='/payments'
          enableBackButton={true}
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Button
                variant='primary'
                className='text-md bg-primary gap-1 py-2 rounded-lg flex items-center px-3'
                onClick={() => setChatOpen(!chatOpen)}
              >
                <IoIosChatboxes className='text-lg' />
                {chatOpen ? 'Close Chat' : 'Chat'}
              </Button>
            </div>
          }
        />

        {!payment ? (
          <ShimmerCard />
        ) : (
          <ThemeDivBorder className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Transaction Info
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300'>
              <div>
                <strong>ID:</strong> {shortenId(payment?.id!)}
              </div>
              <div>
                <strong>Status:</strong>{' '}
                <span
                  className={cn(
                    'p-1 rounded text-xs font-medium',
                    payment?.payment_status === PaymentStatus.SUCCESS
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  )}
                >
                  {payment?.payment_status}
                </span>
              </div>

              <div>
                <strong>Date:</strong>{' '}
                {moment(payment?.created_at).format('LLL')}
              </div>
              <div>
                <strong>Type:</strong> {payment?.purchase_type}
              </div>
              <div>
                <strong>Method:</strong> {payment?.payment_method}
              </div>
              <div>
                <strong>Auto Renew:</strong>{' '}
                {payment?.auto_renew ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Amount Paid:</strong>{' '}
                {formatMoney(+payment?.amount!, payment?.currency)}
              </div>
              <div>
                <strong>Amount Earned:</strong>{' '}
                {formatMoney(+payment?.final_amount!, payment?.currency)}
              </div>
            </div>

            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              User Info
            </h2>
            <div>
              {(payment?.user?.profile?.profile_picture! ||
                payment?.user.name) && (
                <Link href={`/customers/${payment?.user_id}`}>
                  <img
                    src={getAvatar(
                      payment.user?.profile?.profile_picture!,
                      payment.user?.name!
                    )}
                    alt={payment.user.name}
                    className='w-20 h-20 rounded-full object-cover'
                  />
                </Link>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300'>
              <div>
                <strong>Name:</strong> {payment?.user?.name}
              </div>
              <div>
                <strong>Email:</strong> {payment?.user.email!}
              </div>
              <div>
                <strong>Phone:</strong> {payment?.user?.phone || 'N/A'}
              </div>
              <div>
                <strong>Country:</strong> {payment?.user?.profile?.country}
              </div>
            </div>

            {payment.subscription_plan && (
              <>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Subscription Plan
                </h2>
                <div className='text-gray-700 dark:text-gray-300'>
                  <p>
                    <strong>Plan:</strong> {payment?.subscription_plan?.name}
                  </p>
                </div>
              </>
            )}

            {payment.purchase && (
              <>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Products
                </h2>
                {payment.purchase.items.map((item, index) => (
                  <div
                    key={index}
                    className='text-gray-700 dark:text-gray-300 space-y-4 pl-4 border-l-4 border-primary-main'
                  >
                    <p>
                      <strong>Name:</strong>{' '}
                      <Link
                        href={`/products/${item.purchase_type.toLowerCase()}s/${
                          item.product_id
                        }/edit`}
                        className='hover:underline'
                      >
                        {item.name}
                      </Link>{' '}
                      x {item.quantity}
                    </p>
                    <p>
                      <strong>Price:</strong>{' '}
                      {formatMoney(item.price, payment.currency)}
                    </p>
                    {item.purchase_type === PurchaseItemType.TICKET && (
                      <Button
                        variant='primary'
                        onClick={() => handleSendPurchaseQr(item.id)}
                      >
                        Send QR Email
                      </Button>
                    )}
                  </div>
                ))}
              </>
            )}
          </ThemeDivBorder>
        )}
      </div>

      {payment && chatOpen && (
        <div className='fixed bottom-4 right-4 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-10'>
          <>
            <Chat
              chatbuddyId={payment?.user?.id!}
              height='h-[50vh] max-h-[40vh] md:max-h-[30vh] lg:max-h-[38vh]'
              enabledBackButton={false}
              rightSideComponent={
                <button onClick={() => setChatOpen(false)}>
                  <XIcon />
                </button>
              }
            />
          </>
        </div>
      )}
    </main>
  );
};

export default ViewPayment;
