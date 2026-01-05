import { fetchBanks } from '@/redux/slices/orgSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useBanks = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    banks,
    banksLoading: loading,
    error,
  } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchBanks()).unwrap();
  }, [dispatch]);

  return {
    banks,
    loading,
    error,
  };
};

export default useBanks;
