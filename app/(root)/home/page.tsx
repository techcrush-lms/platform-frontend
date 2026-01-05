'use client';

import { ClientRequestsTable } from '@/components/dashboard/ClientRequestsTable';
import { LineChart } from '@/components/dashboard/LineChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import {
  areAllOnboardingStepsPresent,
  PurchaseItemType,
  SystemRole,
} from '@/lib/utils';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OnboardingModal from '@/components/dashboard/OnboardingModal';
import SelectOrgModal from '@/components/dashboard/SelectOrgModal';
import { useRouter } from 'next/navigation';
import {
  getStats,
  getMonthlyProductRevenue,
} from '@/redux/slices/analyticsSlice';
import { AppDispatch } from '@/redux/store';
import { ErrorResponse } from '@/types';
import { OnboardingSteps } from '@/components/OnboardingSteps';
import StatsGrid from '@/components/dashboard/StatsGrid';
import { MonthlyRevenueData, MonthlyRevenueResponse } from '@/types/analytics';
import usePayments from '@/hooks/page/usePayments';

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.auth);
  const { orgs, org } = useSelector((state: RootState) => state.org);
  const analytics = useSelector((state: RootState) => state.analytics);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const { payments, loading } = usePayments({ limit: 4 });

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const navigateToBusinessPage = () => {
    router.push('/settings?tab=business-account');
  };

  useEffect(() => {
    // Show org selection modal if no org is selected
    if (!org && orgs.length > 0) {
      setShowOrgModal(true);
    }
  }, [org, orgs]);

  useEffect(() => {
    if (org?.id) {
      dispatch(getStats({ business_id: org.id }));
      dispatch(getMonthlyProductRevenue({ business_id: org.id }));
    }
  }, [dispatch, org]);

  useEffect(() => {
    // Redirect based on role
    if (profile?.role?.role_id === SystemRole.USER) {
      router.replace('/dashboard/home');
    } else if (
      profile?.role?.role_id === SystemRole.BUSINESS_ADMIN ||
      profile?.role?.role_id === SystemRole.BUSINESS_SUPER_ADMIN
    ) {
      router.replace('/home');
    }
    // Show org selection modal if no org is selected
    if (!org && orgs.length > 0) {
      setShowOrgModal(true);
    }
  }, [profile?.role?.role_id, org, orgs, router]);

  // Early returns after all hooks are called
  if (!org && orgs.length > 0) {
    return <SelectOrgModal isOpen={true} organizations={orgs} />;
  }

  // If no orgs exist at all, show a message to create one
  if (!org && orgs.length === 0) {
    return router.push('/settings?tab=business-account');
    // return (
    //   <div className='section-container flex items-center justify-center min-h-screen'>
    //     <div className='text-center'>
    //       <h2 className='text-2xl font-semibold mb-4 dark:text-gray-400'>
    //         No Business Account found
    //       </h2>
    //       <p className='text-gray-600 dark:text-gray-300 mb-6'>
    //         You need to create a business account before proceeding.
    //       </p>
    //       <Button variant='primary' onClick={navigateToBusinessPage}>
    //         Create a business account
    //       </Button>
    //     </div>
    //   </div>
    // );
  }

  type ChartDataType = {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };

  const generateChartData = (
    analytics?: MonthlyRevenueData,
    selectedCurrency?: string
  ): ChartDataType => {
    // define consistent color palette
    const colorMap = {
      course: '#22d3ee',
      ticket: '#f472b6',
      subscription: '#65a30d',
      digital: '#d97706',
      physical: '#06b6d4',
    };

    // find the matching currency block or use the first available one
    const currencyData =
      analytics?.currencies.find((c) => c.currency === selectedCurrency) ||
      analytics?.currencies?.[0];

    // if there's no data at all, use defaults
    if (!currencyData) {
      const fallbackLabels = ['Jan', 'Feb', 'Mar', 'Apr'];
      const fallbackData = [0, 0, 0, 0];

      return {
        labels: fallbackLabels,
        datasets: Object.entries(colorMap).map(([key, color]) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '), // e.g. 'Course', 'Ticket'
          data: fallbackData,
          borderColor: color,
          backgroundColor: color,
        })),
      };
    }

    // construct dynamic chart data
    const labels = currencyData.months.map((m) => m.month);

    const datasets = (Object.keys(colorMap) as (keyof typeof colorMap)[]).map(
      (key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '), // e.g. "Digital"
        data: currencyData.months.map((m: any) =>
          Number((m[key] as any)?.amount || 0)
        ),
        borderColor: colorMap[key],
        backgroundColor: colorMap[key],
      })
    );

    return { labels, datasets };
  };

  // ✅ usage
  const chartData = generateChartData(
    analytics?.monthlyRevenue!,
    selectedCurrency
  );

  const recentActivities = [
    {
      id: 1,
      title: 'Subscription renewal processed for Jane Smith',
      time: '2 hours ago',
      icon: '🔄',
      type: PurchaseItemType.SUBSCRIPTION,
    },
    {
      id: 2,
      title: "Event 'Business Leadership' reached 50 registrations",
      time: '3 hours ago',
      icon: '🎯',
      type: PurchaseItemType.TICKET,
    },
    {
      id: 3,
      title: 'Subscription expired for John Suit',
      time: 'Yesterday',
      icon: '⚠️',
      type: PurchaseItemType.SUBSCRIPTION,
    },
    {
      id: 4,
      title: "Course 'Digital Marketing Essentials' received 5-star rating",
      time: '4:30 PM - 5:30 PM',
      icon: '⭐',
      type: PurchaseItemType.COURSE,
    },
  ];

  const clientRequests = [
    {
      id: '0001',
      name: 'Chinedu Okafor',
      date: '13 Mar 2025',
      content: 'Event',
      status: 'Completed',
    },
    // Add more requests as needed
  ];

  const performanceHtml = analytics && (
    <>
      {analytics?.monthlyRevenueLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <span className='text-gray-400'>Loading chart...</span>
        </div>
      ) : analytics?.monthlyRevenueError ? (
        <div className='h-64 flex items-center justify-center text-red-500'>
          {analytics?.monthlyRevenueError?.message}
        </div>
      ) : (
        <LineChart data={chartData} />
      )}
    </>
  );

  return (
    <main className='section-container'>
      <div className='h-full'>
        {/* Main Content */}
        <div className='flex-1 text-black-1 dark:text-white'>
          {/* Profile Completion Banner */}
          {profile?.role?.role_id === SystemRole.BUSINESS_SUPER_ADMIN &&
            !areAllOnboardingStepsPresent(
              OnboardingSteps,
              org?.onboarding_status.onboard_processes!
            ) && (
              <>
                <div className='mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                  <div className='flex flex-col md:flex-row gap-2 items-center justify-between'>
                    <div className='flex items-center w-full gap-3'>
                      <div className='flex-shrink-0'>
                        {/* Alert Icon */}
                        <svg
                          className='h-5 w-5 text-red-400'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
                          Complete Your Profile
                        </h3>
                        <p className='mt-1 text-sm text-red-700 dark:text-red-300'>
                          Please complete your business profile to access all
                          features.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='primary'
                      onClick={() => setShowProfileModal(true)}
                      className='bg-red-600 hover:bg-red-700 text-white ml-auto'
                    >
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </>
            )}

          {/* Onboarding Modal */}
          {profile?.role?.role_id === SystemRole.BUSINESS_SUPER_ADMIN && (
            <OnboardingModal
              isOpen={showProfileModal}
              setIsOpen={setShowProfileModal}
            />
          )}

          <header className='flex flex-col md:flex-row justify-between md:items-center'>
            <h2 className='text-2xl font-semibold'>
              Hello, {profile?.name} 👋🏼
            </h2>
            <div className='flex gap-2'>
              <Button
                variant='primary'
                size='icon'
                className='hover:bg-primary-800'
                onClick={() => router.push('/campaigns/email/instant')}
              >
                <Icon url='/icons/landing/plus.svg' />
              </Button>
              <Button
                variant={'outline'}
                className='text-lg border-primary-main text-primary-main py-1 dark:text-white hover:bg-primary-800 hover:text-white'
                onClick={() => router.push('/campaigns/email/scheduled')}
              >
                Schedule Message
              </Button>
            </div>
          </header>

          {/* Stats */}
          {/* <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
            {analytics?.loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-gray-800 p-4 rounded-md space-y-3 border border-neutral-3 dark:border-black-2 animate-pulse h-24'
                  ></div>
                ))
              : analytics?.stats &&
                [
                  {
                    label: 'Total Revenue',
                    value: analytics.stats.total_revenue.total,
                    abbr: 'total-revenue',
                    change: '',
                    icon: <Icon url='/icons/landing/download.svg' />,
                  },
                  {
                    label: 'Active Subscriptions',
                    value:
                      analytics.stats.active_subscriptions.statistics.active,
                    abbr: 'active-subscriptions',
                    change: '',
                    icon: <Icon url='/icons/landing/terminal.svg' />,
                  },
                  {
                    label: 'All Clients',
                    value: analytics.stats.all_clients.statistics.total,
                    abbr: 'all-clients',
                    change: '',
                    icon: <Icon url='/icons/landing/users.svg' />,
                  },
                  {
                    label: 'Course Completions',
                    value:
                      analytics.stats.course_completions.overall_statistics
                        .total_completions,
                    abbr: 'course-completions',
                    change: '',
                    icon: <Icon url='/icons/landing/book-open.svg' />,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-gray-800 p-4 rounded-md space-y-3 border border-neutral-3 dark:border-black-2'
                  >
                    <div className='flex gap-1'>
                      {stat.icon}
                      <h3 className='text-gray-600 dark:text-white'>
                        {stat.label}
                      </h3>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <p className='text-xl font-bold'>{stat.value}</p>
                      <span
                        className={
                          stat.change.includes('-')
                            ? 'text-red-500'
                            : 'text-green-500'
                        }
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
            {analytics?.error && (
              <div className='col-span-4 text-red-500 text-center mt-2'>
                {typeof analytics.error === 'string'
                  ? analytics.error
                  : 'Failed to load analytics.'}
              </div>
            )}
          </div> */}
          <StatsGrid />

          <div className='py-6 space-y-6'>
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
              <div className='col-span-1 xl:col-span-2 bg-white border border-gray-200 dark:bg-gray-800 dark:border-0 p-4 rounded-md'>
                <div className='flex justify-between items-center'>
                  <h3 className='font-semibold'>Performance</h3>
                  <div className='flex items-center'>
                    <select
                      id='currency-select'
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className='appearance-none text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      {analytics.monthlyRevenue?.currencies.map((item) => (
                        <option
                          key={item.currency}
                          value={item.currency}
                          className='text-gray-700 dark:text-gray-200'
                        >
                          {item.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {performanceHtml}
              </div>
              <div className='bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-0'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-semibold '>Recent Transactions</h3>
                  <Link href={'/payments'}>View all</Link>
                </div>
                <RecentTransactions payments={payments} />
              </div>
            </div>

            <div className='hidden grid-cols-1  gap-6'>
              {/* Client Requests */}
              <div className='lg:col-span-2'>
                <div className='flex justify-between items-center mb-3'>
                  <h2 className='text-lg font-semibold'>Client Requests</h2>
                  <Link href='' className='text-primary-main dark:text-white'>
                    View All
                  </Link>
                </div>
                <ClientRequestsTable requests={clientRequests} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
