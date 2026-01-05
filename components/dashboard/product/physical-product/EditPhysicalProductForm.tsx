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
  PhysicalProductGender,
  PhysicalProductType,
  UpdateDigitalProductProps,
  UpdatePhysicalProductProps,
  updatePhysicalProductSchema,
} from '@/lib/schema/product.schema';
import {
  allowedTypes,
  baseUrl,
  cn,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  OnboardingProcess,
  ProductStatus,
} from '@/lib/utils';
import { updateOnboardingProcess } from '@/redux/slices/orgSlice';
import { AppDispatch, RootState } from '@/redux/store';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import TinyMceEditor from '@/components/editor/TinyMceEditor';
import { Globe, XCircleIcon } from 'lucide-react';
import useCurrencies from '@/hooks/page/useCurrencies';
import {
  updatePhysicalProduct,
  updatePhysicalProductMedia,
} from '@/redux/slices/physicalProductSlice';
import { capitalize } from 'lodash';
import { uploadImage, uploadVideo } from '@/redux/slices/multimediaSlice';

const defaultValue: UpdatePhysicalProductProps = {
  title: '',
  slug: '',
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

const EditPhysicalProductForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories } = useProductCategory();
  const { foreignCurrencies } = useCurrencies();

  const { physical_product } = useSelector(
    (state: RootState) => state.physicalProduct
  );
  const { org } = useSelector((state: RootState) => state.org);

  const [formData, setFormData] =
    useState<UpdateDigitalProductProps>(defaultValue);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [showCrossedOutPrice, setShowCrossedOutPrice] = useState(false);

  const [errors, setErrors] = useState<Partial<UpdateDigitalProductProps>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUploader = useFileUploader({ type: 'image', maxSizeMB: 5 });
  const zipUploader = useFileUploader({ type: 'zip', maxSizeMB: 100 });

  const [previewImage, setPreviewImage] = useState('');

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

    console.log(input);

    try {
      setIsSubmitting(true);
      const { error } = updatePhysicalProductSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      const [response, response2] = await Promise.all([
        dispatch(
          updatePhysicalProduct({
            id: physical_product?.id!,
            credentials: input,
            business_id: org?.id!,
          })
        ).unwrap(),
        dispatch(
          updatePhysicalProductMedia({
            product_id: physical_product?.id!,
            credentials: { multimedia_ids: input.details?.multimedia_ids! },
            business_id: org?.id!,
          })
        ).unwrap(),
      ]);

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

      toast.success('Physical product saved successfully!');
      router.push(`/products/physical-products`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (physical_product) {
      setFormData({
        title: physical_product.title,
        slug: physical_product.slug,
        description: physical_product.description,
        price: +physical_product.price,
        original_price: +physical_product.original_price!,
        category_id: physical_product.category?.id,
        status: physical_product.status,
        keywords: physical_product?.keywords!,
        multimedia_id: physical_product?.multimedia?.id,
        other_currencies: physical_product.other_currencies,
        details: {
          sizes: physical_product.physical_product.sizes,
          colors: physical_product.physical_product.colors,
          location: physical_product.physical_product.location,
          stock: physical_product.physical_product.stock,
          type: physical_product.physical_product.type,
          gender: physical_product.physical_product.gender,
          estimated_production_time:
            physical_product.physical_product.estimated_production_time,
          min_required: physical_product.physical_product.min_required,
          multimedia_ids: physical_product.physical_product?.media?.map(
            (_m) => _m.multimedia?.id
          ),
        },
      });

      setShowCrossedOutPrice(Boolean(+physical_product?.original_price!));
      setPreviewImage(physical_product.multimedia?.url);
    }
  }, [physical_product, previewImage]);

  useEffect(() => {
    if (physical_product?.physical_product?.media) {
      setMediaFiles([
        ...physical_product.physical_product.media.map((m) => m.multimedia.url),
      ]);
    }
  }, [physical_product]);

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
        accept='image/png, image/jpeg, image/webp, image/heic, image/heif'
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

      {/* --- PHYSICAL PRODUCT FIELDS --- */}
      <div className='grid md:grid-cols-2 gap-4'>
        {/* Sizes */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Sizes (comma separated)
          </label>
          <Input
            type='text'
            placeholder='e.g. S, M, L, XL'
            value={formData.details?.sizes?.join(', ') || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                details: {
                  ...prev.details!,
                  sizes: e.target.value.split(',').map((s) => s.trim()),
                },
              }))
            }
          />
        </div>

        {/* Colors */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Colors (comma separated)
          </label>
          <Input
            type='text'
            placeholder='e.g. Red, Blue, Black'
            value={formData.details?.colors?.join(', ') || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                details: {
                  ...prev.details!,
                  colors: e.target.value.split(',').map((c) => c.trim()),
                },
              }))
            }
          />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        {/* Location */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Location <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            placeholder='Enter product location'
            value={formData.details?.location}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                details: { ...prev.details!, location: e.target.value },
              }))
            }
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Stock Quantity <span className='text-red-500'>*</span>
          </label>
          <Input
            type='number'
            placeholder='Enter stock quantity'
            value={formData.details?.stock ?? ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                details: { ...prev.details!, stock: +e.target.value },
              }))
            }
            min={0}
            required
          />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        {/* Product Type */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Product Type <span className='text-red-500'>*</span>
          </label>
          <Select
            value={formData.details?.type}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                details: { ...prev.details!, type: val as PhysicalProductType },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select product type' />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PhysicalProductType).map((type) => (
                <SelectItem key={type} value={type}>
                  {capitalize(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Gender <span className='text-red-500'>*</span>
          </label>
          <Select
            value={formData.details?.gender}
            onValueChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                details: {
                  ...prev.details!,
                  gender: val as PhysicalProductGender,
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
                  {capitalize(g)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData?.details?.type === PhysicalProductType.BESPOKE && (
        <div className='grid md:grid-cols-2 gap-4'>
          {/* Estimated Production Time */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Estimated Production Time (days)
            </label>
            <Input
              type='number'
              placeholder='e.g. 5'
              value={formData.details?.estimated_production_time ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details!,
                    estimated_production_time: +e.target.value || null,
                  },
                }))
              }
              min={0}
            />
          </div>

          {/* Minimum Required */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Minimum Required Quantity
            </label>
            <Input
              type='number'
              placeholder='e.g. 10'
              value={formData.details?.min_required ?? ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details!,
                    min_required: +e.target.value || null,
                  },
                }))
              }
              min={1}
            />
          </div>
        </div>
      )}

      {/* Upload additional multimedia */}
      {/* <div className='mt-4'>
        <label className='block text-sm font-medium mb-1'>
          Additional Product Images
        </label>
        <FileUploadCard
          preview={null}
          uploading={imageUploader.uploading}
          accept='image/png,image/jpeg'
          multiple={true}
          onFileSelect={(files: any) =>
            Promise.all(
              Array.from(files).map((file) =>
                // @ts-ignore
                imageUploader.handleUpload(file, (id) =>
                  setFormData((prev) => ({
                    ...prev,
                    details: {
                      ...prev.details!,
                      multimedia_ids: [
                        ...(prev.details?.multimedia_ids || []),
                        id,
                      ],
                    },
                  }))
                )
              )
            )
          }
          placeholder={{
            icon: '/icons/course/file.svg',
            title: 'Upload additional images',
            description: 'Supported: png, jpeg. Max 5MB each',
          }}
        />
      </div> */}
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
            const files = e.target.files;
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
                  ...prev.details!,
                  multimedia_ids: [
                    ...prev?.details?.multimedia_ids!,
                    ...uploadedIds,
                  ],
                },
              }));

              setMediaFiles((prev) => [...prev, ...uploadedFiles]);
              toast.success('Additional media uploaded');
            }
          }}
        />

        {/* Preview */}
        {(formData?.details?.multimedia_ids as string[]).length > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3'>
            {formData?.details?.multimedia_ids!.map((id, i) => {
              const isVideo = mediaFiles[i].match(/\.(mp4|mov|webm)$/i);

              return (
                <div key={i} className='relative'>
                  {isVideo ? (
                    <video
                      src={mediaFiles[i]}
                      controls
                      className='w-full h-60 rounded-md border object-cover bg-black'
                    />
                  ) : (
                    <img
                      src={mediaFiles[i]}
                      alt='media'
                      className='w-full h-60 rounded-md border object-cover'
                    />
                  )}
                  {/* <img
                  src={`${mediaFiles[i]}`}
                  alt='Product media'
                  className='w-full h-60 object-cover rounded-md border'
                /> */}
                  <button
                    type='button'
                    className='absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs'
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details!,
                          multimedia_ids: prev.details?.multimedia_ids!.filter(
                            (m) => m !== id
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

export default EditPhysicalProductForm;
