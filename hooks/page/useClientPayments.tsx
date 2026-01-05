import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchClientPayments } from '@/redux/slices/paymentSlice';

const useClientPayments = () => {
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
      fetchClientPayments({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate]);

  return {
    q,
    startDate,
    endDate,
    payments,
    count,
    currentPage,
    perPage,
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

export default useClientPayments;
