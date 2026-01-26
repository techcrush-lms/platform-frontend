import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { useParams } from 'next/navigation';

import { PaginationProps } from '@/types';
import { BusinessProps } from '@/types/org';
import { fetchCohorts } from '@/redux/slices/cohortSlice';

interface UseCohortsProps {
  limit?: number;
}

const useCohorts = ({ limit = 10 }: UseCohortsProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { profile } = useSelector((state: RootState) => state.auth);
  const { cohorts, loading, currentPage, count, error } = useSelector(
    (state: RootState) => state.cohort,
  );

  const {
    q,
    startDate,
    endDate,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    onClickNext,
    onClickPrev,
  } = useQueryParams(cohorts, limit);

  const fetchData = useCallback(async () => {
    await dispatch(
      fetchCohorts({
        limit,
        ...(currentPage && { page: currentPage }),
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org?.id as string }),
      } as PaginationProps & BusinessProps),
    ).unwrap();
  }, [dispatch, limit, q, startDate, endDate, org?.id, profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    limit,
    cohorts,
    loading,
    currentPage,
    q,
    startDate,
    endDate,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    count,
    onClickNext,
    onClickPrev,
    error,
  };
};

export default useCohorts;
