'use client';

import '@/app/globals.css';
import React, { useEffect, useState } from 'react';
import useCart from '@/hooks/page/useCart';
import {
  formatMoney,
  ProductType,
  isBrowser,
  safeRouterPush,
  reformatText,
  PaymentMethod,
} from '@/lib/utils';
import PageHeading from '@/components/PageHeading';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { emptyCart, fetchCart, removeCartItem } from '@/redux/slices/cartSlice';
import { Modal } from '@/components/ui/Modal';
import {
  cancelPayment,
  createPayment,
  verifyPayment,
} from '@/redux/slices/paymentSlice';
import {
  CreatePaymentPayload,
  PaymentPurchase,
} from '@/lib/schema/payment.schema';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  ShoppingBag,
  CheckCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { capitalize } from 'lodash';
import { applyCoupon, clearCouponData } from '@/redux/slices/couponSlice';

// import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
// Defer importing react-paystack at runtime to avoid SSR window access during static export
import { PaystackPaymentResponse } from '@/types/payment';

function DashboardCart() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { coupon_info } = useSelector((state: RootState) => state.coupon);
  const { cart, loading, error, totals } = useCart();
  const { currency } = useSelector((state: RootState) => state.currency);

  const items = cart?.items || [];
  // Helper to get the actual price for a cart item
  const getItemPrice = (item: (typeof items)[number]) => {
    if (item.product_type === ProductType.TICKET) {
      return Number(item.ticket_tier?.amount || 0);
    } else if (item.product_type === ProductType.COURSE) {
      return Number(item.course?.price || 0);
    } else if (item.product_type === ProductType.DIGITAL_PRODUCT) {
      return Number(item.digital_product?.price || 0);
    } else if (item.product_type === ProductType.SUBSCRIPTION) {
      return Number(item.subscription_plan_price?.price || 0);
    }
    return 0;
  };

  const { profile } = useSelector((state: RootState) => state.auth);
  const { org } = useSelector((state: RootState) => state.org);

  // Replace with the logged-in user's email in production
  const userEmail = profile?.email || '';

  const [isPaying, setIsPaying] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const [coupon, setCoupon] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleCheckout = async () => {
    if (!userEmail) {
      toast.error('User email is required for payment.');
      return;
    }
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsPaying(true);
    try {
      // Build purchases array
      const purchases: PaymentPurchase[] = items.map((item) => ({
        purchase_id:
          item.product_type === ProductType.TICKET
            ? item.ticket_tier_id!
            : item.product_type === ProductType.SUBSCRIPTION
            ? item.subscription_plan_price_id!
            : item.product_id,
        quantity: item.quantity,
        purchase_type: item.product_type as ProductType,
      }));
      // Assume all items have the same currency and business_id
      const firstItem = items[0];

      const business_id = org?.id;

      if (!business_id) {
        throw new Error('Business ID is required for payment.');
      }

      const amountToPay = coupon_info?.discountedAmount
        ? coupon_info?.discountedAmount
        : totals.subtotal;

      const payload: CreatePaymentPayload = {
        email: userEmail,
        purchases,
        amount: amountToPay,
        currency,
        business_id,
        ...(coupon && { coupon_code: coupon }),
        payment_method: PaymentMethod.PAYSTACK,
      };

      // 1. Create payment
      const createRes = await dispatch(createPayment(payload)).unwrap();

      if (!createRes || !createRes.data || !createRes.data.payment_id) {
        throw new Error('Payment creation failed.');
      }

      const reference = createRes.data.payment_id;

      console.log(amountToPay);
      console.log(currency);

      const config = {
        reference: reference,
        email: userEmail,
        amount: amountToPay * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        currency: currency,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || '',
        // metadata: {
        //   email: userEmail,
        //   amount: amountToPay,
        //   currency: currency,
        //   reference: reference,
        // },
      };

      const { usePaystackPayment } = await import('react-paystack');
      const initializePayment = usePaystackPayment(config);

      // you can call this function anything
      const onSuccess = async (response: PaystackPaymentResponse) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log(reference);
        try {
          // Verify payment using Redux
          await dispatch(verifyPayment(response.reference)).unwrap();

          // Empty cart after successful payment
          dispatch(emptyCart());

          // Clear coupon data
          dispatch(clearCouponData());

          // closePaymentModal(); // this will close the modal programmatically

          // Show success message
          toast.success('Payment successful! Your order has been placed.');

          // Redirect to orders page
          safeRouterPush(router, '/dashboard/orders');
        } catch (error: any) {
          toast.error(error.message || 'Payment verification failed');
        } finally {
          setIsPaying(false);
        }
      };

      // you can call this function anything
      const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        toast('Payment window closed');
        console.log('closed');
        setIsPaying(false);
      };
      initializePayment({ onSuccess, onClose: onClose()! as any });
    } catch (error: any) {
      toast.error(error.message || 'Payment failed.');
      setIsPaying(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) {
      toast.error('Enter a coupon code');
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const res = await dispatch(
        applyCoupon({
          email: profile?.email!,
          code: coupon,
          amount: String(totals.subtotal),
        })
      ).unwrap();

      toast.success('Coupon applied');
    } catch (err: any) {
      console.log(err);

      const message = err || err?.message;

      toast.error(message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <main className='min-h-screen dark:bg-black text-gray-900 dark:text-white'>
      <div className='section-container py-8'>
        <PageHeading
          title='Your Cart'
          brief='Buy your products with ease'
          enableBreadCrumb={true}
          layer2='Cart'
          layer2Link='/dashboard/cart'
        />

        <div className='mt-3'>
          {loading ? (
            <div className='text-center py-12'>Loading cart...</div>
          ) : error ? (
            <div className='text-center py-12 text-red-500'>{error}</div>
          ) : items.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-4'>
              <div className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6'>
                <ShoppingCart className='w-12 h-12 text-gray-400 dark:text-gray-500' />
              </div>

              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Your cart is empty
              </h3>

              <p className='text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md'>
                Looks like you haven't added any items to your cart yet. Start
                shopping to discover amazing products!
              </p>

              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={() => router.push('/dashboard/products')}
                  className='inline-flex items-center justify-center px-6 py-3 bg-primary-main text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2'
                >
                  <ShoppingBag className='w-5 h-5 mr-2' />
                  Browse Products
                </button>
              </div>

              <div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
                <p className='inline-flex items-center'>
                  <HelpCircle className='w-4 h-4 mr-1' />
                  Need help?{' '}
                  <a
                    href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact`}
                    className='text-primary-main hover:underline ml-1'
                  >
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-8'>
              {/* Cart Items */}
              <div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
                <table className='min-w-[600px] w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Product
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Price
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Quantity
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Total
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {items.map((item) => {
                      const details =
                        item.product_type === ProductType.TICKET
                          ? {
                              image:
                                item.ticket_tier?.ticket?.product?.multimedia
                                  ?.url,
                              name: `${item.ticket_tier?.ticket.product.title}<br/> (${item.ticket_tier?.name} Ticket)`,
                            }
                          : item.product_type === ProductType.SUBSCRIPTION
                          ? {
                              image:
                                item.subscription_plan_price?.subscription_plan
                                  .product.multimedia.url,
                              name: `${
                                item.subscription_plan_price?.subscription_plan
                                  .name
                              } (${capitalize(
                                reformatText(
                                  item?.subscription_plan_price?.period!,
                                  '_'
                                )
                              )})`,
                            }
                          : item.product_type === ProductType.DIGITAL_PRODUCT
                          ? {
                              image: item.digital_product?.multimedia?.url,
                              name: item.digital_product?.title,
                            }
                          : {
                              image: item.course?.multimedia?.url,
                              name: item.course?.title,
                            };

                      return (
                        <tr key={item.id}>
                          <td className='px-4 py-3'>
                            <Link
                              href={`/dashboard/products/${item.product_id}`}
                              className='flex items-center gap-3'
                            >
                              <img
                                src={details.image}
                                alt={`${item.product_type} image`}
                                className='w-14 h-14 object-cover rounded border border-gray-200 dark:border-gray-700 flex-shrink-0'
                              />
                              <span
                                className='font-medium flex-1 overflow-hidden whitespace-nowrap text-ellipsis'
                                dangerouslySetInnerHTML={{
                                  __html: details?.name!,
                                }}
                              />
                            </Link>
                          </td>
                          <td className='px-4 py-3'>
                            {formatMoney(getItemPrice(item), currency)}
                          </td>
                          <td className='px-4 py-3'>{item.quantity}</td>
                          <td className='px-4 py-3 font-semibold'>
                            {formatMoney(
                              getItemPrice(item) * item.quantity,
                              currency
                            )}
                          </td>
                          <td className='px-4 py-3'>
                            <button
                              className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50'
                              disabled={loading}
                              onClick={() => setConfirmRemoveId(item.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Payment Summary  */}
              <div className='flex flex-col sm:flex-row justify-end'>
                <div className='w-full sm:w-80 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
                  {/* Coupon */}
                  <div className='flex gap-2 mb-4'>
                    <input
                      type='text'
                      placeholder='Enter coupon code'
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className='flex-1 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-main dark:bg-gray-900 dark:border-gray-600'
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loading || !coupon}
                      className='px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50'
                    >
                      Apply
                    </button>
                  </div>

                  {/* Breakdown */}
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-300'>
                        Items ({totals.itemCount})
                      </span>
                      <span className='font-medium'>
                        {/* {formatMoney(totalSum)} */}
                        {coupon_info.discount
                          ? `${formatMoney(totals.subtotal)} → ${formatMoney(
                              coupon_info?.discountedAmount,
                              currency
                            )}`
                          : formatMoney(totals.subtotal, currency)}
                      </span>
                    </div>

                    {/* {coupon_info.discount > 0 && (
                      <div className='flex justify-between text-green-600 dark:text-green-400'>
                        <span>Coupon Discount</span>
                        <span>-{formatMoney(coupon_info.discount)}</span>
                      </div>
                    )} */}

                    <div className='flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-3 mt-2'>
                      <span>Total</span>
                      <span>
                        {coupon_info.discount
                          ? formatMoney(coupon_info?.discountedAmount, currency)
                          : formatMoney(totals.subtotal, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <button
                    className='mt-6 w-full bg-primary-main text-white font-bold py-3 px-6 rounded hover:bg-blue-800 transition disabled:opacity-60'
                    onClick={handleCheckout}
                    disabled={isPaying || loading}
                  >
                    {isPaying ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmRemoveId}
        onClose={() => setConfirmRemoveId(null)}
        title='Remove Item'
        className='text-gray-800 dark:text-gray-200'
      >
        {/* Close Button */}
        <button
          onClick={() => setConfirmRemoveId(null)}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
        >
          <X className='w-5 h-5' />
        </button>
        <div className='py-4'>
          <p>Are you sure you want to remove this item from your cart?</p>
          <div className='flex gap-4 mt-6 justify-end'>
            <button
              className='px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition'
              onClick={() => setConfirmRemoveId(null)}
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition'
              onClick={async () => {
                if (confirmRemoveId) {
                  await dispatch(removeCartItem(confirmRemoveId));
                  await dispatch(fetchCart({ currency }));
                  toast.success('Item removed from cart');
                  setConfirmRemoveId(null);
                }
              }}
              disabled={loading}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

export default DashboardCart;
