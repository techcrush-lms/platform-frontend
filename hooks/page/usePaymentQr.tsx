import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validatePaymentQr } from '@/redux/slices/paymentSlice';
import { useParams } from 'next/navigation';

const usePaymentQr = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { payment_qr_details, payment_qr_message, loading, error } =
    useSelector((state: RootState) => state.payment);
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      validatePaymentQr({ id: params?.id as string, business_id: org?.id! })
    ).unwrap();
  }, [dispatch, org]);

  return {
    payment_qr_details,
    payment_qr_message,
    loading,
    error,
  };
};

export default usePaymentQr;
