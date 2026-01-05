'use client';

import { fetchInstant } from '@/redux/slices/notificationSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type UseInstantNotificationProps = {
  initialType?: string;
  initialLimit?: number;
};

const useInstantNotification = ({
  initialType = '',
  initialLimit = 10,
}: UseInstantNotificationProps = {}) => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams(searchParams.toString());

  // query params first, then fall back to props
  const currentPage = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('limit')) || initialLimit;

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [type, setType] = useState(searchParams.get('type') || initialType);

  const {
    instantNotificationLoading,
    instantNotifications,
    countInstantNotifications,
    unreadInstantNotifications,
  } = useSelector((state: RootState) => state.notification);

  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      fetchInstant({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(type && { type }),
        ...(org?.id && { business_id: org?.id }),
      })
    );
  }, [dispatch, currentPage, perPage, q, startDate, endDate, type, org?.id]);

  const onClickNext = () => {
    if (instantNotifications.length > 0) {
      queryParams.set('page', String(currentPage + 1));
      router.push(`?${queryParams}`);
    }
  };

  const onClickPrev = () => {
    if (currentPage - 1 > 0) {
      queryParams.set('page', String(currentPage - 1));
      router.push(`?${queryParams}`);
    }
  };

  const handleSearchSubmit = (input: string) => {
    setQ(input);

    if (input.trim()) {
      queryParams.set('q', encodeURIComponent(input));
    } else {
      queryParams.delete('q');
    }

    router.push(`?${queryParams.toString()}`);
  };

  const handleFilterByDateSubmit = (
    startDate: string,
    endDate: string,
    setOpenModal: (value: React.SetStateAction<boolean>) => void
  ) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setOpenModal(false);
  };

  const handleFilterByType = (selectedType: string) => {
    setType(selectedType);

    if (selectedType) {
      queryParams.set('type', encodeURIComponent(selectedType));
    } else {
      queryParams.delete('type');
    }

    router.push(`?${queryParams.toString()}`);
  };

  const handleRefresh = () => {
    setStartDate('');
    setEndDate('');
    setQ('');
    setType('');
    queryParams.delete('q');
    queryParams.delete('page');
    queryParams.delete('type');
    queryParams.delete('limit');
    router.push(`?${queryParams.toString()}`);
  };

  return {
    instantNotifications,
    instantNotificationLoading,
    totalInstantNotifications: countInstantNotifications,
    unReadCount: unreadInstantNotifications,
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    type,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleFilterByType,
    handleRefresh,
  };
};

export default useInstantNotification;
