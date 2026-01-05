import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithdrawal } from '@/redux/slices/withdrawalSlice';
import { useParams } from 'next/navigation';

const useWithdrawal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { withdrawal, loading } = useSelector(
    (state: RootState) => state.withdrawal
  );
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    if (params?.id) {
      dispatch(fetchWithdrawal(params.id as string)).unwrap();
    }
  }, [dispatch, params?.id, org?.id]);

  return {
    withdrawal,
    loading,
  };
};

export default useWithdrawal;
