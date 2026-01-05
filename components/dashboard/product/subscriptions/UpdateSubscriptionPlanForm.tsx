'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import {
  PlanPrice,
  PlanPriceProps,
  SubscriptionPlanPriceProps,
  UpdateSubscriptionPlanProps,
  updateSubscriptionPlanSchema,
} from '@/lib/schema/subscription.schema';
import {
  baseUrl,
  cn,
  formatMoney,
  OnboardingProcess,
  ProductStatus,
  SubscriptionPeriod,
} from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, PlusIcon, XIcon } from 'lucide-react';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  updateSubscriptionPlan,
  fetchSubscriptionPlans,
  deleteSubscriptionPlan,
  deletePlanPrice,
} from '@/redux/slices/subscriptionPlanSlice';
import useSubscriptionPlan from '@/hooks/page/useSubscriptionPlan';
import { useParams } from 'next/navigation';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import useProductCategory from '@/hooks/page/useProductCategory';
import { updateOnboardingProcess } from '@/redux/slices/orgSlice';
import {
  OtherCurrencyFormFieldProps,
  OtherCurrencyProps,
} from '@/lib/schema/product.schema';
import { SubscriptionPlanPriceFields } from './SubscriptionPlanPriceFields';
import { SubscriptionPlanPrice } from '@/types/org';

interface Props {
  setIsPlanModalOpen: (value: React.SetStateAction<boolean>) => void;
}

const UpdateSubscriptionPlanForm = ({ setIsPlanModalOpen }: Props) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { categories } = useProductCategory();

  const { org } = useSelector((state: RootState) => state.org);
  const { subscription_plan: plan } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );

  const { subscription_plan } = useSubscriptionPlan(plan?.id!);

  const [body, setBody] = useState<UpdateSubscriptionPlanProps>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteSubscriptionPlanOpenModal, setDeleteSubscriptionPlanOpenModal] =
    useState(false);
  const [
    allowDeleteSubscriptionPlanAction,
    setAllowDeleteSubscriptionPlanAction,
  ] = useState(false);

  const [planPriceIndex, setPlanPriceIndex] = useState<number>();
  const [planPrice, setPlanPrice] = useState<SubscriptionPlanPriceProps>();

  const [deletePlanPriceOpenModal, setDeletePlanPriceOpenModal] =
    useState(false);
  const [allowDeletePlanPriceAction, setAllowDeletePlanPriceAction] =
    useState(false);

  // --------------------- Handlers ---------------------

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (
    index: number,
    field: string | keyof PlanPrice,
    value: string | OtherCurrencyFormFieldProps
  ) => {
    setBody((prev) => {
      const updated = [...body?.subscription_plan_prices!];
      const plan_price_options = {
        ...updated[index],
      } as SubscriptionPlanPriceProps;

      if (field === 'other_currencies' && typeof value === 'object') {
        const {
          currencyIndex,
          field: subField,
          value: val,
          defaultCurrency,
        } = value;

        // Ensure other_currencies is always an array
        const updatedCurrencies: OtherCurrencyProps[] = Array.isArray(
          plan_price_options.other_currencies
        )
          ? [...plan_price_options.other_currencies]
          : [];

        // Ensure slot exists
        if (!updatedCurrencies[currencyIndex]) {
          updatedCurrencies[currencyIndex] = {
            currency: defaultCurrency,
            price: 0,
          };
        }

        updatedCurrencies[currencyIndex] = {
          ...updatedCurrencies[currencyIndex],
          [subField]:
            subField === 'original_price'
              ? val
                ? +val
                : undefined
              : val
              ? +val
              : 0,
        };

        plan_price_options.other_currencies = updatedCurrencies;
      } else {
        const numericFields = ['price', 'period'];

        (plan_price_options as any)[field] = numericFields.includes(field)
          ? field === 'price'
            ? value
            : value
          : value;
      }

      updated[index] = plan_price_options;

      return {
        ...prev,
        subscription_plan_prices: updated,
      };
    });
  };

  const addPriceField = () => {
    setBody((prev) => ({
      ...prev!,
      subscription_plan_prices: [
        ...(prev?.subscription_plan_prices || []),
        {
          price: 0,
          period: SubscriptionPeriod.MONTHLY,
          currency: 'NGN',
          subscription_plan: { subscriptions: [] },
        },
      ],
    }));
  };

  const removePriceField = (index: number) => {
    const updated = [...(body?.subscription_plan_prices || [])];
    updated.splice(index, 1);
    setBody((prev) => ({ ...prev!, subscription_plan_prices: updated }));
  };

  const removeImage = () => {
    setBody((prev) => ({ ...prev!, cover_image: '' }));
    setImagePreview(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!file || file.size > 5 * 1024 * 1024)
      return toast.error('Image size should be less than 5MB');

    setUploadingImage(true);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const response = await dispatch(
        uploadImage({ form_data: formData, business_id: org?.id })
      ).unwrap();

      setBody((prev) => ({
        ...prev!,
        cover_image: response.multimedia.url,
        multimedia_id: response.multimedia.id,
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // Remove unwanted (subscription_plan)
      const modified_prices = body?.subscription_plan_prices?.map(
        ({ subscription_plan, ...rest }) => rest
      );

      const raw = {
        ...body!,
        subscription_plan_prices: modified_prices,
        subscription_plan_roles: [
          {
            ...body.subscription_plan_roles?.[0],
            ...(body?.subscription_plan_roles?.[0] || {
              title: 'Member',
              selected: true,
            }),
            role_id: `${(body?.name || 'default')
              .toLowerCase()
              .replace(/\s+/g, '_')}_member`,
            selected: true,
          },
        ],
      };

      const { error } = updateSubscriptionPlanSchema.validate(raw);
      if (error) throw new Error(error.details[0].message);

      const response = await dispatch(
        updateSubscriptionPlan({ id: subscription_plan?.id!, credentials: raw })
      ).unwrap();

      // Update onboarding process
      if (
        !org?.onboarding_status.onboard_processes?.includes(
          OnboardingProcess.PRODUCT_CREATION
        )
      ) {
        await dispatch(
          updateOnboardingProcess({
            business_id: org?.id!,
            process: OnboardingProcess.PRODUCT_CREATION,
          })
        );
      }

      toast.success(response.message);
      setIsPlanModalOpen(false);
      dispatch(fetchSubscriptionPlans({ business_id: org?.id! }));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body?.name &&
    body?.slug &&
    body?.description &&
    body?.category_id &&
    // body?.cover_image &&
    (body?.subscription_plan_prices?.length || 0) > 0;

  const periods = Object.values(SubscriptionPeriod).filter(
    (period) => period !== SubscriptionPeriod.FREE
  );

  // Perform the subscription plan delete action after confirmation
  const handleSubscriptionPlanDelete = async () => {
    try {
      setIsSubmitting(true);

      // Submit logic here
      const response = await dispatch(
        deleteSubscriptionPlan({ id: subscription_plan?.id! })
      ).unwrap();

      toast.success(response.message);
      setIsPlanModalOpen(false);
      dispatch(fetchSubscriptionPlans({ business_id: org?.id! }));
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setDeleteSubscriptionPlanOpenModal(false);
    }
  };

  const removePlanPrice = (index: number) => {
    setPlanPriceIndex(index);
    const plan_price = body?.subscription_plan_prices!.find(
      (_, i) => i === index
    );
    setPlanPrice(plan_price);
    setDeletePlanPriceOpenModal(true);
  };

  // Perform the subscription plan price delete action after confirmation
  const handleSubscriptionPlanPriceDelete = async () => {
    if (planPrice?.id) {
      try {
        setIsSubmitting(true);

        // Submit logic here
        const response = await dispatch(
          deletePlanPrice({ id: planPrice.id })
        ).unwrap();

        const updatedPlanPrices = body?.subscription_plan_prices!.filter(
          (_, i) => i !== planPriceIndex
        );
        setBody((prev) => ({
          ...prev,
          subscription_plan_prices: updatedPlanPrices,
        }));
      } catch (error: any) {
        console.error('Submission failed:', error);
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
        setDeletePlanPriceOpenModal(false);
      }
    }
  };

  // --------------------- Load Plan Data ---------------------

  useEffect(() => {
    if (subscription_plan) {
      setBody({
        name: subscription_plan.name || '',
        description: subscription_plan.description || '',
        cover_image: subscription_plan.cover_image || '',
        category_id: subscription_plan?.product?.category.id || '',
        status: subscription_plan?.product?.status || ProductStatus.DRAFT,
        multimedia_id: subscription_plan?.product?.multimedia.id || '',
        subscription_plan_prices: (
          subscription_plan?.subscription_plan_prices || []
        ).map((price: SubscriptionPlanPrice) => ({
          ...price,
          id: price.id,
          price: price.price,
          period: price.period as SubscriptionPeriod,
          currency: price.currency,
          other_currencies: price.other_currencies,
        })),
        subscription_plan_roles:
          subscription_plan.subscription_plan_roles || [],
        slug: subscription_plan?.product?.slug,
      });

      setImagePreview(subscription_plan.cover_image);
    }
  }, [subscription_plan]);

  useEffect(() => {
    if (allowDeleteSubscriptionPlanAction) {
      handleSubscriptionPlanDelete();
      setAllowDeleteSubscriptionPlanAction(false);
    }
  }, [allowDeleteSubscriptionPlanAction]);

  useEffect(() => {
    if (allowDeletePlanPriceAction) {
      handleSubscriptionPlanPriceDelete();
      setAllowDeletePlanPriceAction(false);
    }
  }, [allowDeletePlanPriceAction]);

  // --------------------- Render ---------------------

  return (
    <form onSubmit={handleSubmit} className='space-y-8 mb-3 overflow-y-auto'>
      {/* Basic Info */}
      <section className='space-y-4'>
        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Plan Name
          </label>
          <Input
            name='name'
            placeholder='Plan Name'
            value={body?.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Shortlink <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              type='text'
              name='slug'
              value={body?.slug!}
              onChange={handleInputChange}
              required
              className='w-full rounded-md pl-9'
            />
          </div>

          {/* Live preview */}
          {body?.slug && (
            <p className='mt-2 text-sm '>
              Preview:{' '}
              <span className='text-primary-main dark:text-primary-faded font-medium'>
                {baseUrl}/{body.slug}
              </span>
            </p>
          )}
        </div>

        {/* Category and Price Fields */}
        <div>
          <label className='text-sm font-medium mb-1 block'>
            Category <span className='text-red-500'>*</span>
          </label>
          <Select
            value={body?.category_id!}
            onValueChange={(value) =>
              setBody((prev) => ({ ...prev, category_id: value }))
            }
            required
          >
            <SelectTrigger id='category' className='w-full'>
              <SelectValue placeholder='Select your category' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category, index) => (
                <SelectItem key={index} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Description
          </label>
          <Textarea
            name='description'
            placeholder='Plan Description'
            value={body?.description || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Cover Image
          </label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-primary-main file:text-white hover:file:bg-primary-dark'
          />
          <div className='mt-4 relative'>
            {uploadingImage ? (
              <div className='relative h-64 w-[50%] rounded-md border dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse'>
                <div className='absolute inset-0 shimmer-layer' />
              </div>
            ) : (
              imagePreview && (
                <>
                  <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                    Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='max-h-64 rounded-md border dark:border-gray-600'
                  />
                  <button
                    type='button'
                    onClick={removeImage}
                    className='absolute top-5 left-0 bg-red-600 text-white px-2 rounded-full hover:bg-red-700'
                  >
                    <XIcon className='w-4 h-4' />
                  </button>
                </>
              )
            )}{' '}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-medium text-gray-700 dark:text-gray-200'>
            Pricing Options
          </h2>
          <Button
            type='button'
            onClick={addPriceField}
            variant='link'
            className='p-0'
          >
            <PlusIcon className='w-4 h-4' />
          </Button>
        </div>

        {body &&
          body.subscription_plan_prices &&
          body.subscription_plan_prices.length > 0 && (
            <ul className='flex flex-wrap gap-2'>
              {body.subscription_plan_prices.map((p, idx) => (
                <li
                  key={idx}
                  className='bg-green-100 dark:bg-green-800 text-sm text-green-800 dark:text-green-200 px-3 py-1 rounded-full'
                >
                  {formatMoney(+p.price, p.currency)} /{' '}
                  {p.period.split('_').join(' ')}
                </li>
              ))}
            </ul>
          )}

        {body?.subscription_plan_prices?.map((price, index) => (
          <SubscriptionPlanPriceFields
            key={index}
            plan_price_tier={price}
            periods={periods}
            index={index}
            onPlanPriceTierChange={handlePriceChange}
            onRemovePlanPriceTier={removePriceField}
          />
        ))}
      </section>

      <div>
        <label className='font-medium mb-1 block text-gray-700 dark:text-white'>
          Make Public? <span className='text-red-500'>*</span>
        </label>
        <Select
          value={body?.status!}
          onValueChange={(value) =>
            setBody((prev) => ({ ...prev, status: value as any }))
          }
          required
        >
          <SelectTrigger id='status' className='w-full'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {[
              [ProductStatus.DRAFT, 'No'],
              [ProductStatus.PUBLISHED, 'Yes'],
            ].map((status, index) => (
              <SelectItem key={index} value={status[0]}>
                {status[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <div className=' flex gap-2'>
        <Button type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
              <LoadingIcon />
              Processing...
            </span>
          ) : (
            'Save'
          )}
        </Button>
        {!subscription_plan?.subscriptions.length && (
          <Button
            type='button'
            variant='red'
            disabled={isSubmitting}
            onClick={() => setDeleteSubscriptionPlanOpenModal(true)}
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center'>
                <LoadingIcon />
                Processing...
              </span>
            ) : (
              'Delete'
            )}
          </Button>
        )}
      </div>

      <ActionConfirmationModal
        body={`Are you sure you want to delete your subscription plan - ${subscription_plan?.name}?`}
        openModal={deleteSubscriptionPlanOpenModal}
        setOpenModal={setDeleteSubscriptionPlanOpenModal}
        allowAction={allowDeleteSubscriptionPlanAction}
        setAllowAction={setAllowDeleteSubscriptionPlanAction}
      />

      <ActionConfirmationModal
        body={`Are you sure you want to delete your ${planPrice?.period} price record?`}
        openModal={deletePlanPriceOpenModal}
        setOpenModal={setDeletePlanPriceOpenModal}
        allowAction={allowDeletePlanPriceAction}
        setAllowAction={setAllowDeletePlanPriceAction}
      />
    </form>
  );
};

export default UpdateSubscriptionPlanForm;
