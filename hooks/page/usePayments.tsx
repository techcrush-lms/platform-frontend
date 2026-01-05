import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchPayments } from '@/redux/slices/paymentSlice';

interface UsePaymentsProps {
  limit?: number;
}
const usePayments = ({ limit }: UsePaymentsProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    payments,
    loading,
    error,
    count,
    total_credit,
    total_debit,
    total_trx,
  } = useSelector((state: RootState) => state.payment);
  const { org } = useSelector((state: RootState) => state.org);

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
  } = useQueryParams(payments);

  useEffect(() => {
    dispatch(
      fetchPayments({
        page: currentPage,
        limit: limit ?? perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org.id }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org, limit]);

  return {
    payments,
    count,
    total_credit,
    total_debit,
    total_trx,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default usePayments;
