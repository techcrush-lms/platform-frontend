import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCustomer } from '@/redux/slices/orgSlice';

const useCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { customer } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(fetchCustomer({ id: params.id as string, business_id: org?.id }));
  }, [dispatch, org]);

  return {
    customer,
  };
};

export default useCustomer;
