import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchPublicSubscriptionPlans,
  fetchSubscriptionPlansByBusiness,
} from '@/redux/slices/subscriptionPlanSlice';
import { useSearchParams } from 'next/navigation';
import useQueryParams from '../useQueryParams';

interface UseSubscriptionPlansPublicProps {
  business_id: string;
  page?: number;
  limit?: number;
  useViewEndpoint?: boolean;
}

const useSubscriptionPlansPublic = ({
  business_id,
  page = 1,
  limit = 10,
  useViewEndpoint = false,
}: UseSubscriptionPlansPublicProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const { subscription_plans, count, loading, error } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh: queryParamsRefresh,
  } = useQueryParams(subscription_plans);

  const [searchQuery, setSearchQuery] = useState(q || '');
  const [filteredPlans, setFilteredPlans] = useState(subscription_plans);

  // Filter plans when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = subscription_plans.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plan.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans(subscription_plans);
    }
  }, [subscription_plans, searchQuery]);

  useEffect(() => {
    if (business_id) {
      if (useViewEndpoint) {
        dispatch(
          fetchSubscriptionPlansByBusiness({
            business_id,
            page: currentPage,
            limit,
            q: searchQuery,
          })
        );
      } else {
        dispatch(
          fetchPublicSubscriptionPlans({
            business_id,
            page: currentPage,
            limit,
            q: searchQuery,
          })
        );
      }
    }
  }, [dispatch, business_id, currentPage, limit, searchQuery, useViewEndpoint]);

  const handlePageChange = (newPage: number) => {
    // This would need to be implemented if you want to change pages
    // For now, we'll just log it
    // console.log('Page change requested:', newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset to first page when searching
    // Note: This would need proper pagination implementation
  };

  const handleRefresh = () => {
    if (business_id) {
      if (useViewEndpoint) {
        dispatch(
          fetchSubscriptionPlansByBusiness({
            business_id,
            page: currentPage,
            limit,
            q: searchQuery,
          })
        );
      } else {
        dispatch(
          fetchPublicSubscriptionPlans({
            business_id,
            page: currentPage,
            limit,
            q: searchQuery,
          })
        );
      }
    }
  };

  return {
    subscription_plans: filteredPlans, // Return filtered plans instead of all plans
    count, // Return filtered count
    loading,
    error,
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
    handleRefresh,
    // Also return the original unfiltered data if needed
    allSubscriptionPlans: subscription_plans,
    totalCount: count,
    // Add pagination methods
    onClickNext,
    onClickPrev,
  };
};

export default useSubscriptionPlansPublic;
