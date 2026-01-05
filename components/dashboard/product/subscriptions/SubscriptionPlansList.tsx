'use client';

import Pagination from '@/components/Pagination';
import TableEndRecord from '@/components/ui/TableEndRecord';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import SubscriptionPlanItem from './SubscriptionPlanItem';
import useSubscriptionPlans from '@/hooks/page/useSubscriptionPlans';
import Filter from '@/components/Filter';

const SubscriptionPlansList = () => {
  const searchParams = useSearchParams();

  const {
    subscription_plans,
    loading,
    count,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useSubscriptionPlans();

  // if (!loading) return <LoadingSkeleton />;

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      <section>
        <Filter
          searchPlaceholder='Search plans'
          showPeriod={false}
          showSearch={true}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          handleSearchSubmit={handleSearchSubmit}
        />

        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
              <tr>
                {[
                  'Plan ID',
                  'Name',
                  'Created By',
                  'Pricing Detail(s)',
                  'Role(s)',
                  'Date Created',
                  'Date Updated',
                ].map((heading) => (
                  <th key={heading} className='px-6 py-3 whitespace-nowrap'>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <LoadingSkeleton length={12} columns={7} />
            ) : (
              <tbody className='text-sm'>
                {subscription_plans.map((subscription_plan) => (
                  <SubscriptionPlanItem subscription_plan={subscription_plan} />
                ))}

                {!subscription_plans.length && (
                  <TableEndRecord colspan={8} text={noFoundText} />
                )}
              </tbody>
            )}

          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={subscription_plans.length === 0}
          />
        )}

      </section>
    </>
  );
};

export default SubscriptionPlansList;
