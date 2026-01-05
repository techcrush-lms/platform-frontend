import { fetchCustomers } from '@/redux/slices/orgSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { useParams } from 'next/navigation';
import { SystemRole } from '@/lib/utils';
import { fetchContacts, fetchOrgContacts } from '@/redux/slices/chatSlice';
import { PaginationProps } from '@/types';
import { BusinessProps, ContactInfo, ContactInfoResponse } from '@/types/org';

interface UseContactsProps {
  limit?: number;
}

const useContacts = ({ limit = 10 }: UseContactsProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { profile } = useSelector((state: RootState) => state.auth);
  const { contacts, contactsLoading, contactsCurrentPage, contactsCount } =
    useSelector((state: RootState) => state.chat);

  const {
    q,
    startDate,
    endDate,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useQueryParams(contacts, limit);

  const fetchData = useCallback(async () => {
    const action =
      profile?.role.role_id === SystemRole.BUSINESS_ADMIN ||
      profile?.role.role_id === SystemRole.BUSINESS_SUPER_ADMIN
        ? fetchContacts
        : fetchOrgContacts;

    await dispatch(
      action({
        limit,
        ...(contactsCurrentPage && { page: contactsCurrentPage }),
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org?.id as string }),
      } as PaginationProps & BusinessProps)
    ).unwrap();
  }, [dispatch, limit, q, startDate, endDate, org?.id, profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    limit,
    contacts,
    contactsLoading,
    contactsCurrentPage,
    q,
    startDate,
    endDate,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
    contactsCount,
  };
};

export default useContacts;
