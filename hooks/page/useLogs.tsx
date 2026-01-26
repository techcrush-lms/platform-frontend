import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogs } from '@/redux/slices/logSlice';
import { AppDispatch, RootState } from '@/redux/store';

const useLogs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams(searchParams.toString());

  // Get page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('limit')) || 10;
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') || '',
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  let { logs, loading, count } = useSelector((state: RootState) => state.log);

  useEffect(() => {
    dispatch(
      fetchLogs({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    );
  }, [dispatch, currentPage, perPage, q, startDate, endDate]);

  // Pagination functions
  const onClickNext = async () => {
    if (logs.length > 0) {
      queryParams.set('page', encodeURIComponent(currentPage + 1));
      router.push(`?${queryParams}`);
    }
  };

  const onClickPrev = async () => {
    if (currentPage - 1 > 0) {
      queryParams.set('page', encodeURIComponent(currentPage - 1));
      router.push(`?${queryParams}`);
    }
  };

  // Search submission
  const handleSearchSubmit = (input: string) => {
    setQ(input);
    if (input.trim()) {
      queryParams.set('q', encodeURIComponent(input));
    } else {
      queryParams.delete('q'); // Remove 'q' if input is empty
    }
    router.push(`?${queryParams.toString()}`);
  };

  // Filter by date submission
  const handleFilterByDateSubmit = (
    startDate: string,
    endDate: string,
    setOpenModal: (value: React.SetStateAction<boolean>) => void,
  ) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setOpenModal(false);
  };

  // Handle Refresh
  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setQ('');
    queryParams.delete('q');
    queryParams.delete('page');
    router.push(`?${queryParams.toString()}`);
  };

  return {
    logs,
    loading,
    count,
    currentPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useLogs;
