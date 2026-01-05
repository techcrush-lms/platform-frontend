'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  CreateDigitalProductProps,
  createDigitalProductSchema,
} from '@/lib/schema/product.schema';
import { baseUrl, cn, OnboardingProcess, ProductStatus } from '@/lib/utils';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { uploadImage, uploadRawDocument } from '@/redux/slices/multimediaSlice';
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
import { Globe } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useCurrencies from '@/hooks/page/useCurrencies';

const defaultValue: CreateDigitalProductProps = {
  title: '',
  slug: uuidv4().split('-')[0],
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

const AddDigitalProductForm = () => {
  const [formData, setFormData] =
    useState<CreateDigitalProductProps>(defaultValue);
  const [showCrossedOutPrice, setShowCrossedOutPrice] = useState(false);

  const [errors, setErrors] = useState<Partial<CreateDigitalProductProps>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [zipFilePreview, setZipFilePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingZipFile, setUploadingZipFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);
  const [zipFileName, setZipFileName] = useState('');

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
    if (errors[name as keyof CreateDigitalProductProps]) {
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
    if (errors[name as keyof CreateDigitalProductProps]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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

  const handleZipFileUpload = async (file: File): Promise<void> => {
    if (!file) return;

    // ✅ Allow only ZIP files
    const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
      toast.error('Only .zip files are allowed');
      return;
    }

    // ✅ Check file size (example: max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size should be less than 100MB');
      return;
    }

    setUploadingZipFile(true);

    try {
      const formData = new FormData();
      formData.append('document', file);

      // Preview not useful for ZIPs (remove or show filename instead)
      setZipFilePreview('/icons/zip.png');
      setZipFileName(file.name);

      const response = await dispatch(
        uploadRawDocument({ form_data: formData, business_id: org?.id })
      ).unwrap();

      setFormData((prev) => ({
        ...prev,
        multimedia_zip_id: response.multimedia.id,
      }));

      toast.success('ZIP file uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload ZIP file');
    } finally {
      setUploadingZipFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleZipFileUpload(file);
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
      handleImageUpload(file);
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

    console.log(formData);

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

      const { error, value } = createDigitalProductSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const response = await dispatch(
        createDigitalProduct({
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

      toast.success('Digital product created successfully!');
      router.push(`/products/digital-products`);
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

  const isFormValid =
    formData.title &&
    formData.slug &&
    formData.description &&
    formData.category_id &&
    formData.multimedia_id &&
    formData.multimedia_zip_id &&
    formData.status &&
    formData.price;

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
          {uploadingImage && (
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
            accept='image/png, image/jpeg'
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Digital product (zipped file) */}
      <div>
        <label className='block text-sm font-medium mb-2'>
          Upload Digital Product (ZIP) <span className='text-red-500'>*</span>
        </label>

        {/* Upload Card */}
        <div
          className='relative flex flex-col items-center justify-center w-full sm:w-72 h-56 rounded-xl border-2 border-dashed border-primary-main dark:border-primary-faded bg-primary-main/10 text-primary-main dark:text-primary-faded p-4 text-center cursor-pointer hover:bg-primary-main/20 transition-all duration-300'
          onClick={() => zipFileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {zipFilePreview ? (
            <>
              <img
                src={zipFilePreview}
                alt='Preview'
                className='w-full h-full object-cover rounded-md'
              />
              {zipFileName && <Badge>{zipFileName}</Badge>}
            </>
          ) : (
            <>
              <img
                src='/icons/zip.png'
                alt='upload icon'
                className='mb-3 w-12 h-12 opacity-80'
              />
              <p className='font-semibold text-sm'>
                Upload, drag or drop your zipped file
              </p>
              <p className='text-xs mt-1'>
                Recommended Format: <span className='font-medium'>.zip</span>{' '}
                <br />
                Max size: 100MB
              </p>
            </>
          )}

          {/* Uploading Overlay */}
          {uploadingZipFile && (
            <div className='absolute inset-0 bg-primary-main/90 backdrop-blur-sm flex flex-col justify-center items-center z-10 px-4 rounded-xl'>
              <p className='font-semibold text-white text-sm mb-3'>
                Uploading...
              </p>
            </div>
          )}

          <input
            type='file'
            accept='.zip'
            hidden
            ref={zipFileInputRef}
            onChange={handleZipFileChange}
          />
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

export default AddDigitalProductForm;
