import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { isTutor as isTutorFunc, SystemRole } from '@/lib/utils';

export default function StatsGrid() {
  const analytics = useSelector((state: RootState) => state.analytics);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const { profile } = useSelector((state: RootState) => state.auth);

  // Helper: extract revenue by currency
  const revenueData =
    analytics?.stats?.total_revenue?.details.by_currency || [];

  const selectedCurrencyData = revenueData.find(
    (c) => c.currency === selectedCurrency,
  ) ||
    revenueData[0] || { total: '₦0.00', currency: 'NGN' };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const isTutor = isTutorFunc(profile?.role.role_id as SystemRole);

  return (
    // <div className='flex max-w-full overflow-x-auto gap-4 mt-6'>
    <div className='relative mt-6 overflow-x-auto scrollbar-hide scroll-smooth'>
      {/* Mobile swipe hint */}
      <div className='pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent sm:hidden z-10' />

      <div className='flex gap-4 min-w-full flex-nowrap snap-x snap-mandatory px-1'>
        {analytics?.loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='
            shrink-0
            w-full sm:w-1/2 md:w-1/3 lg:w-1/4
            min-h-[7rem] sm:min-h-[6rem]
            bg-white dark:bg-gray-800
            rounded-lg
            border border-neutral-3 dark:border-black-2
            animate-pulse
            snap-start
          '
            />
          ))
        ) : analytics?.stats ? (
          <>
            {/* 💰 Total Revenue Card */}
            {[
              SystemRole.BUSINESS_SUPER_ADMIN,
              SystemRole.BUSINESS_ADMIN,
            ].includes(profile?.role.role_id as SystemRole) && (
              <div
                className='
              relative
              shrink-0
              w-full sm:w-1/2 md:w-1/3 lg:w-1/4
              min-h-[7rem] sm:min-h-[6rem]
              bg-white dark:bg-gray-800
              p-5 sm:p-4
              rounded-lg
              border border-neutral-3 dark:border-black-2
              shadow-sm
              snap-start
            '
              >
                <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
                  <div className='flex items-center gap-2'>
                    <Icon url='/icons/landing/download.svg' />
                    <h3 className='text-sm sm:text-base text-gray-600 dark:text-white font-medium'>
                      Total Revenue
                    </h3>
                  </div>

                  {revenueData.length > 1 && (
                    <select
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className='
                    w-full sm:w-auto
                    appearance-none
                    text-sm font-medium
                    bg-gray-100 dark:bg-gray-700
                    text-gray-700 dark:text-gray-200
                    border border-gray-200 dark:border-gray-600
                    rounded-md
                    px-3 py-2 sm:py-1.5
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  '
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      {revenueData.map((item) => (
                        <option key={item.currency} value={item.currency}>
                          {item.currency}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className='mt-4'>
                  <p className='text-2xl sm:text-xl font-bold text-gray-900 dark:text-white'>
                    {selectedCurrencyData.net_earnings}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Across all courses
                  </p>
                </div>
              </div>
            )}

            {/* 📊 Stat Cards */}
            {[
              {
                label: 'Total Enrollments',
                value: analytics.stats.enrollments,
                icon: <Icon url='/icons/landing/terminal.svg' />,
              },
              {
                label: 'All Students',
                value: analytics.stats.all_clients.statistics.total,
                icon: <Icon url='/icons/landing/users.svg' />,
              },
              {
                label: 'Total Assessments',
                value: analytics.stats.total_assessments,
                icon: <Icon url='/icons/landing/users.svg' />,
              },
              {
                label: 'Course Completions',
                value:
                  analytics.stats.course_completions.overall_statistics
                    .total_completions,
                icon: <Icon url='/icons/landing/book-open.svg' />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className='
              shrink-0
              w-full sm:w-1/2 md:w-1/3 lg:w-1/4
              min-h-[7rem] sm:min-h-[6rem]
              bg-white dark:bg-gray-800
              p-5 sm:p-4
              rounded-lg
              border border-neutral-3 dark:border-black-2
              shadow-sm
              snap-start
            '
              >
                <div className='flex items-center gap-2'>
                  {stat.icon}
                  <h3 className='text-sm sm:text-base text-gray-600 dark:text-white font-medium'>
                    {stat.label}
                  </h3>
                </div>
                <p className='mt-3 text-2xl sm:text-xl font-bold'>
                  {stat.value}
                </p>
              </div>
            ))}
          </>
        ) : analytics?.error ? (
          <div className='w-full text-center text-red-500 mt-4'>
            {typeof analytics.error === 'string'
              ? analytics.error
              : 'Failed to load analytics.'}
          </div>
        ) : null}
      </div>
    </div>
  );
}
