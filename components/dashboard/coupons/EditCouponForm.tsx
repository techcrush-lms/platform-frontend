'use client';

import { Button } from '@/components/ui/Button';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import Input from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ThemeDiv from '@/components/ui/ThemeDiv';
import useCoupon from '@/hooks/page/useCoupon';
import {
  CreateCouponProps,
  createCouponSchema,
  UpdateCouponProps,
  updateCouponSchema,
} from '@/lib/schema/coupon.schema';
import { CouponType } from '@/lib/utils';
import { createCoupon, updateCoupon } from '@/redux/slices/couponSlice';
import { AppDispatch, RootState } from '@/redux/store';
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const defaultValue: UpdateCouponProps = {
  business_id: '',
  code: '',
  type: null,
  value: null,
  start_date: '',
  end_date: '',
  usage_limit: null,
  user_limit: null,
  min_purchase: null,
};

const EditCouponForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { org } = useSelector((state: RootState) => state.org);
  const { coupon } = useCoupon();

  const [body, setBody] = useState<UpdateCouponProps>(defaultValue);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBody((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !coupon) return;

    try {
      setIsSubmitting(true);

      // console.log(body);

      const { error, value } = updateCouponSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response: any = await dispatch(
        updateCoupon({
          id: coupon.id,
          credentials: {
            ...body,
            min_purchase: +body.min_purchase!,
            usage_limit: +body.usage_limit!,
            user_limit: +body.user_limit!,
            value: +body.value!,
          },
        })
      );

      if (response.type === 'coupon-management/update/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push(`/coupons`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body?.business_id &&
    body.code &&
    body.type &&
    body.value &&
    body.start_date &&
    body.end_date &&
    body.usage_limit &&
    body.user_limit &&
    body.min_purchase;

  // Update form state when course data is fetched
  useEffect(() => {
    if (coupon) {
      setBody({
        business_id: coupon.business.id,
        code: coupon.code || '',
        type: coupon.type as any,
        value: coupon.value,
        start_date: moment(coupon.start_date).format('YYYY-MM-DD'),
        end_date: moment(coupon.end_date).format('YYYY-MM-DD'),
        usage_limit: coupon.usage_limit,
        user_limit: coupon.user_limit,
        min_purchase: coupon.min_purchase,
      });
    }
  }, [coupon]);

  return (
    <ThemeDiv>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label htmlFor='code' className='block font-medium mb-1'>
              Code
            </label>
            <Input
              type='text'
              name='code'
              id='code'
              value={body.code}
              onChange={handleChange}
              placeholder='e.g. 30%-OFF'
              required
            />
          </div>

          <div>
            <label htmlFor='type' className='block font-medium mb-1'>
              Type
            </label>
            <Select
              name='type'
              value={body.type!}
              onValueChange={(value: any) =>
                setBody((prev) => ({
                  ...prev,
                  type: value,
                }))
              }
              required
            >
              <SelectTrigger id='category' className='w-full'>
                <SelectValue placeholder='Select your category' />
              </SelectTrigger>
              <SelectContent>
                {[CouponType.PERCENTAGE, CouponType.FLAT].map(
                  (coupon, index: number) => (
                    <SelectItem key={index} value={coupon}>
                      {coupon}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor='value' className='block font-medium mb-1'>
              Value
            </label>
            <Input
              type='number'
              name='value'
              id='value'
              value={body.value!}
              onChange={handleChange}
              placeholder='e.g. 30'
              required
            />
          </div>

          <div>
            <label htmlFor='start_date' className='block font-medium mb-1'>
              Start Date
            </label>
            <Input
              type='date'
              name='start_date'
              id='start_date'
              value={body.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor='end_date' className='block font-medium mb-1'>
              End Date
            </label>
            <Input
              type='date'
              name='end_date'
              id='end_date'
              value={body.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor='usage_limit' className='block font-medium mb-1'>
              Total Usage Limit
            </label>
            <Input
              type='number'
              name='usage_limit'
              id='usage_limit'
              value={body.usage_limit!}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor='user_limit' className='block font-medium mb-1'>
              Usage Limit per User
            </label>
            <Input
              type='number'
              name='user_limit'
              id='user_limit'
              value={body.user_limit!}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor='min_purchase' className='block font-medium mb-1'>
              Minimum Purchase (₦)
            </label>
            <Input
              type='number'
              name='min_purchase'
              id='min_purchase'
              value={body.min_purchase!}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className=''>
          <Button
            type='submit'
            variant='primary'
            // className='px-6 py-2 rounded-lg'
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center'>
                <LoadingIcon />
                Processing...
              </span>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </ThemeDiv>
  );
};

export default EditCouponForm;
