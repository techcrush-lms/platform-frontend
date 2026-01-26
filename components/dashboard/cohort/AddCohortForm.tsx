'use client';

import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import ThemeDiv from '@/components/ui/ThemeDiv';
import useCohorts from '@/hooks/page/useCohorts';
import { CreateCohortSchema } from '@/lib/schema/cohort.schema';
import { CreateTrackSchema } from '@/lib/schema/product.schema';
import { brandPreffix } from '@/lib/utils';
import { createCohort } from '@/redux/slices/cohortSlice';
import { fetchCategories } from '@/redux/slices/courseSlice';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import { createProductCategory } from '@/redux/slices/productSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const defaultValue = {
  name: '',
  cohort_number: '',
  description: '',
  cohort_month: '',
  cohort_year: '',
  multimedia_id: '',
  group_link: '',
};

const AddCohortForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { org } = useSelector((state: RootState) => state.org);

  const { count } = useCohorts();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [body, setBody] = React.useState<typeof defaultValue>({
    ...defaultValue,
    cohort_number: String(count + 1),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
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
              (event.loaded * 100) / (event.total || 1),
            );
            setUploadProgress(percent);
          },
        }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      const { error, value } = CreateCohortSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response = await dispatch(
        createCohort({
          credentials: {
            ...body,
            cohort_number: `${brandPreffix}-${body.cohort_number}`,
          },
        }),
      ).unwrap();

      toast.success('Cohort created successfully!');
      router.push(`/cohorts`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    body.name &&
    body.cohort_number &&
    body.cohort_month &&
    body.cohort_year &&
    body.group_link &&
    body.multimedia_id;

  return (
    <ThemeDiv className='mt-6 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-2xl font-semibold'>Create Cohort</h2>
        <p className='text-sm text-muted-foreground'>
          Create a cohort to structure and organize courses.
        </p>
      </div>

      <form className='space-y-8' onSubmit={handleSubmit}>
        {/* Cohort Basic Info */}
        <section className='space-y-4'>
          <h3 className='text-lg font-medium'>Cohort Information</h3>

          <div className='grid gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Cohort Title <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='name'
                placeholder='e.g. Cohort 1'
                className='w-full rounded-md border px-3 py-2 bg-background'
                value={body.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='grid grid-col-1 lg:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Cohort Number <span className='text-red-500'>*</span>
              </label>

              <div className='flex'>
                <span className='inline-flex items-center px-3 rounded-l-md border dark:border-gray-500 border-r-0 bg-muted dark:bg-gray-600 text-sm text-muted-foreground'>
                  TC-
                </span>
                <Input
                  type='number'
                  inputMode='numeric'
                  name='cohort_number'
                  placeholder='e.g. 1'
                  className='w-full rounded-l-none rounded-r-md border px-3 py-2 bg-background'
                  value={body.cohort_number}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Cohort Period <span className='text-red-500'>*</span>
              </label>

              <Input
                type='month'
                name='cohort_period'
                className='w-full rounded-md border px-3 py-2 bg-background'
                value={body.cohort_month}
                onChange={(e) => {
                  const monthValue = e.target.value; // e.g. "2026-03"
                  const year = monthValue.split('-')[0];

                  setBody({
                    ...body,
                    cohort_month: monthValue,
                    cohort_year: year,
                  });
                }}
                required
              />
            </div>
          </div>

          <div className='grid gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Group link (e.g WA, Telegram){' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='group_link'
                placeholder='e.g. WA or Telegram Link'
                className='w-full rounded-md border px-3 py-2 bg-background'
                value={body.group_link}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Cohort Description (optional)
            </label>

            <Textarea
              rows={3}
              name='description'
              placeholder='Enter Cohort Description'
              className='w-full rounded-md px-4 py-3'
              value={body.description}
              onChange={(e) =>
                setBody((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        </section>

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

        {/* Actions */}
        <div className='flex justify-end gap-3 pt-4 border-t'>
          <button
            type='button'
            className='px-4 py-2 rounded-md border'
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 rounded-md bg-primary text-white'
          >
            Create Cohort
          </button>
        </div>
      </form>
    </ThemeDiv>
  );
};

export default AddCohortForm;
