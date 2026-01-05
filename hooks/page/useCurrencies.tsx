import { DEFAULT_CURRENCY } from '@/lib/utils';
import { fetchBusinessCurrencies } from '@/redux/slices/currencySlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCurrencies = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { currencies, loading, error } = useSelector(
    (state: RootState) => state.currency
  );
  const { org } = useSelector((state: RootState) => state.org);

  const foreignCurrencies = () => {
    return currencies?.product?.filter(
      (product_currency) => product_currency.currency !== DEFAULT_CURRENCY
    );
  };

  useEffect(() => {
    dispatch(fetchBusinessCurrencies({ business_id: org?.id! })).unwrap();
  }, [dispatch, org?.id]);

  return {
    currencies,
    foreignCurrencies,
    loading,
    error,
  };
};

export default useCurrencies;
