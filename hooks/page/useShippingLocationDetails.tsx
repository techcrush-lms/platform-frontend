import { fetchSubscriptionPlan } from '@/redux/slices/subscriptionPlanSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useShippingLocationDetails = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { org } = useSelector((state: RootState) => state.org);

  let { shippingLocation, loading } = useSelector(
    (state: RootState) => state.shipping
  );

  useEffect(() => {}, [dispatch, org]);

  return {
    shippingLocation,
    loading,
  };
};

export default useShippingLocationDetails;
