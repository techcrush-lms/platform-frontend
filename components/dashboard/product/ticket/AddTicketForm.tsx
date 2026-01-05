'use client';

import XIcon from '@/components/ui/icons/XIcon';
import Input from '@/components/ui/Input';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  CreatePhysicalProductProps,
  CreateTicketProps,
  createTicketSchema,
  OtherCurrencyFormFieldProps,
  OtherCurrencyProps,
  TicketTierProps,
} from '@/lib/schema/product.schema';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import {
  baseUrl,
  cn,
  EventType,
  OnboardingProcess,
  ProductStatus,
  TicketTierStatus,
} from '@/lib/utils';
import { createTicket } from '@/redux/slices/ticketSlice';
import {
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Select,
} from '@/components/ui/select';
import moment from 'moment-timezone';
import { Textarea } from '@/components/ui/textarea';
import { updateOnboardingProcess } from '@/redux/slices/orgSlice';
import { capitalize } from 'lodash';
import { Globe } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import TinyMceEditor from '@/components/editor/TinyMceEditor';
import useCurrencies from '@/hooks/page/useCurrencies';
import AutosaveIndicator from '@/components/AutosaveIndicator';
import { useFormLocalSave } from '@/hooks/useFormLocalSave';

const DEFAULT_FORM_VALUES: CreateTicketProps = {
  title: '',
  slug: uuidv4().split('-')[0],
  description: '',
  keywords: '',
  metadata: '',
  category_id: '',
  status: null,
  multimedia_id: '',
  event_time: '',
  event_start_date: null,
  event_end_date: null,
  event_location: '',
  event_type: null,
  auth_details: '',
  ticket_tiers: [
    {
      name: '',
      amount: null,
      original_amount: null,
      quantity: 1,
      other_currencies: [],
    },
  ],
};

interface ImageUploadProps {
  imagePreview: string | null;
  uploadingImage: boolean;
  onImageUpload: (file: File) => Promise<void>;
  onRemoveImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  uploadingImage,
  onImageUpload,
  onRemoveImage,
}) => (
  <div>
    <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
      Upload Event Image
    </label>
    <input
      type='file'
      accept='image/*'
      onChange={(e) => {
        if (e.target.files) {
          onImageUpload(e.target.files[0]);
        }
      }}
      className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-primary-main file:text-white hover:file:bg-primary-dark'
    />
    {imagePreview && (
      <div className='mt-4 relative'>
        <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
          Preview:
        </p>
        <img
          src={imagePreview}
          alt='Event Preview'
          className='max-h-64 rounded-md border dark:border-gray-600'
        />
        <button
          type='button'
          onClick={onRemoveImage}
          className='absolute top-5 left-0 bg-red-600 text-white px-2 rounded-full hover:bg-red-700'
          aria-label='Remove Image'
        >
          <XIcon />
        </button>
      </div>
    )}
  </div>
);

interface TicketTierComponentProps {
  tier: TicketTierProps;
  index: number;
  onTierChange: (
    index: number,
    field: string,
    value: string | OtherCurrencyFormFieldProps
  ) => void;
  onRemoveTier: (index: number) => void;
}

const TicketTier: React.FC<TicketTierComponentProps> = ({
  tier,
  index,
  onTierChange,
  onRemoveTier,
}) => {
  const { foreignCurrencies } = useCurrencies();
  const [showCrossedOutPrice, setShowCrossedOutPrice] = useState(false);

  // Handles both flat fields and nested other_currencies
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('other_currencies')) {
      const match = name.match(/other_currencies\[(\d+)\]\.(\w+)/);
      if (match) {
        const currencyIndex = parseInt(match[1], 10);
        const field = match[2];

        onTierChange(index, 'other_currencies', {
          currencyIndex,
          field,
          value,
          defaultCurrency: foreignCurrencies()?.[currencyIndex]?.currency || '',
        });
        return;
      }
    }

    // Normal tier fields
    onTierChange(index, name, value);
  };

  // ✅ Toggle crossed-out prices and clear values when hidden
  const handleToggleCrossedOutPrice = () => {
    setShowCrossedOutPrice((prev) => {
      const newValue = !prev;

      if (!newValue) {
        // Clear NGN crossed-out price
        onTierChange(index, 'original_amount', '');

        // Clear foreign crossed-out prices
        foreignCurrencies()?.forEach((c, i) => {
          onTierChange(index, 'other_currencies', {
            currencyIndex: i,
            field: 'original_price',
            value: '',
            defaultCurrency: c.currency,
          });
        });
      }

      return newValue;
    });
  };

  return (
    <>
      {/* Tier basic info */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div>
          <label className='dark:text-white font-medium mb-1 block'>
            Tier Name <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            placeholder='Tier Name (e.g. VIP)'
            value={tier.name}
            onChange={(e) => onTierChange(index, 'name', e.target.value)}
          />
        </div>
        <div>
          <label className='dark:text-white font-medium mb-1 block'>
            Quantity <span className='text-red-500'>*</span>
          </label>
          <Input
            type='number'
            placeholder='Quantity'
            value={tier.quantity ?? ''}
            onChange={(e) => onTierChange(index, 'quantity', e.target.value)}
          />
        </div>
      </div>

      {/* Sale prices */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
        <div>
          <label className='dark:text-white font-medium mb-1 block'>
            Price (NGN) <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            placeholder='Sale Price'
            value={tier.amount ?? ''}
            onChange={(e) => onTierChange(index, 'amount', e.target.value)}
            required
          />
        </div>
        {foreignCurrencies()?.map((product_currency, i) => (
          <div key={i} className='flex-1'>
            <label className='dark:text-white font-medium mb-1 block'>
              Price ({product_currency.currency}){' '}
              <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name={`other_currencies[${i}].price`}
              className='w-full rounded-md'
              value={tier.other_currencies?.[i]?.price ?? ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      </div>

      {/* Checkbox toggle */}
      <div className='mt-3'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            name='show_crossed_out_prices'
            checked={showCrossedOutPrice}
            onChange={handleToggleCrossedOutPrice}
          />
          <span className='text-sm font-medium'>Show crossed-out prices</span>
        </label>
      </div>

      {/* Crossed-out prices (only if toggled ON) */}
      {showCrossedOutPrice && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3'>
          <div>
            <label className='dark:text-white font-medium mb-1 block'>
              Crossed-out Price (NGN) (Optional)
            </label>
            <Input
              type='text'
              placeholder='Original Price'
              value={tier.original_amount ?? ''}
              onChange={(e) =>
                onTierChange(index, 'original_amount', e.target.value)
              }
            />
          </div>

          {foreignCurrencies()?.map((product_currency, i) => (
            <div key={i} className='flex-1'>
              <label className='dark:text-white font-medium mb-1 block'>
                Crossed-out Price ({product_currency.currency}) (Optional)
              </label>
              <Input
                type='text'
                name={`other_currencies[${i}].original_price`}
                className='w-full rounded-md'
                value={tier.other_currencies?.[i]?.original_price ?? ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      )}

      {/* Remove button */}
      <div className='flex justify-end mt-3'>
        <button
          type='button'
          onClick={() => onRemoveTier(index)}
          className={cn(
            'text-red-600 hover:text-red-700 font-bold px-2 rounded',
            tier.purchased_tickets!?.length > 0 &&
              'dark:text-red-900 dak:hover:text-red-900 text-red-200 hover:text-red-200'
          )}
          aria-label={`Remove tier ${tier.name || index + 1}`}
          disabled={tier.purchased_tickets!?.length > 0}
          title={
            tier.purchased_tickets!?.length > 0
              ? 'This ticket tier has once been purchased'
              : ''
          }
        >
          <XIcon />
        </button>
      </div>
    </>
  );
};

const AddTicketForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { org } = useSelector((state: RootState) => state.org);

  const { formData, setFormData, resetForm, saveStatus } =
    useFormLocalSave<CreateTicketProps>(
      'draft_ticket_product',
      DEFAULT_FORM_VALUES
    );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOneDayEvent, setIsOneDayEvent] = useState(
    formData.event_start_date === formData.event_end_date
  );

  // Sync formData state when toggling one-day event
  useEffect(() => {
    if (isOneDayEvent && formData.event_start_date) {
      setFormData((prev) => ({
        ...prev,
        event_end_date: prev.event_start_date,
      }));
    }
  }, [isOneDayEvent, formData.event_start_date]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PNG and JPEG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const response = await dispatch(
        uploadImage({ form_data: formData, business_id: org?.id })
      ).unwrap();

      setFormData((prev) => ({
        ...prev,
        multimedia_id: response.multimedia.id,
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      multimedia_id: '',
    }));
    setImagePreview(null);
  };

  const handleTierChange = (
    tierIndex: number,
    field: string,
    value: string | OtherCurrencyFormFieldProps
  ) => {
    setFormData((prev) => {
      const updatedTiers = [...prev.ticket_tiers];
      const tier = { ...updatedTiers[tierIndex] } as TicketTierProps;

      if (field === 'other_currencies' && typeof value === 'object') {
        const {
          currencyIndex,
          field: subField,
          value: val,
          defaultCurrency,
        } = value;

        // Ensure other_currencies is always an array
        const updatedCurrencies: OtherCurrencyProps[] = Array.isArray(
          tier.other_currencies
        )
          ? [...tier.other_currencies]
          : [];

        // Ensure slot exists
        if (!updatedCurrencies[currencyIndex]) {
          updatedCurrencies[currencyIndex] = {
            currency: defaultCurrency,
            price: 0,
            original_price: undefined,
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

        tier.other_currencies = updatedCurrencies;
      } else {
        const numericFields = [
          'amount',
          'original_amount',
          'quantity',
          'remaining_quantity',
          'max_per_purchase',
        ];
        (tier as any)[field] = numericFields.includes(field) ? +value : value;
      }

      updatedTiers[tierIndex] = tier;

      return {
        ...prev,
        ticket_tiers: updatedTiers,
      };
    });
  };

  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      ticket_tiers: [
        ...prev.ticket_tiers,
        {
          name: '',
          amount: null,
          original_amount: null,
          description: undefined,
          quantity: undefined,
          remaining_quantity: undefined,
          max_per_purchase: undefined,
          default_view: false,
          status: TicketTierStatus.OPEN,
        },
      ],
    }));
  };

  const removeTier = (index: number) => {
    const updatedTiers = formData.ticket_tiers.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      ticket_tiers: updatedTiers,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const filtered_ticket_tiers = formData.ticket_tiers.map((tier) => {
        delete tier.purchased_tickets;
        return tier;
      });

      const input = {
        ...formData,
        keywords: formData.keywords ? formData.keywords : undefined,
      };

      // Remove unwanted
      delete (input as any).name;
      delete (input as any).cover_image;

      console.log(input);

      const { error, value } = createTicketSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const response = await dispatch(
        createTicket({
          credentials: {
            ...input,
            ticket_tiers: filtered_ticket_tiers.map((tier) => ({
              ...tier,
              amount: +tier.amount!,
              original_amount: +tier.original_amount!,
            })),
          },
          business_id: org?.id!,
        })
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

      toast.success('Ticket created successfully!');
      resetForm(); // ✨ Clears memory + resets form
      router.push(`/products/tickets`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.slug &&
    formData.description &&
    formData.category_id &&
    formData.event_end_date &&
    formData.event_start_date &&
    formData.multimedia_id &&
    formData.event_location &&
    formData.event_type &&
    formData.auth_details &&
    formData.ticket_tiers.length > 0;

  const renderDateField = (label: string, name: string, value: string) => (
    <div>
      <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
        {label} <span className='text-red-500'>*</span>
      </label>
      <Input
        type='date'
        name={name}
        value={value}
        onChange={handleInputChange}
        required={name === 'event_start_date'}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='relative bg-white dark:bg-gray-800 rounded-md shadow p-6 space-y-6'
    >
      <AutosaveIndicator status={saveStatus} />

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Title <span className='text-red-500'>*</span>
        </label>
        <Input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='grid lg:grid-cols-2 gap-2'>
        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Shortlink <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              type='text'
              name='slug'
              value={formData.slug}
              onChange={handleInputChange}
              required
              className='w-full rounded-md pl-9'
            />
          </div>

          {/* Live preview */}
          {formData.slug && (
            <p className='mt-2 text-sm '>
              Preview:{' '}
              <span className='text-primary-main dark:text-primary-faded font-medium'>
                {baseUrl}/{formData.slug}
              </span>
            </p>
          )}
        </div>
        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Event Location <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            name='event_location'
            value={formData.event_location}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <label className='text-sm font-medium mb-1 block text-gray-700 dark:text-white'>
          Category <span className='text-red-500'>*</span>
        </label>
        <Select
          value={formData.category_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category_id: value }))
          }
          required
        >
          <SelectTrigger id='category' className='w-full'>
            <SelectValue placeholder='Select your category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map(
              (category: { id: string; name: string }, index: number) => (
                <SelectItem key={index} value={category.id}>
                  {category.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Description <span className='text-red-500'>*</span>
        </label>

        <Suspense fallback={<div>Loading editor...</div>}>
          <TinyMceEditor
            value={formData.description!}
            onChange={(value: any) =>
              setFormData((prev) => ({ ...prev, description: value! }))
            }
            height={200}
          />
        </Suspense>
      </div>

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Type <span className='text-red-500'>*</span>
        </label>
        <div className='flex gap-4'>
          {Object.values(EventType).map((type) => (
            <label
              key={type}
              className='flex items-center gap-2 text-gray-700 dark:text-white'
            >
              <input
                type='radio'
                checked={formData.event_type === type}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, event_type: type }))
                }
              />
              {capitalize(type)}
            </label>
          ))}
        </div>
      </div>

      <ImageUpload
        imagePreview={imagePreview}
        uploadingImage={uploadingImage}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
      />

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Is it a one-day event? <span className='text-red-500'>*</span>
        </label>
        <div className='flex gap-4'>
          <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
            <input
              type='radio'
              name='one-day-event'
              checked={isOneDayEvent}
              onChange={() => setIsOneDayEvent(true)}
            />
            Yes
          </label>
          <label className='flex items-center gap-2 text-gray-700 dark:text-white'>
            <input
              type='radio'
              name='one-day-event'
              checked={!isOneDayEvent}
              onChange={() => setIsOneDayEvent(false)}
            />
            No
          </label>
        </div>
      </div>

      {isOneDayEvent ? (
        renderDateField(
          'Event Date',
          'event_start_date',
          moment(formData.event_start_date).format('YYYY-MM-DD')
        )
      ) : (
        <div className='grid md:grid-cols-2 gap-4'>
          {renderDateField(
            'Start Date',
            'event_start_date',
            moment(formData.event_start_date).format('YYYY-MM-DD')
          )}
          {renderDateField(
            'End Date',
            'event_end_date',
            moment(formData.event_end_date).format('YYYY-MM-DD')
          )}
        </div>
      )}

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          Event Time <span className='text-red-500'>*</span>
        </label>
        <Input
          type='time'
          name='event_time'
          value={formData.event_time}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
            Keywords
          </label>
          <Input
            type='text'
            name='keywords'
            value={formData.keywords}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className='font-medium mb-1 block text-gray-700 dark:text-white'>
            Status <span className='text-red-500'>*</span>
          </label>
          <Select
            value={formData.status!}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value as any }))
            }
            required
          >
            <SelectTrigger id='status' className='w-full'>
              <SelectValue placeholder='Select your status' />
            </SelectTrigger>
            <SelectContent>
              {[ProductStatus.DRAFT, ProductStatus.PUBLISHED].map(
                (status, index) => (
                  <SelectItem key={index} value={status}>
                    {status}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className='block font-medium mb-1 text-gray-700 dark:text-white'>
          What do you want to them to know after ticket payments?{' '}
          <span className='text-red-500'>*</span>
        </label>
        <Textarea
          name='auth_details'
          value={formData.auth_details}
          onChange={handleInputChange as any}
          required
        />
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-primary-main dark:text-primary-faded'>
          Ticket Tiers <span className='text-red-500'>*</span>
        </h3>

        {formData.ticket_tiers.map((tier, index) => (
          <TicketTier
            key={index}
            tier={tier}
            index={index}
            onTierChange={handleTierChange}
            onRemoveTier={removeTier}
          />
        ))}

        <div className='flex justify-end'>
          <button
            type='button'
            onClick={addTier}
            className='bg-primary-main text-white px-4 py-2 rounded-md hover:bg-primary-dark'
          >
            Add Tier
          </button>
        </div>
      </div>

      <div className='mt-6'>
        <button
          type='submit'
          disabled={isSubmitting || !isFormValid}
          className={cn(
            'bg-primary-main text-white px-6 py-2 rounded-md hover:bg-primary-dark transition',
            (isSubmitting || !isFormValid) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
};

export default AddTicketForm;
