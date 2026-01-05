import { fetchSubscriptionPlan } from '@/redux/slices/subscriptionPlanSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useSubscriptionPlan = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { org } = useSelector((state: RootState) => state.org);

  let { subscription_plan, loading } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );

  useEffect(() => {}, [dispatch, org]);

  return {
    subscription_plan,
    loading,
  };
};

export default useSubscriptionPlan;
