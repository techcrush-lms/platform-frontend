'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import EditDigitalProductForm from '@/components/dashboard/product/digital-product/EditDigitalProductForm';
import PageHeading, { BreadcrumbLayer } from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import useDigitalProduct from '@/hooks/page/useDigitalProduct';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn, ProductStatus } from '@/lib/utils';
import {
  deleteDigitalProduct,
  fetchDigitalProduct,
  updateDigitialProduct,
} from '@/redux/slices/digitalProductSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiDocumentText, HiPaperAirplane } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

const BREADCRUMB_LAYERS: BreadcrumbLayer[] = [
  {
    title: 'Products',
    href: '/products',
  },
  {
    title: 'Digital Products',
    href: '/products/digital-products',
  },
  {
    title: 'Edit Digital Product',
    href: '/products/digital-products/add',
  },
];

const EditDigitalProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { digital_product, loading } = useDigitalProduct();

  const confetti = useConfettiStore();

  const { org } = useSelector((state: RootState) => state.org);

  const [deleteDigitalProductOpenModal, setDeleteDigitalProductOpenModal] =
    useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isPublishSubmitting, setIsPublishSubmitting] = useState(false);

  const handleDeleteDigitalProductNavigation = async () => {
    try {
      setIsSubmitting(true);
      setIsDeleteSubmitting(true);

      // Submit logic here
      const response: any = await dispatch(
        deleteDigitalProduct({
          id: digital_product?.id!,
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-digital-crud/:id/delete/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success('Digital product deleted successfully!');
      router.push(`/products/digital-products`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsDeleteSubmitting(false);
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!digital_product?.id || !org?.id) return;

    setIsSubmitting(true);
    setIsPublishSubmitting(true);

    const statusUpdate =
      digital_product?.status === ProductStatus.PUBLISHED
        ? ProductStatus.DRAFT
        : ProductStatus.PUBLISHED;
    try {
      const response: any = await dispatch(
        updateDigitialProduct({
          id: digital_product.id as string,
          credentials: {
            status: statusUpdate,
          },
          business_id: org.id,
        })
      ).unwrap();

      if (response.type === 'product-digital-crud/:id/update/rejected') {
        throw new Error(response.payload.message);
      }

      if (statusUpdate === ProductStatus.PUBLISHED) {
        confetti.onOpen();
      }

      dispatch(
        fetchDigitalProduct({ id: digital_product.id, business_id: org.id })
      );

      const msg =
        statusUpdate === ProductStatus.PUBLISHED
          ? 'Digital product published successfully!'
          : 'Digital product moved to draft successfully.';
      toast.success(msg);
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish digital product');
    } finally {
      setIsPublishSubmitting(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleDeleteDigitalProductNavigation();
      setAllowAction(false);
    }
  }, [allowAction]);

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Digital Product'
          enableBreadCrumb={true}
          layer2={BREADCRUMB_LAYERS[0].title}
          layer2Link={BREADCRUMB_LAYERS[0].href}
          layer3={BREADCRUMB_LAYERS[1].title}
          layer3Link={BREADCRUMB_LAYERS[1].href}
          layer4={BREADCRUMB_LAYERS[2].title}
          enableBackButton={true}
          ctaButtons={
            <div className='flex flex-shrink-0 self-start mb-2 gap-2'>
              {digital_product?.status === ProductStatus.PUBLISHED && (
                <Button
                  variant={'primary'}
                  className={cn(
                    'dark:text-white hover:text-white hover:bg-primary-800'
                  )}
                  onClick={handlePublish}
                  disabled={isSubmitting}
                >
                  {isPublishSubmitting ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <span className='flex gap-1 items-center'>
                      <HiDocumentText />
                      Move to draft
                    </span>
                  )}
                </Button>
              )}
              {digital_product?.status === ProductStatus.DRAFT && (
                <Button
                  variant={'green'}
                  className={cn('hover:bg-green-800')}
                  onClick={handlePublish}
                  disabled={isSubmitting}
                >
                  {isPublishSubmitting ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <span className='flex gap-1 items-center'>
                      <HiPaperAirplane />
                      Publish
                    </span>
                  )}
                </Button>
              )}
              {digital_product?.purchased_digital_products?.length === 0 &&
              digital_product?.status === ProductStatus.DRAFT ? (
                <Button
                  variant='red'
                  className='flex gap-1'
                  onClick={() => setDeleteDigitalProductOpenModal(true)}
                  disabled={isSubmitting}
                >
                  {isDeleteSubmitting ? (
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
              ) : (
                <></>
              )}
            </div>
          }
        />

        <Suspense fallback={<div>Loading...</div>}>
          <div className='mt-6'>
            <EditDigitalProductForm />
          </div>
        </Suspense>

        <ActionConfirmationModal
          body={`Are you sure you want to delete your digital product - ${digital_product?.title}`}
          openModal={deleteDigitalProductOpenModal}
          setOpenModal={setDeleteDigitalProductOpenModal}
          allowAction={allowAction}
          setAllowAction={setAllowAction}
        />
      </div>
    </main>
  );
};

export default EditDigitalProduct;
