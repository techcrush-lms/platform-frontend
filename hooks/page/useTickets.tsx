import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchTickets } from '@/redux/slices/ticketSlice';

const useTickets = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tickets, loading, error, count } = useSelector(
    (state: RootState) => state.ticket
  );
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
  } = useQueryParams(tickets);

  useEffect(() => {
    dispatch(
      fetchTickets({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org.id }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org]);

  return {
    tickets,
    count,
    currentPage,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useTickets;
