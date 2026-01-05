import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function StatsGrid() {
  const analytics = useSelector((state: RootState) => state.analytics);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');

  // Helper: extract revenue by currency
  const revenueData =
    analytics?.stats?.total_revenue?.details.by_currency || [];

  const selectedCurrencyData = revenueData.find(
    (c) => c.currency === selectedCurrency
  ) ||
    revenueData[0] || { total: '₦0.00', currency: 'NGN' };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
      {analytics?.loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='bg-white dark:bg-gray-800 p-4 rounded-md space-y-3 border border-neutral-3 dark:border-black-2 animate-pulse h-24'
          />
        ))
      ) : analytics?.stats ? (
        <>
          {/* 💰 Multi-Currency Total Revenue Card */}
          <div className='relative bg-white dark:bg-gray-800 p-4 rounded-md border border-neutral-3 dark:border-black-2 shadow-sm'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <Icon url='/icons/landing/download.svg' />
                <h3 className='text-gray-600 dark:text-white font-medium'>
                  Total Revenue
                </h3>
              </div>

              {/* Currency Dropdown */}
              {revenueData.length > 1 && (
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
                    {revenueData.map((item) => (
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
              )}
            </div>

            {/* Revenue Display */}
            <div className='mt-3'>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {selectedCurrencyData.net_earnings}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Across all products & subscriptions
              </p>
            </div>
          </div>

          {/* Other Cards */}
          {[
            {
              label: 'Active Subscriptions',
              value: analytics.stats.active_subscriptions.statistics.active,
              icon: <Icon url='/icons/landing/terminal.svg' />,
            },
            {
              label: 'All Clients',
              value: analytics.stats.all_clients.statistics.total,
              icon: <Icon url='/icons/landing/users.svg' />,
            },
            {
              label: 'Course Completions',
              value:
                analytics.stats.course_completions.overall_statistics
                  .total_completions,
              icon: <Icon url='/icons/landing/book-open.svg' />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 p-4 rounded-md space-y-3 border border-neutral-3 dark:border-black-2 shadow-sm'
            >
              <div className='flex gap-2 items-center'>
                {stat.icon}
                <h3 className='text-gray-600 dark:text-white font-medium'>
                  {stat.label}
                </h3>
              </div>
              <p className='text-xl font-bold'>{stat.value}</p>
            </div>
          ))}
        </>
      ) : analytics?.error ? (
        <div className='col-span-4 text-red-500 text-center mt-2'>
          {typeof analytics.error === 'string'
            ? analytics.error
            : 'Failed to load analytics.'}
        </div>
      ) : null}
    </div>
  );
}
