import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoice } from '@/redux/slices/invoiceSlice';

const useInvoice = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { invoice, loading } = useSelector((state: RootState) => state.invoice);
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchInvoice({ id, business_id: org?.id })).unwrap();
  }, [dispatch, org?.id]);

  return {
    invoice,
    loading,
  };
};

export default useInvoice;
