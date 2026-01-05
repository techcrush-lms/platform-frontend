import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrg, fetchOrgs } from '@/redux/slices/orgSlice';

const useOrg = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { org, loading } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchOrg(id)).unwrap();
  }, [dispatch, org?.id]);

  return {
    org,
    loading,
  };
};

export default useOrg;
