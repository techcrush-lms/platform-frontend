'use client';

import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import ThemeDiv from '@/components/ui/ThemeDiv';
import useProductCategory from '@/hooks/page/useProductCategory';
import useProductCategoryById from '@/hooks/page/useProductCategoryById';
import {
  CreateTrackSchema,
  UpdateTrackSchema,
} from '@/lib/schema/product.schema';
import { fetchCategories } from '@/redux/slices/courseSlice';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import {
  createProductCategory,
  editProductCategory,
} from '@/redux/slices/productSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const defaultValue = {
  name: '',
  description: '',
  multimedia_id: '',
};

const EditTrackForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { category } = useProductCategoryById(params?.id as string);

  const { org } = useSelector((state: RootState) => state.org);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [body, setBody] = React.useState<typeof defaultValue>(defaultValue);

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

      const { error, value } = UpdateTrackSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      // Submit logic here
      const response = await dispatch(
        editProductCategory({
          category_id: params?.id as string,
          credentials: {
            ...body,
          },
        }),
      ).unwrap();

      toast.success('Learning track updated successfully!');
      router.push(`/courses/tracks`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = body.name && body.multimedia_id;

  // Update form state when category data is fetched
  useEffect(() => {
    if (category) {
      setBody({
        name: category.name || '',

        description: category.description || '',

        multimedia_id: category.multimedia?.id,
      });

      setImagePreview(category?.multimedia.url!);
    }
  }, [category]);

  return (
    <ThemeDiv className='mt-6 p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-2xl font-semibold'>Edit Learning Track</h2>
        <p className='text-sm text-muted-foreground'>
          Edit learning tracks used to categorize and organize courses.
        </p>
      </div>

      <form className='space-y-8' onSubmit={handleSubmit}>
        {/* Track Basic Info */}
        <section className='space-y-4'>
          <h3 className='text-lg font-medium'>Track Information</h3>

          <div className='grid gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Track Title
              </label>
              <Input
                type='text'
                name='name'
                placeholder='e.g. Backend Engineering with Node.js'
                className='w-full rounded-md border px-3 py-2 bg-background'
                value={body.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>
              Track Description (optional)
            </label>

            {/* <textarea
              rows={4}
              placeholder='Describe what learners will gain from this track...'
              className='w-full rounded-md border px-3 py-2 bg-background'
            /> */}
            <Textarea
              rows={3}
              name='description'
              placeholder='Enter Track Description'
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
          <button type='button' className='px-4 py-2 rounded-md border'>
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 rounded-md bg-primary text-white'
          >
            Save Track
          </button>
        </div>
      </form>
    </ThemeDiv>
  );
};

export default EditTrackForm;
