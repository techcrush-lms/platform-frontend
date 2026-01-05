'use client';

import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import ThemeDiv from '@/components/ui/ThemeDiv';
import React, { useState, useRef, useEffect } from 'react';
import useProductCategory from '@/hooks/page/useProductCategory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateCourseProps,
  CreateCourseSchema,
} from '@/lib/schema/product.schema';
import { cn, OnboardingProcess } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import { createCourse } from '@/redux/slices/courseSlice';
import { updateOnboardingProcess } from '@/redux/slices/orgSlice';
import { Globe } from 'lucide-react';
import useCurrencies from '@/hooks/page/useCurrencies';

const defaultValue = {
  title: '',
  slug: uuidv4().split('-')[0],
  description: '',
  multimedia_id: '',
  price: 0,
  original_price: 0,
  category_id: '',
  other_currencies: [],
};

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL; // change to your actual base URL

const AddCourseForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { foreignCurrencies } = useCurrencies();
  const { org } = useSelector((state: RootState) => state.org);

  const [body, setBody] = useState<CreateCourseProps>({ ...defaultValue });
  const [showCrossedOutPrice, setShowCrossedOutPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

        setBody((prev: any) => {
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

    setBody((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size should be less than 5MB');
    }

    setUploadingImage(true);

    try {
      // Simulate upload
      const formData = new FormData();
      formData.append('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const response: any = await dispatch(
        uploadImage({
          form_data: formData,
          business_id: org?.id,
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / (event.total || 1)
            );
            setUploadProgress(percent);
          },
        })
      );

      if (response.type === 'multimedia-upload/image/rejected') {
        throw new Error(response.payload.message);
      }

      setBody((prev) => ({
        ...prev,
        multimedia_id: response.payload.multimedia.id,
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadProgress(0);
      setUploadingImage(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);
      const { error, value } = CreateCourseSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response = await dispatch(
        createCourse({
          credentials: {
            ...body,
            price: +body.price!,
            original_price: +body.original_price!,
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

      toast.success('Course created successfully!');
      router.push(`/products/courses/${response.data.id}/contents`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // inside your component
  const handleToggleCrossedOutPrice = () => {
    setShowCrossedOutPrice((prev) => {
      const newValue = !prev;

      if (!newValue) {
        // ✅ Clear crossed-out prices if toggled OFF
        setBody((prevBody) => ({
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

  // Auto-seed other_currencies so inputs always exist
  useEffect(() => {
    setBody((prev: any) => ({
      ...prev,
      other_currencies: foreignCurrencies()?.map((c: any, i: number) => ({
        currency: c.currency,
        price: prev.other_currencies?.[i]?.price ?? 0,
        original_price: prev.other_currencies?.[i]?.original_price ?? 0,
      })),
    }));
  }, []);

  const isFormValid =
    body.title &&
    body.slug &&
    body.description &&
    body.category_id &&
    body.price &&
    body.multimedia_id;

  return (
    <ThemeDiv className='mt-6 p-6'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <Input
          type='text'
          name='title'
          placeholder='Your Course Title Goes Here'
          className='w-full border rounded-md px-4 lg:text-2xl text-gray-600 dark:text-white placeholder-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 font-bold'
          value={body.title}
          onChange={handleChange}
          required
        />

        {/* Upload Card */}
        <div
          className='relative flex flex-col items-center justify-center w-full sm:w-64 h-56 rounded-md bg-primary-main text-white p-4 text-center cursor-pointer overflow-hidden'
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
                Uploading... {uploadProgress}%
              </p>
              <div className='w-full bg-white/30 rounded-full h-2'>
                <div
                  className='bg-white h-2 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
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

        {/* Category and Short link Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium mb-1 block'>
              Category <span className='text-red-500'>*</span>
            </label>
            <Select
              value={body.category_id}
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
            <label className='text-sm font-medium mb-1 block'>
              Shortlink <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                type='text'
                name='slug'
                className='w-full rounded-md pl-9'
                value={body.slug!}
                onChange={handleChange}
                required
              />
            </div>

            {/* Live preview */}
            {body.slug && (
              <p className='mt-2 text-sm '>
                Preview:{' '}
                <span className='text-primary-main dark:text-primary-faded font-medium'>
                  {baseUrl}/{body.slug}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className='flex gap-3 w-full'>
          <div className='flex-1'>
            <label className='text-sm font-medium mb-1 block'>
              Price (NGN)<span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name='price'
              className='w-full rounded-md py-3'
              value={body.price!}
              onChange={handleChange}
              required
            />
            <p className='mt-2 text-xs'>Zero (0) represents a free product</p>
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
                value={body.other_currencies?.[index]?.price}
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
              <label className='text-sm font-medium mb-1 block'>
                Crossed-out Price (NGN) (Optional)
              </label>
              <Input
                type='text'
                name='original_price'
                className='w-full rounded-md py-3'
                value={body.original_price!}
                onChange={handleChange}
              />
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
                  value={body.other_currencies?.[i]?.original_price}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <label className='text-sm font-medium mb-1 block'>
            Description <span className='text-red-500'>*</span>
          </label>
          <Textarea
            rows={3}
            name='description'
            placeholder='Enter Course Description'
            className='w-full rounded-md px-4 py-3'
            value={body.description}
            onChange={(e) =>
              setBody((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        {/* Submit */}
        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={!isFormValid || isSubmitting}
            className={cn(
              'text-white px-8 py-3 rounded-md font-medium',
              isFormValid
                ? 'bg-primary-main hover:bg-blue-700'
                : 'bg-primary-faded cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center'>
                <LoadingIcon />
                Processing...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </ThemeDiv>
  );
};

export default AddCourseForm;
