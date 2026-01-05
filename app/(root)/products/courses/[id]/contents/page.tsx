'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CourseProgressIndicator from '@/components/dashboard/product/course/CourseProgressIndicator';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchModules,
  createBulkModule,
  updateBulkModule,
  fetchCourse,
} from '@/redux/slices/courseSlice';
import {
  uploadImage,
  uploadDocument,
  uploadVideo,
} from '@/redux/slices/multimediaSlice';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Module as ApiModule } from '@/types/product';
import {
  CreateModulesProps,
  UpdateModulesProps,
} from '@/lib/schema/product.schema';
import { MultimediaType } from '@/lib/utils';
import { IoIosDocument, IoIosDownload } from 'react-icons/io';
import CircularProgress from '@/components/CircularProgress';
import api from '@/lib/api';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';

type Lesson = {
  id?: string;
  title: string;
  media?: File | null;
  mediaPreview?: string;
  mediaType?: MultimediaType;
  multimedia_id?: string;
  position?: number;
  isUploading?: boolean;
  uploadProgress?: number; // 0-100
  uploadError?: boolean;
};

type Module = {
  id?: string;
  title: string;
  position?: number;
  lessons: Lesson[];
};

const CourseContent = () => {
  const { id: courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { modules: existingModules, modulesLoading: loading } = useSelector(
    (state: RootState) => state.course
  );
  const { base_readiness_percent, readiness_delta, course } = useSelector(
    (state: RootState) => state.course
  );
  const readinessPercent =
    (base_readiness_percent || 0) + (readiness_delta || 0);

  const [modules, setModules] = useState<Module[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const formatModules = (apiModules: ApiModule[]): Module[] => {
    return apiModules.map((module) => ({
      id: module.id,
      title: module.title,
      position: module.position,
      lessons: module.contents.map((content) => ({
        id: content.id,
        title: content.title,
        multimedia_id: content.multimedia_id,
        mediaPreview: content.multimedia?.url,
        mediaType: content.multimedia?.type,
        position: content.position,
      })),
    }));
  };

  useEffect(() => {
    if (courseId && org?.id) {
      dispatch(
        fetchModules({ business_id: org.id, course_id: courseId as string })
      );
    }
  }, [courseId, dispatch, org?.id, course]);

  useEffect(() => {
    if (existingModules.length > 0) {
      setModules(formatModules(existingModules));
      setIsEditing(true);
    } else {
      setModules([{ title: '', lessons: [{ title: '', media: null }] }]);
    }
  }, [existingModules]);

  const addModule = () => {
    setModules([
      ...modules,
      { title: '', lessons: [{ title: '', media: null }] },
    ]);
  };

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.push({
      title: '',
      media: null,
    });
    setModules(updatedModules);
  };

  const handleModuleChange = (index: number, field: string, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const handleLessonChange = (
    moduleIndex: number,
    lessonIndex: number,
    field: string,
    value: string
  ) => {
    const updatedModules = [...modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      [field]: value,
    };
    updatedModules[moduleIndex].lessons = updatedLessons;
    setModules(updatedModules);
  };

  const handleMediaChange = async (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => {
    if (!file || !org?.id) return;

    setIsUploading(true);

    const updatedModules = [...modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];

    let mediaType: MultimediaType = MultimediaType.DOCUMENT;
    if (file.type.startsWith('image')) {
      mediaType = MultimediaType.IMAGE;
    } else if (file.type.startsWith('video')) {
      mediaType = MultimediaType.VIDEO;
    }

    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      media: file,
      mediaType,
      mediaPreview: URL.createObjectURL(file),
      isUploading: true,
      uploadProgress: 0,
      uploadError: false,
    };

    updatedModules[moduleIndex].lessons = updatedLessons;
    setModules(updatedModules);

    try {
      const formData = new FormData();
      formData.append(mediaType.toLowerCase(), file);
      let endpoint = '/multimedia-upload/document';
      if (mediaType === MultimediaType.IMAGE)
        endpoint = '/multimedia-upload/image';
      if (mediaType === MultimediaType.VIDEO)
        endpoint = '/multimedia-upload/video';
      const headers: Record<string, any> = {
        'Content-Type': 'multipart/form-data',
        'Business-Id': org.id,
      };
      const response = await api.post(endpoint, formData, {
        headers,
        onUploadProgress: (event) => {
          if (event.total) {
            // Cap progress at 99% until the request is fully done
            const percent = Math.min(
              99,
              Math.round((event.loaded / event.total) * 100)
            );
            setModules((prevModules) => {
              const newModules = [...prevModules];
              newModules[moduleIndex].lessons[lessonIndex] = {
                ...newModules[moduleIndex].lessons[lessonIndex],
                uploadProgress: percent,
              };
              return newModules;
            });
          }
        },
      });
      // Set progress to 100% only after the upload is fully done
      setModules((prevModules) => {
        const newModules = [...prevModules];
        newModules[moduleIndex].lessons[lessonIndex] = {
          ...newModules[moduleIndex].lessons[lessonIndex],
          multimedia_id:
            response.data.data.id || response.data.data.multimedia?.id,
          isUploading: false,
          uploadProgress: 100,
          uploadError: false,
        };
        return newModules;
      });
    } catch (error) {
      setIsUploading(false);
      setModules((prevModules) => {
        const newModules = [...prevModules];
        newModules[moduleIndex].lessons[lessonIndex] = {
          ...newModules[moduleIndex].lessons[lessonIndex],
          media: null,
          mediaPreview: undefined,
          multimedia_id: undefined,
          isUploading: false,
          uploadProgress: 0,
          uploadError: true,
        };
        return newModules;
      });
      toast.error('Failed to upload media');
    }
  };

  const removeModule = (index: number) => {
    if (modules.length <= 1) {
      toast.error('You must have at least one module');
      return;
    }
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    if (modules[moduleIndex].lessons.length <= 1) {
      toast.error('You must have at least one lesson per module');
      return;
    }
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(updatedModules);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    modules.forEach((module, mIdx) => {
      if (!module.title || module.title.trim() === '') {
        errors[`module-title-${mIdx}`] = 'Module title is required.';
      }
      module.lessons.forEach((lesson, lIdx) => {
        if (!lesson.title || lesson.title.trim() === '') {
          errors[`lesson-title-${mIdx}-${lIdx}`] = 'Lesson title is required.';
        }
        // Require media file or multimedia_id
        if (!lesson.media && !lesson.multimedia_id) {
          errors[`lesson-media-${mIdx}-${lIdx}`] = 'Lesson media is required.';
        }
      });
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!courseId || !org?.id) return;

    // Validate form before submitting
    if (!validateForm()) {
      toast.error('Please fix the form errors before saving.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        modules: modules.map((module, mIndex) => ({
          course_id: courseId,
          ...(module.id && { id: module.id }),
          title: module.title,
          position: mIndex + 1,
          contents: module.lessons.map((lesson, lIndex) => ({
            ...(lesson.id && { id: lesson.id }),
            title: lesson.title,
            multimedia_id: lesson.multimedia_id,
            position: lIndex + 1,
          })),
        })),
      };

      const action = isEditing
        ? updateBulkModule({
            credentials: payload as UpdateModulesProps,
            business_id: org.id,
          })
        : createBulkModule({
            credentials: payload as CreateModulesProps,
            business_id: org.id,
          });

      const response = await dispatch(action).unwrap();

      toast.success(response.message || 'Modules saved successfully');
      // Sync with API
      await dispatch(
        fetchCourse({ id: courseId as string, business_id: org.id })
      );
      await dispatch(
        fetchModules({ business_id: org.id, course_id: courseId as string })
      );
      router.push(`/products/courses/${courseId}/preview`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save modules');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMediaPreview = (
    lesson: Lesson,
    moduleIndex?: number,
    lessonIndex?: number
  ) => {
    if (lesson.isUploading) {
      return (
        <div className='mt-2 flex items-center justify-center w-48 h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner'>
          <div className='flex flex-col items-center w-full'>
            <LoadingIcon className='w-8 h-8 text-primary-main mb-2 animate-spin' />
            <span className='text-xs text-gray-400 mt-2'>Uploading...</span>
          </div>
        </div>
      );
    }
    if (
      lesson.uploadError &&
      typeof moduleIndex === 'number' &&
      typeof lessonIndex === 'number'
    ) {
      return (
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-xs text-red-500'>Upload failed.</span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              // Retry upload
              const file = lesson.media;
              if (file) handleMediaChange(moduleIndex, lessonIndex, file);
            }}
          >
            Retry
          </Button>
        </div>
      );
    }
    if (!lesson.mediaPreview) return null;

    if (lesson.mediaType === MultimediaType.IMAGE) {
      return (
        <div className='mt-2 flex items-center justify-center w-48 h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
          <img
            src={lesson.mediaPreview}
            alt='Preview'
            className='object-contain w-full h-full'
          />
        </div>
      );
    } else if (lesson.mediaType === MultimediaType.VIDEO) {
      return (
        <div className='mt-2 flex items-center justify-center w-48 h-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
          <video
            controls
            className='object-contain w-full h-full rounded-lg'
            src={lesson.mediaPreview}
          />
        </div>
      );
    } else if (lesson.mediaType === MultimediaType.DOCUMENT) {
      return (
        <div className='mt-2 flex flex-col items-center justify-center w-48 h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-2'>
          <IoIosDocument className='text-5xl text-red-600 mb-2' />
          <a
            href={lesson.mediaPreview}
            download
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-primary-main hover:underline flex items-center gap-1'
          >
            <IoIosDownload />
            <span>Download PDF</span>
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Add course contents'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Courses'
          layer3Link='/products/courses'
          layer4='Contents'
          enableBackButton={true}
          ctaButtons={
            <div className='flex gap-2 h-10'>
              <Button
                variant='primary'
                className='dark:text-white hover:bg-primary-800 hover:text-white'
                disabled={isSubmitting || loading}
              >
                Next
              </Button>
            </div>
          }
        />

        <section className='mt-4'>
          <CourseProgressIndicator step={2} />
        </section>
        {loading ? (
          <div className='mt-6 text-center'>Loading modules...</div>
        ) : (
          <div className='mt-6 space-y-6'>
            {modules.map((module, mIndex) => (
              <ThemeDivBorder
                key={module.id || `new-module-${mIndex}`}
                className='border rounded-lg p-4 shadow-sm'
              >
                <h3 className='text-lg font-semibold mb-2'>
                  Module {mIndex + 1}
                </h3>
                <Input
                  placeholder='Module Title'
                  className='mb-4'
                  value={module.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleModuleChange(mIndex, 'title', e.target.value)
                  }
                />
                {formErrors[`module-title-${mIndex}`] && (
                  <div className='text-xs text-red-500 mb-2'>
                    {formErrors[`module-title-${mIndex}`]}
                  </div>
                )}

                {module.lessons.map((lesson, lIndex) => (
                  <div
                    key={lesson.id || `new-lesson-${lIndex}`}
                    className='mb-6 pl-4 border-l-4 border-primary-main'
                  >
                    <h4 className='text-md font-medium mb-1'>
                      Lesson {lIndex + 1}
                    </h4>
                    <Input
                      placeholder='Lesson Title'
                      className='mb-2'
                      value={lesson.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleLessonChange(
                          mIndex,
                          lIndex,
                          'title',
                          e.target.value
                        )
                      }
                    />
                    {formErrors[`lesson-title-${mIndex}-${lIndex}`] && (
                      <div className='text-xs text-red-500 mb-2'>
                        {formErrors[`lesson-title-${mIndex}-${lIndex}`]}
                      </div>
                    )}
                    {formErrors[`lesson-media-${mIndex}-${lIndex}`] && (
                      <div className='text-xs text-red-500 mb-2'>
                        {formErrors[`lesson-media-${mIndex}-${lIndex}`]}
                      </div>
                    )}

                    <div className='mb-2'>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Upload Media (Video, Image)
                      </label>
                      <Input
                        type='file'
                        accept='video/*,image/*'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleMediaChange(
                            mIndex,
                            lIndex,
                            e.target.files?.[0] || null
                          )
                        }
                        disabled={lesson.isUploading}
                      />
                      {renderMediaPreview(lesson, mIndex, lIndex)}
                      {module.lessons.length > 1 && (
                        <Button
                          variant='ghost'
                          className='text-red-500 dark:text-red-600 text-sm'
                          onClick={() => removeLesson(mIndex, lIndex)}
                          disabled={lesson.isUploading}
                        >
                          Remove Lesson
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant='ghost'
                  className='text-primary-main dark:text-primary-faded mt-2'
                  onClick={() => addLesson(mIndex)}
                >
                  + Add Lesson
                </Button>
                {modules.length > 1 && (
                  <Button
                    variant='ghost'
                    className='text-red-600 dark:text-red-600 mt-2'
                    onClick={() => removeModule(mIndex)}
                  >
                    Remove Module
                  </Button>
                )}
              </ThemeDivBorder>
            ))}

            <div className='flex justify-between'>
              <Button
                variant='primary'
                onClick={addModule}
                // Always enabled
              >
                + Add Module
              </Button>
              <Button
                variant='outline'
                className='border border-primary-main hover:bg-primary-800 hover:text-white dark:border-gray-600 dark:hover:bg-white dark:text-white dark:hover:text-gray-900'
                onClick={handleSave}
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CourseContent;
