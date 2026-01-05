import { fetchCoupon, fetchCoupons } from '@/redux/slices/couponSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCoupon = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  let { coupon, loading } = useSelector((state: RootState) => state.coupon);
  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      fetchCoupon({
        id: params?.id as string,
        business_id: org?.id as string,
      })
    );
  }, [dispatch, org]);

  return {
    coupon,
    loading,
  };
};

export default useCoupon;
