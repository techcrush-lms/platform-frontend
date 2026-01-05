'use client';

import React, { useState, useEffect } from 'react';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatMoney } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import useSubscriptionPlansPublic from '@/hooks/page/useSubscriptionPlansPublic';
import { SubscriptionPlan } from '@/types/subscription-plan';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductType } from '@/lib/utils';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  createSubscription,
  verifySubscription,
} from '@/redux/slices/subscriptionSlice';

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
  () =>
    import('react-paystack').then((mod) => ({ default: mod.PaystackButton })),
  { ssr: false }
);
import Pagination from '@/components/Pagination';
import NotFound from '@/components/ui/NotFound';
import useProducts from '@/hooks/page/useProducts';
import ProductFilters from '@/components/dashboard/product/course/ProductFilters';
import PublicProductGridItem from '@/components/dashboard/product/course/PublicCourseGridItem';

const SubscriptionPlans = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { profile } = useSelector((state: RootState) => state.auth);

  // Check if the current organization has an active subscription
  const hasActiveSubscription =
    profile?.accessible_businesses?.find(
      (business) => business.business_id === org?.id
    )?.active_subscription?.status === 'active' || false;
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paystackRef, setPaystackRef] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('All Prices');
  const {
    products = [],
    count = 0,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    limit = 10,
    currentPage,
  } = useProducts(ProductType.SUBSCRIPTION, search, priceRange);

  // const handleRefreshWithClear = () => {
  //   // Clear the search query by calling handleSearch with empty string
  //   handleSearch('');

  //   // Remove the q parameter from the URL
  //   const params = new URLSearchParams(searchParams);
  //   params.delete('q');

  //   // Update the URL without the q parameter
  //   const newUrl = params.toString()
  //     ? `?${params.toString()}`
  //     : '/dashboard/products/subscription-plans';
  //   router.replace(newUrl);

  //   // Then refresh the data
  //   handleRefresh();
  // };

  const handlePreview = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPreviewModal(true);
  };

  const handleCheckout = async (plan: SubscriptionPlan, pricing: any) => {
    if (!profile?.email) {
      toast.error('User email is required for payment.');
      return;
    }

    setIsPaying(true);
    try {
      // Create subscription payload
      const payload = {
        email: profile.email,
        plan_price_id: pricing.id,
        payment_method: 'PAYSTACK',
        auto_renew: true,
      };

      // 1. Create subscription
      const createRes = await dispatch(createSubscription(payload)).unwrap();

      if (!createRes || !createRes.data || !createRes.data.payment_id) {
        throw new Error(createRes.message);
      }

      // 2. Get reference and set up Paystack
      const reference = createRes.data.payment_id;
      setPaystackRef(reference);

      // 3. Set selected plan and pricing for the modal
      setSelectedPlan(plan);
      setSelectedPricing(pricing);
      setShowCheckoutModal(true);
      setIsPaying(false);
    } catch (error: any) {
      toast.error(error || error.message || 'Subscription creation failed.');
      setIsPaying(false);
    }
  };

  const handlePaystackSuccess = async (response: any) => {
    try {
      // Verify subscription using Redux
      await dispatch(verifySubscription(response.reference)).unwrap();

      toast.success('Subscription purchased successfully!');
      setShowCheckoutModal(false);
      router.push('/dashboard/orders');
    } catch (error: any) {
      toast.error(error.message || 'Subscription verification failed');
    }
  };

  const handlePaystackClose = () => {
    toast.error('Payment cancelled');
  };

  const getLowestPrice = (plan: SubscriptionPlan) => {
    if (
      !plan.subscription_plan_prices ||
      plan.subscription_plan_prices.length === 0
    ) {
      return null;
    }

    return plan.subscription_plan_prices.reduce((lowest, pricing) => {
      const currentPrice = Number(pricing.price);
      const lowestPrice = Number(lowest.price);
      return currentPrice < lowestPrice ? pricing : lowest;
    });
  };

  const formatPeriod = (period: string) => {
    const periodMap: { [key: string]: string } = {
      monthly: 'month',
      yearly: 'year',
      weekly: 'week',
      daily: 'day',
    };
    return periodMap[period] || period;
  };

  const paystackConfig = {
    reference:
      paystackRef ||
      (typeof window !== 'undefined' ? new Date().getTime().toString() : ''),
    email: profile?.email || '',
    amount: selectedPricing ? Number(selectedPricing.price) * 100 : 0, // Paystack expects amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || '',
    metadata: {
      plan_id: selectedPlan?.id,
      pricing_id: selectedPricing?.id,
      plan_name: selectedPlan?.name,
      period: selectedPricing?.period,
      custom_fields: [
        {
          display_name: 'Plan ID',
          variable_name: 'plan_id',
          value: selectedPlan?.id || '',
        },
        {
          display_name: 'Pricing ID',
          variable_name: 'pricing_id',
          value: selectedPricing?.id || '',
        },
      ],
    },
  };

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <main className='min-h-screen text-gray-900 dark:text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Subscription Plans'
          brief='Browse and purchase subscription plans'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/dashboard/products'
          layer3='Subscription Plans'
        />

        <div className='flex flex-col gap-4 mt-2'>
          {/* Active Subscription Notice */}
          {hasActiveSubscription && (
            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='text-blue-600 dark:text-blue-400 w-5 h-5' />
                <div>
                  <p className='text-blue-800 dark:text-blue-200 font-medium'>
                    You have an active subscription
                  </p>
                  <p className='text-blue-600 dark:text-blue-300 text-sm'>
                    Current plan:{' '}
                    {profile?.accessible_businesses?.find(
                      (business) => business.business_id === org?.id
                    )?.active_subscription?.plan_name || 'Unknown'}{' '}
                    (
                    {profile?.accessible_businesses?.find(
                      (business) => business.business_id === org?.id
                    )?.active_subscription?.days_until_expiry || 0}{' '}
                    days remaining)
                  </p>
                </div>
              </div>
            </div>
          )}

          <ProductFilters
            search={search}
            priceRange={priceRange}
            onSearch={setSearch}
            onPriceRangeChange={setPriceRange}
          />

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse'
                >
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded'></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <NotFound
              title='No Subscription Plans Found'
              description='No subscription plans are currently available. Check back later or try searching for different plans.'
              searchPlaceholder='Search for subscription plans...'
              onSearch={handleSearchSubmit}
            />
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {products.map((product) => (
                <PublicProductGridItem
                  key={product.id}
                  id={product.id}
                  details={product}
                  type={product.type}
                  title={product.title}
                  imageSrc={product.multimedia?.url}
                  price={product.price!}
                  onView={() => {}}
                  onBuy={() => {}}
                />
              ))}
              {/* {subscription_plans.map((plan) => { */}
              {/* const lowestPrice = getLowestPrice(plan); */}

              {/* return ( */}
              {/* <div
                    key={plan.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-shadow duration-200 ${
                      ''
                      // hasActiveSubscription
                      // ? 'opacity-60 cursor-not-allowed'
                      // : 'hover:shadow-lg'
                    }
                    `}
                  > */}
              {/* Cover Image */}
              {/* {plan.cover_image && (
                      <div className='h-48 overflow-hidden'>
                        <img
                          src={plan.cover_image}
                          alt={plan.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    )} */}

              {/* <div className='p-6'> */}
              {/* Plan Name */}
              {/* <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white'>
                        {plan.name}
                      </h3> */}

              {/* Description */}
              {/* <p className='text-gray-700 dark:text-gray-200 mb-4 line-clamp-3'>
                        {plan.description || 'No description available'}
                      </p> */}

              {/* Pricing */}
              {/* <div className='mb-4'>
                        {lowestPrice ? (
                          <div className='flex items-baseline gap-2'>
                            <span className='text-xl font-bold text-primary-main'>
                              {formatMoney(
                                Number(lowestPrice.price),
                                lowestPrice.currency
                              )}
                            </span>
                            <span className='text-gray-600 dark:text-gray-400'>
                              /{formatPeriod(lowestPrice.period)}
                            </span>
                          </div>
                        ) : (
                          <span className='text-gray-600 dark:text-gray-400'>
                            Pricing not available
                          </span>
                        )}
                      </div> */}

              {/* Action Buttons */}
              {/* <div className='flex flex-row md:flex-col xl:flex-row gap-2'>
                        <Button
                          variant='outline'
                          className='flex-1'
                          onClick={() => handlePreview(plan)}
                          // disabled={hasActiveSubscription}
                        >
                          Preview
                        </Button> */}
              {/* <Button
                          variant='primary'
                          className='flex-1'
                          onClick={() => handleCheckout(plan, lowestPrice)}
                          disabled={
                            !lowestPrice ||
                            isPaying ||
                            Boolean(plan.subscriptions.length)
                          }
                        >
                          {Boolean(plan.subscriptions.length)
                            ? 'Already Subscribed'
                            : isPaying
                            ? 'Processing...'
                            : 'Subscribe Now'} */}
              {/* {plan.subscriptions.find(subscription => subscription.id === plan.) */}
              {/* //  } */}
              {/* </Button>
                      </div> */}

              {/* Disabled notice */}
              {/* {Boolean(plan.subscriptions.length) && (
                        <p className='text-xs text-gray-500 dark:text-gray-400 text-center mt-2'>
                          You already have an active subscription
                        </p>
                      )} */}
              {/* </div>
                  </div> */}
              {/* );
              })} */}
            </div>
          )}

          {error && (
            <div className='text-red-600 dark:text-red-400 text-center py-4'>
              {error}
            </div>
          )}

          {/* Pagination */}
          {!loading && count > 0 && (
            <Pagination
              total={count}
              currentPage={currentPage}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              noMoreNextPage={products.length === 0}
              paddingRequired={false}
            />
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={selectedPlan?.name || 'Plan Preview'}
        className='max-w-2xl'
      >
        {hasActiveSubscription && (
          <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4'>
            <p className='text-yellow-800 dark:text-yellow-200 text-sm'>
              You already have an active subscription. You can view plan details
              but cannot subscribe to new plans.
            </p>
          </div>
        )}
        {selectedPlan && (
          <div className='space-y-6'>
            {/* Cover Image */}
            {selectedPlan.cover_image && (
              <img
                src={selectedPlan.cover_image}
                alt={selectedPlan.name}
                className='w-full h-60 object-cover rounded-lg'
              />
            )}

            {/* Plan Details */}
            <div>
              <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white'>
                {selectedPlan.name}
              </h3>
              <p className='text-gray-700 dark:text-gray-200'>
                {selectedPlan.description || 'No description available'}
              </p>
            </div>

            {/* Pricing Options */}
            <div>
              <h4 className='font-semibold mb-3 text-gray-900 dark:text-white'>
                Pricing Options
              </h4>
              <div className='space-y-2'>
                {selectedPlan.subscription_plan_prices?.map((pricing) => (
                  <div
                    key={pricing.id}
                    className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                  >
                    <div>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {formatMoney(Number(pricing.price), pricing.currency)}
                      </span>
                      <span className='text-gray-600 dark:text-gray-400 ml-2'>
                        /{formatPeriod(pricing.period)}
                      </span>
                    </div>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => {
                        setSelectedPricing(pricing);
                        setShowPreviewModal(false);
                        handleCheckout(selectedPlan, pricing);
                      }}
                      disabled={hasActiveSubscription}
                    >
                      {hasActiveSubscription
                        ? 'Already Subscribed'
                        : 'Subscribe'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title='Subscribe to Plan'
        className='max-w-md'
      >
        {selectedPlan && selectedPricing && (
          <div className='space-y-4'>
            <div className='text-center'>
              <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
                {selectedPlan.name}
              </h3>
              <div className='text-2xl font-bold text-primary-main mb-2'>
                {formatMoney(
                  Number(selectedPricing.price),
                  selectedPricing.currency
                )}
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                per {formatPeriod(selectedPricing.period)}
              </div>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
              <p className='text-sm text-gray-700 dark:text-gray-200'>
                {selectedPlan.description || 'No description available'}
              </p>
            </div>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => setShowCheckoutModal(false)}
              >
                Cancel
              </Button>
              <PaystackButton
                {...paystackConfig}
                text='Pay Now'
                className='flex-1 bg-primary-main text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main'
                onSuccess={handlePaystackSuccess}
                onClose={handlePaystackClose}
              />
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default SubscriptionPlans;
