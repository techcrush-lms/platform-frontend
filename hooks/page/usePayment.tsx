import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayment } from '@/redux/slices/paymentSlice';
import { useParams } from 'next/navigation';

const usePayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { payment, loading } = useSelector((state: RootState) => state.payment);
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      fetchPayment({ id: params?.id as string, business_id: org?.id })
    ).unwrap();
  }, [dispatch, org]);

  return {
    payment,
    loading,
  };
};

export default usePayment;
