import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrgs } from '@/redux/slices/orgSlice';

const useOrgs = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { orgs, loading, error } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchOrgs({})).unwrap();
  }, [dispatch]);

  return {
    orgs,
    loading,
    error,
  };
};

export default useOrgs;
