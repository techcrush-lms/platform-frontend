'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  CreateDigitalProductProps,
  createDigitalProductSchema,
  CreatePhysicalProductProps,
  createPhysicalProductSchema,
  PhysicalProductGender,
  PhysicalProductType,
} from '@/lib/schema/product.schema';
import {
  allowedTypes,
  baseUrl,
  cn,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  OnboardingProcess,
  ProductStatus,
  ProductType,
} from '@/lib/utils';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  uploadImage,
  uploadRawDocument,
  uploadVideo,
} from '@/redux/slices/multimediaSlice';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'react-quill/dist/quill.snow.css';
import { createDigitalProduct } from '@/redux/slices/digitalProductSlice';
import { updateOnboardingProcess } from '@/redux/slices/orgSlice';
import { Badge } from '@/components/ui/badge';
import TinyMceEditor from '@/components/editor/TinyMceEditor';
import { Globe, XCircleIcon, XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useCurrencies from '@/hooks/page/useCurrencies';
import { createPhysicalProduct } from '@/redux/slices/physicalProductSlice';
import { useFormLocalSave } from '@/hooks/useFormLocalSave';
import AutosaveIndicator from '@/components/AutosaveIndicator';

const defaultValue: CreatePhysicalProductProps = {
  title: '',
  slug: uuidv4().split('-')[0],
  description: '',
  category_id: '',
  multimedia_id: '',
  status: ProductStatus.PUBLISHED,
  price: 0,
  original_price: 0,
  keywords: '',
  other_currencies: [],
  details: {
    sizes: [],
    colors: [],
    location: '',
    stock: null,
    type: PhysicalProductType.PRODUCT,
    gender: PhysicalProductGender.UNISEX,
    estimated_production_time: null,
    min_required: null,
    multimedia_ids: [],
  },
};

const STORAGE_KEY = 'physical_product_draft';

const AddPhysicalProductForm = () => {
  // const [formData, setFormData] =
  //   useState<CreatePhysicalProductProps>(defaultValue);
  const { formData, setFormData, resetForm, saveStatus } =
    useFormLocalSave<CreatePhysicalProductProps>(
      'draft_physical_product',
      defaultValue
    );
  const [showCrossedOutPrice, setShowCrossedOutPrice] = useState(false);

  const [errors, setErrors] = useState<Partial<CreatePhysicalProductProps>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [zipFilePreview, setZipFilePreview] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingZipFile, setUploadingZipFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);
  const [zipFileName, setZipFileName] = useState('');
  // const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { foreignCurrencies } = useCurrencies();
  const { org } = useSelector((state: RootState) => state.org);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'original_price'
          ? Number(value) || 0
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreatePhysicalProductProps]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects
    if (errors[name as keyof CreatePhysicalProductProps]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileUpload = async (file: File): Promise<void> => {
    if (!file) return;

    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic', // iPhone photos (newer)
      'image/heif', // iPhone photos (high efficiency)
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Only images (JPEG, PNG, WEBP, HEIC/HEIF) and videos (MP4, MOV, WEBM) are allowed'
      );
      return;
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      toast.error('Image must be less than 5MB');
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      toast.error('Video must be less than 50MB');
      return;
    }

    setUploadingFile(true);

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

      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;

    const isImage = file.type.startsWith('image/');

    if (isImage) {
      handleFileUpload(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      multimedia_id: '',
    }));
    setImagePreview(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      multimedia_id: '',
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDigitalProductProps> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.multimedia_id) {
      newErrors.multimedia_id = 'Product image is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsSubmitting(true);

      const input = {
        ...formData,
        keywords: formData.keywords ? formData.keywords : undefined,
      };

      const { error, value } = createPhysicalProductSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const response = await dispatch(
        createPhysicalProduct({
          credentials: {
            ...input,
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

      toast.success('Physical product created successfully!');
      resetForm(); // ✨ Clears memory + resets form
      router.push(`/products/physical-products`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-seed other_currencies so inputs always exist
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      other_currencies: foreignCurrencies()?.map((c: any, i: number) => ({
        currency: c.currency,
        price: prev.other_currencies?.[i]?.price ?? 0,
        original_price: prev.other_currencies?.[i]?.original_price ?? 0,
      })),
    }));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      setFormData((prev) => ({
        ...prev,
        ...parsed,
        details: { ...prev.details, ...(parsed.details || {}) },
        other_currencies: parsed.other_currencies ?? prev.other_currencies,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const isFormValid =
    formData.title &&
    formData.slug &&
    formData.description &&
    formData.category_id &&
    formData.multimedia_id &&
    formData.status &&
    formData.price &&
    formData.details;

  return (
    <form
      onSubmit={handleSubmit}
      className='relative bg-white dark:bg-gray-800 dark:text-white rounded-md shadow p-6 space-y-6'
    >
      <AutosaveIndicator status={saveStatus} />
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
          onChange={handleInputChange}
          className={cn(
            'lg:text-2xl font-bold',
            errors.title && 'border-red-500'
          )}
          required
        />
        {errors.title && (
          <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          Description <span className='text-red-500'>*</span>
        </label>
        <div className='quill-container'>
          <Suspense fallback={<div>Loading editor...</div>}>
            <TinyMceEditor
              value={formData.description}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
              height={200}
            />
          </Suspense>
        </div>
        {errors.description && (
          <p className='text-red-500 text-xs mt-1'>{errors.description}</p>
        )}
      </div>

      <div className='grid lg:grid-cols-2 gap-2'>
        <div>
          <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-white'>
            Shortlink <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              type='text'
              name='slug'
              value={formData.slug}
              onChange={handleInputChange}
              placeholder='Enter your shortlink'
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
            onValueChange={(value) => handleSelectChange('category_id', value)}
          >
            <SelectTrigger
              className={cn(errors.category_id && 'border-red-500')}
            >
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className='text-red-500 text-xs mt-1'>{errors.category_id}</p>
          )}
        </div>
      </div>

      <div className='flex gap-3 w-full'>
        {/* Price */}
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-1'>
            Price (NGN) <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            name='price'
            placeholder='Enter price'
            value={formData.price}
            onChange={handleInputChange}
            className={cn('py-3', errors.price && 'border-red-500')}
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
              className='w-full rounded-md py-3'
              value={formData.other_currencies?.[index]?.price}
              onChange={handleInputChange}
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
            <label className='text-sm font-medium mb-1 block'>
              Crossed-out Price (NGN) (Optional)
            </label>
            <Input
              type='text'
              name='original_price'
              value={formData.original_price!}
              onChange={handleInputChange}
              className={cn('py-3', errors.original_price && 'border-red-500')}
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
                className='w-full rounded-md py-3'
                value={formData.other_currencies?.[i]?.original_price}
                onChange={handleInputChange}
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
            onChange={handleInputChange}
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

      {/* Product Image */}
      <div>
        <label className='block text-sm font-medium mb-2'>
          Product Image <span className='text-red-500'>*</span>
        </label>

        {/* Upload Card */}
        <div
          className='relative flex flex-col items-center justify-center w-full sm:w-72 h-56 rounded-md bg-primary-main text-white p-4 text-center cursor-pointer overflow-hidden'
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt='Preview'
              className='w-full h-full object-cover rounded-md'
            />
          ) : (
            <>
              <img
                src='/icons/course/file.svg'
                alt='upload icon'
                className='mb-2 w-10 h-10'
              />
              <p className='font-medium'>Upload, Drag or drop image</p>
              <p className='text-xs'>
                Supported Format: png, jpeg. Max size is 5MB
              </p>
            </>
          )}

          {/* Uploading Overlay */}
          {uploadingFile && (
            <div className='absolute inset-0 bg-[#000]/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 px-4'>
              <p className='font-semibold text-white text-sm mb-3'>
                Uploading...
              </p>
              {/* <div className='w-full bg-white/30 rounded-full h-2'>
                <div
                  className='bg-white h-2 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div> */}
            </div>
          )}

          <input
            type='file'
            accept='image/png, image/jpeg, image/webp, image/heic, image/heif'
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Physical Product Details */}
      <div className='space-y-6 border-t pt-6'>
        <h3 className='text-lg font-semibold border-b pb-2 dark:border-gray-700'>
          Product Details
        </h3>

        {/* Location & Stock */}
        <div className='grid md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Location <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='details.location'
              placeholder='Enter warehouse or store location'
              value={formData.details.location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  details: { ...prev.details, location: e.target.value },
                }))
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Stock Quantity <span className='text-red-500'>*</span>
            </label>
            <Input
              type='number'
              min={0}
              name='details.stock'
              placeholder='Enter stock quantity'
              value={formData.details.stock!}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  details: { ...prev.details, stock: +e.target.value },
                }))
              }
            />
          </div>
        </div>

        {/* Type & Gender */}
        <div className='grid md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Product Type <span className='text-red-500'>*</span>
            </label>
            <Select
              value={formData.details.type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    type: value as PhysicalProductType,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select product type' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PhysicalProductType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Gender <span className='text-red-500'>*</span>
            </label>
            <Select
              value={formData.details.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    gender: value as PhysicalProductGender,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PhysicalProductGender).map((g) => (
                  <SelectItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className='grid md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium mb-1'>Sizes</label>

            <Input
              type='text'
              placeholder='e.g. S, M, L, XL'
              value={formData.details.sizes?.join(', ') || ''}
              onChange={(e) => {
                const rawValue = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    // keep the string as-is while typing
                    sizes: rawValue.split(',').map((s) => s.trim()),
                  },
                }));
              }}
            />
            <p className='text-xs text-gray-500'>Separate sizes with commas</p>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Colors</label>
            <Input
              type='text'
              placeholder='e.g. Red, Blue, Black'
              value={formData.details.colors?.join(', ') || ''}
              onChange={(e) => {
                const rawValue = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    // keep commas while typing
                    colors: rawValue.split(',').map((c) => c.trim()),
                  },
                }));
              }}
            />
            <p className='text-xs text-gray-500'>Separate colors with commas</p>
          </div>
        </div>

        {formData.details.type === PhysicalProductType.BESPOKE && (
          <>
            {/* Estimated Production Time & Minimum Required */}
            <div className='grid md:grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Estimated Production Time (in days)
                </label>
                <Input
                  type='number'
                  min={0}
                  value={formData.details.estimated_production_time!}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        estimated_production_time: +e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Minimum Required Before Production
                </label>
                <Input
                  type='number'
                  min={0}
                  value={formData.details.min_required!}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      details: {
                        ...prev.details,
                        min_required: +e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Extra Multimedia Upload (details.multimedia_ids) */}
        <div>
          <label className='block text-sm font-medium mb-2'>
            Additional Product Media (Optional)
          </label>
          <input
            type='file'
            multiple
            accept={allowedTypes.join(',')}
            onChange={async (e) => {
              const files = e.target.files!;
              if (!files?.length) return;

              const uploadedIds: string[] = [];
              const uploadedFiles: string[] = [];

              for (const file of Array.from(files)) {
                // Validate allowed type
                if (!allowedTypes.includes(file.type)) {
                  toast.error(
                    'Unsupported file. Allowed: JPG, PNG, WEBP, HEIC, MP4, MOV, WEBM'
                  );
                  continue;
                }

                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');

                // Validate size separately
                if (isImage && file.size > MAX_IMAGE_SIZE) {
                  toast.error(`Image '${file.name}' must be below 5MB`);
                  continue;
                }

                if (isVideo && file.size > MAX_VIDEO_SIZE) {
                  toast.error(`Video '${file.name}' must be below 50MB`);
                  continue;
                }

                try {
                  const formData = new FormData();

                  let response = null;
                  if (isImage) {
                    formData.append('image', file);
                    response = await dispatch(
                      uploadImage({ form_data: formData, business_id: org?.id })
                    ).unwrap();
                  } else if (isVideo) {
                    formData.append('video', file);
                    response = await dispatch(
                      uploadVideo({ form_data: formData, business_id: org?.id })
                    ).unwrap();
                  } else {
                  }

                  if (response) {
                    uploadedIds.push(response.multimedia.id);
                    uploadedFiles.push(response.multimedia.url);
                  }
                } catch (err) {
                  toast.error(`Failed to upload ${file.name}`);
                }
              }

              if (uploadedIds.length) {
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    multimedia_ids: [
                      ...prev.details.multimedia_ids!,
                      ...uploadedIds,
                    ],
                  },
                }));

                setMediaFiles((prev) => [...prev, ...uploadedFiles]);
                toast.success('Media uploaded successfully');
              }
            }}
          />

          {/* PREVIEW SECTION — supports image or video */}
          {formData.details.multimedia_ids!.length > 0 && (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3'>
              {mediaFiles.map((fileUrl, i) => {
                const isVideo = fileUrl.match(/\.(mp4|mov|webm)$/i);

                return (
                  <div key={i} className='relative'>
                    {isVideo ? (
                      <video
                        src={fileUrl}
                        controls
                        className='w-full h-60 rounded-md border object-cover bg-black'
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt='media'
                        className='w-full h-60 rounded-md border object-cover'
                      />
                    )}

                    <button
                      type='button'
                      className='absolute top-1 right-1 bg-black/60 text-white rounded-full p-1'
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          details: {
                            ...prev.details,
                            multimedia_ids: prev.details.multimedia_ids!.filter(
                              (m) => m !== prev.details.multimedia_ids![i]
                            ),
                          },
                        }))
                      }
                    >
                      <XCircleIcon className='hover:text-red-400' />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' variant='outline' disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='primary'
          disabled={isSubmitting || !isFormValid}
          className='min-w-[120px]'
        >
          {isSubmitting ? (
            <>
              <LoadingIcon className='w-4 h-4 mr-2' />
              Processing...
            </>
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddPhysicalProductForm;
