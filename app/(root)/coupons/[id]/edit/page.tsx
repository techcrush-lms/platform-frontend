'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import EditCouponForm from '@/components/dashboard/coupons/EditCouponForm';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import ActivateIcon from '@/components/ui/icons/ActivateIcon';
import DeactivateIcon from '@/components/ui/icons/DeactivateIcon';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import {
  deleteCoupon,
  fetchCoupon,
  updateCoupon,
  viewCoupon,
} from '@/redux/slices/couponSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { DeleteIcon, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const EditCoupon = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);

  const { coupon } = useSelector((state: RootState) => state.coupon);

  const [isSubmittingStatusChange, setIsSubmittingStatusChange] =
    useState(false);
  const [isSubmittingDeleteCoupon, setIsSubmittingDeleteCoupon] =
    useState(false);

  const [changeStatusOpenModal, setChangeStatusOpenModal] = useState(false);
  const [allowStatusChangeAction, setAllowStatusChangeAction] = useState(false);

  const [deleteCouponOpenModal, setDeleteCouponOpenModal] = useState(false);
  const [allowDeleteCouponAction, setAllowDeleteCouponAction] = useState(false);

  const handleCouponStatusChange = async (is_active: boolean) => {
    try {
      setIsSubmittingStatusChange(true);

      // Submit logic here
      const response: any = await dispatch(
        updateCoupon({
          id: coupon?.id!,
          credentials: {
            is_active,
          },
        })
      );

      if (response.type === 'coupon-management/update/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      dispatch(fetchCoupon({ id: coupon?.id!, business_id: org?.id }));
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmittingStatusChange(false);
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      setIsSubmittingStatusChange(true);

      // Submit logic here
      const response: any = await dispatch(
        deleteCoupon({
          id: coupon?.id!,
          business_id: org?.id!,
        })
      );

      if (response.type === 'coupon-management/:id/delete/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success(response.payload.message);
      router.push(`/coupons`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmittingStatusChange(false);
    }
  };

  useEffect(() => {
    dispatch(viewCoupon(params?.id as string));
  }, [dispatch]);

  useEffect(() => {
    if (allowStatusChangeAction) {
      handleCouponStatusChange(!coupon?.is_active);
      setAllowStatusChangeAction(false);
    }
  }, [allowStatusChangeAction]);

  useEffect(() => {
    if (allowDeleteCouponAction) {
      handleDeleteCoupon();
      setAllowDeleteCouponAction(false);
    }
  }, [allowDeleteCouponAction]);

  const isSubmitting = isSubmittingStatusChange || isSubmittingDeleteCoupon;

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-12'>
      <div className='section-container space-y-6'>
        {/* Page Heading */}
        <PageHeading
          title='Edit coupon'
          enableBreadCrumb
          layer2='Coupons'
          layer3='Edit coupon'
          layer2Link='/coupons'
          enableBackButton
          ctaButtons={
            <div className='flex gap-2'>
              {coupon?.is_active ? (
                <Button
                  type='button'
                  variant='red'
                  className='text-md flex p-2 px-4 gap-2'
                  disabled={isSubmitting}
                  onClick={() => setChangeStatusOpenModal(true)}
                >
                  {isSubmitting ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <DeactivateIcon />
                      Deactivate
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    type='button'
                    variant='green'
                    className='text-md flex p-2 px-4 gap-2'
                    disabled={isSubmitting}
                    onClick={() => setChangeStatusOpenModal(true)}
                  >
                    {isSubmitting ? (
                      <span className='flex items-center justify-center'>
                        <LoadingIcon />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <ActivateIcon />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='red'
                    className='text-md flex p-2 px-4 gap-2'
                    onClick={() => setDeleteCouponOpenModal(true)}
                    disabled={isSubmitting}
                  >
                    {isSubmittingDeleteCoupon ? (
                      <span className='flex items-center justify-center'>
                        <LoadingIcon />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Trash2Icon size={15} />
                        Delete
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          }
        />

        <EditCouponForm />
      </div>

      <ActionConfirmationModal
        body={`Are you sure you want to ${
          coupon?.is_active ? 'deactivate' : 'activate'
        } this coupon - ${coupon?.code}?`}
        openModal={changeStatusOpenModal}
        setOpenModal={setChangeStatusOpenModal}
        allowAction={allowStatusChangeAction}
        setAllowAction={setAllowStatusChangeAction}
      />

      <ActionConfirmationModal
        body={`Are you sure you want to delete this coupon - ${coupon?.code}?`}
        openModal={deleteCouponOpenModal}
        setOpenModal={setDeleteCouponOpenModal}
        allowAction={allowDeleteCouponAction}
        setAllowAction={setAllowDeleteCouponAction}
      />
    </main>
  );
};

export default EditCoupon;
