import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const usePreviewInvoice = () => {
  // Memoized selectors for better performance
  const { org, customers, selectedCustomerId } = useSelector(
    (state: RootState) => state.org
  );

  const { profile } = useSelector((state: RootState) => state.auth);

  const { createInvoiceData } = useSelector(
    (state: RootState) => state.invoice
  );

  const { coupon_info } = useSelector((state: RootState) => state.coupon);

  // Memoized selected customer lookup
  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  return {
    org,
    profile,
    createInvoiceData,
    coupon_info,
    selectedCustomer,
  };
};
