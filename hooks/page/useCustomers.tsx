import { fetchCustomers } from '@/redux/slices/orgSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { useParams } from 'next/navigation';
import { SystemRole } from '@/lib/utils';

interface UseCustomersProps {
  role?: SystemRole;
  limit?: number;
}
const useCustomers = ({
  role = SystemRole.USER,
  limit = 10,
}: UseCustomersProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  let {
    customers,
    page_customers,
    customersLoading,
    totalCustomers,
    org,
    customersCurrentPage,
  } = useSelector((state: RootState) => state.org);

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
    handleRefresh,
  } = useQueryParams(customers, limit);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(role && { role }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org?.id as string }),
      })
    );
  }, [dispatch, currentPage, perPage, q, role, startDate, endDate, org]);

  return {
    customers,
    page_customers,
    customersLoading,
    count: totalCustomers,
    currentPage: customersCurrentPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    limit,
  };
};

export default useCustomers;
