import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const useQueryParams = <T>(items: T[], limit?: number) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParams = new URLSearchParams(searchParams.toString());

  const currentPage = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('limit')) || limit || 12;
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') || ''
  );
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  // Pagination handlers
  const onClickNext = () => {
    if (items.length > 0) {
      queryParams.set('page', encodeURIComponent(currentPage + 1));
      router.push(`?${queryParams}`);
    }
  };

  const onClickPrev = () => {
    if (currentPage - 1 > 0) {
      queryParams.set('page', encodeURIComponent(currentPage - 1));
      router.push(`?${queryParams}`);
    }
  };

  // Search submission handler
  const handleSearchSubmit = (input: string) => {
    setQ(input);
    if (input.trim()) {
      queryParams.set('q', encodeURIComponent(input));
    } else {
      queryParams.delete('q');
    }
    router.push(`?${queryParams.toString()}`);
  };

  // Filter by date submission handler
  const handleFilterByDateSubmit = (
    startDate: string,
    endDate: string,
    setOpenModal: (value: React.SetStateAction<boolean>) => void
  ) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setOpenModal;
  };

  // Refresh handler
  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setQ('');
    queryParams.delete('q');
    queryParams.delete('page');
    router.push(`?${queryParams.toString()}`);
  };

  return {
    queryParams,
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
  };
};

export default useQueryParams;
