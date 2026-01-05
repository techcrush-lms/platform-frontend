'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'react-quill/dist/quill.snow.css';
import FileUploadCard from '@/components/dashboard/FileUploadCard';
import { useFileUploader } from '@/hooks/useFileUploader';
import useProductCategory from '@/hooks/page/useProductCategory';
import useDigitalProduct from '@/hooks/page/useDigitalProduct';
import {
  UpdateDigitalProductProps,
  updateDigitalProductSchema,
} from '@/lib/schema/product.schema';
import { baseUrl, cn, OnboardingProcess, ProductStatus } from '@/lib/utils';
import {
  setOnboardingStep,
  updateOnboardingProcess,
} from '@/redux/slices/orgSlice';
import { updateDigitialProduct } from '@/redux/slices/digitalProductSlice';
import { AppDispatch, RootState } from '@/redux/store';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import TinyMceEditor from '@/components/editor/TinyMceEditor';
import { Globe } from 'lucide-react';
import useCurrencies from '@/hooks/page/useCurrencies';

const defaultValue: UpdateDigitalProductProps = {
  title: '',
  slug: '',
  description: '',
  category_id: '',
  multimedia_id: '',
  multimedia_zip_id: '',
  status: ProductStatus.PUBLISHED,
  price: 0,
  original_price: 0,
  keywords: '',
  other_currencies: [],
};

const EditDigitalProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { foreignCurrencies } = useCurrencies();

  const { digital_product } = useSelector(
    (state: RootState) => state.digitalProduct
  );
  const { org } = useSelector((state: RootState) => state.org);

  const [formData, setFormData] =
    useState<UpdateDigitalProductProps>(defaultValue);
  const [showCrossedOutPrice, setShowCrossedOutPrice] = useState(false);

  const [errors, setErrors] = useState<Partial<UpdateDigitalProductProps>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUploader = useFileUploader({ type: 'image', maxSizeMB: 5 });
  const zipUploader = useFileUploader({ type: 'zip', maxSizeMB: 100 });

  const [previewImage, setPreviewImage] = useState('');
  const [previewZipImage, setPreviewZipImage] = useState('');
  const [previewZipName, setPreviewZipName] = useState('');

  // Handle input changes (supports nested other_currencies)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('other_currencies')) {
      const match = name.match(/other_currencies\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        setFormData((prev: any) => {
          // Ensure it's always an array
          const updated = Array.isArray(prev.other_currencies)
            ? [...prev.other_currencies]
            : [];

          // Ensure slot exists
          if (!updated[index]) {
            updated[index] = {
              currency: foreignCurrencies()?.[index]?.currency || '',
              price: 0,
              original_price: undefined,
            };
          }

          updated[index] = {
            ...updated[index],
            [field]:
              field === 'original_price'
                ? value
                  ? +value
                  : undefined
                : value
                ? +value
                : 0,
          };

          return { ...prev, other_currencies: updated };
        });
        return;
      }
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // inside your component
  const handleToggleCrossedOutPrice = () => {
    setShowCrossedOutPrice((prev) => {
      const newValue = !prev;

      if (!newValue) {
        // ✅ Clear crossed-out prices if toggled OFF
        setFormData((prevBody) => ({
          ...prevBody,
          original_price: null, // use null instead of undefined ✅
          other_currencies: Array.isArray(prevBody.other_currencies)
            ? prevBody.other_currencies.map((c: any) => ({
                ...c,
                original_price: null, // match type number | null
              }))
            : [],
        }));
      }

      return newValue;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = { ...formData, keywords: formData.keywords || undefined };

    try {
      setIsSubmitting(true);
      const { error } = updateDigitalProductSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const response = await dispatch(
        updateDigitialProduct({
          id: digital_product?.id!,
          credentials: input,
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

      toast.success('Digital product saved successfully!');
      router.push(`/products/digital-products`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (digital_product) {
      setFormData({
        title: digital_product.title,
        slug: digital_product.slug,
        description: digital_product.description,
        price: +digital_product.price,
        original_price: +digital_product.original_price!,
        category_id: digital_product.category?.id,
        status: digital_product.status,
        keywords: digital_product?.keywords!,
        multimedia_id: digital_product?.multimedia?.id,
        multimedia_zip_id: digital_product?.zip_file?.id,
        other_currencies: digital_product.other_currencies,
      });

      setShowCrossedOutPrice(Boolean(+digital_product?.original_price!));
      setPreviewImage(digital_product.multimedia?.url);
      setPreviewZipImage(digital_product.zip_file && '/icons/zip.png');
      setPreviewZipName(digital_product.zip_file?.url);
    }
  }, [digital_product, previewImage, previewZipImage, previewZipName]);

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-gray-800 dark:text-white rounded-md shadow p-6 space-y-6'
    >
      {/* Title */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Title <span className='text-red-500'>*</span>
        </label>
        <Input
          type='text'
          name='title'
          placeholder='Enter title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn(errors.title && 'border-red-500')}
        />
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Description <span className='text-red-500'>*</span>
        </label>
        <div className='quill-container'>
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
      </div>

      <div className='grid lg:grid-cols-2 gap-2'>
        <div>
          <label className='block font-medium text-sm mb-1 text-gray-700 dark:text-white'>
            Shortlink <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              type='text'
              name='slug'
              value={formData.slug!}
              onChange={(e: any) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
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
        {/* Category */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Category <span className='text-red-500'>*</span>
          </label>
          <Select
            value={formData.category_id}
            onValueChange={(val) =>
              setFormData({ ...formData, category_id: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex gap-3 w-full'>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>
            Price (NGN) <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            name='text'
            placeholder='Enter price'
            value={formData.price || ''}
            onChange={(e) =>
              setFormData({ ...formData, price: +e.target.value })
            }
            min='0'
            step='0.01'
            className={cn(errors.price && 'border-red-500')}
            required
          />
          <p className='mt-2 text-xs'>Zero (0) represents a free product</p>

          {errors.price && (
            <p className='text-red-500 text-xs mt-1'>{errors.price}</p>
          )}
        </div>

        {foreignCurrencies()?.map((product_currency, index) => (
          <div key={index} className='flex-1'>
            <label className='text-sm font-medium mb-1 block'>
              Price ({product_currency.currency}) *
            </label>
            <Input
              type='text'
              name={`other_currencies[${index}].price`}
              className='w-full rounded-md'
              value={formData.other_currencies?.[index]?.price}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      </div>

      {/* Checkbox toggle */}
      <div>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            name='show_crossed_out_prices'
            checked={showCrossedOutPrice}
            onChange={handleToggleCrossedOutPrice} // ✅ clean function
          />
          <span className='text-sm font-medium'>Show crossed-out prices</span>
        </label>
      </div>

      {/* Crossed-out price inputs */}
      {showCrossedOutPrice && (
        <div className='flex gap-3 w-full mt-3'>
          {/* NGN input */}
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>
              Crossed-out Price (NGN) (Optional)
            </label>
            <Input
              type='text'
              name='original_price'
              placeholder='Enter crossed-out price'
              value={formData.original_price || ''}
              onChange={(e) =>
                setFormData({ ...formData, original_price: +e.target.value })
              }
              min='0'
              step='0.01'
              className={cn(errors.original_price && 'border-red-500')}
            />
            {errors.original_price && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.original_price}
              </p>
            )}
          </div>

          {/* Foreign currencies */}
          {foreignCurrencies()?.map((c, i) => (
            <div key={i} className='flex-1'>
              <label className='text-sm font-medium mb-1 block'>
                Crossed-out Price ({c.currency}) (Optional)
              </label>

              <Input
                type='text'
                name={`other_currencies[${i}].original_price`}
                className='w-full rounded-md'
                value={formData.other_currencies?.[i]?.original_price}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      )}

      <div className='grid grid-cols-2 gap-2'>
        {/* Keywords */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Keywords (optional)
          </label>
          <Input
            type='text'
            name='keywords'
            placeholder='Enter keywords (comma separated)'
            value={formData.keywords || ''}
            onChange={(e) =>
              setFormData({ ...formData, keywords: e.target.value })
            }
          />
        </div>

        <div>
          <label className='font-medium text-sm mb-1 block text-gray-700 dark:text-white'>
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

      {/* Uploaders */}
      <FileUploadCard
        preview={imageUploader.preview || previewImage}
        uploading={imageUploader.uploading}
        accept='image/png,image/jpeg'
        onFileSelect={(f) =>
          imageUploader.handleUpload(f, (id) =>
            setFormData({ ...formData, multimedia_id: id })
          )
        }
        placeholder={{
          icon: '/icons/course/file.svg',
          title: 'Upload, Drag or Drop Image',
          description: 'Supported: png, jpeg. Max 5MB',
        }}
      />

      <FileUploadCard
        preview={zipUploader.preview || previewZipImage}
        fileName={zipUploader.fileName || previewZipName}
        uploading={zipUploader.uploading}
        accept='.zip'
        onFileSelect={(f) =>
          zipUploader.handleUpload(f, (id) =>
            setFormData({ ...formData, multimedia_zip_id: id })
          )
        }
        placeholder={{
          icon: '/icons/zip.png',
          title: 'Upload, Drag or Drop ZIP File',
          description: 'Format: .zip. Max 100MB',
        }}
      />

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoadingIcon /> Saving...
          </>
        ) : (
          'Save Product'
        )}
      </Button>
    </form>
  );
};

export default EditDigitalProductForm;
