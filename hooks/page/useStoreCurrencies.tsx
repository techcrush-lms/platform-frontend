import { fetchStoreCurrencies } from '@/redux/slices/currencySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useStoreCurrencies = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { store_currencies, loading, error } = useSelector(
    (state: RootState) => state.currency
  );
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchStoreCurrencies({ business_id: org?.id! })).unwrap();
  }, [dispatch, org?.id]);

  return {
    store_currencies,
    loading,
    error,
  };
};

export default useStoreCurrencies;
