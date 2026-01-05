'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Menu } from 'lucide-react';
import CourseProgressIndicator from '@/components/dashboard/product/course/CourseProgressIndicator';
import VideoPlayer from '@/components/VideoPlayer';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { cn, ProductStatus } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchModules, updateCourse } from '@/redux/slices/courseSlice';
import { useParams } from 'next/navigation';
import { Module as ApiModule } from '@/types/product';
import { MultimediaType } from '@/lib/utils';
import toast from 'react-hot-toast';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { HiDocumentText, HiPaperAirplane } from 'react-icons/hi';
import { MdPublish } from 'react-icons/md';

type Lesson = {
  id?: string;
  title: string;
  content: string;
  mediaPreview?: string;
  mediaType?: MultimediaType;
  multimedia_id?: string;
};

type Module = {
  id?: string;
  title: string;
  isOpen: boolean;
  lessons: Lesson[];
};

const CoursePreview = () => {
  const { id: courseId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const {
    modules: existingModules,
    modulesLoading: loading,
    course: currentCourse, // Assuming this contains course status from Redux
    base_readiness_percent,
    readiness_delta,
  } = useSelector((state: RootState) => state.course);

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const confetti = useConfettiStore();

  const formatModules = (apiModules: ApiModule[]): Module[] => {
    return apiModules.map((module, index) => ({
      id: module.id,
      title: module.title,
      isOpen: index === 0,
      lessons: module.contents.map((content) => ({
        id: content.id,
        title: content.title,
        content: '',
        mediaPreview: content.multimedia?.url,
        mediaType: content.multimedia?.type,
        multimedia_id: content.multimedia_id,
      })),
    }));
  };

  const toggleModule = (moduleId?: string) => {
    setModules((prevModules) =>
      prevModules.map((module) => ({
        ...module,
        isOpen: module.id === moduleId ? !module.isOpen : module.isOpen,
      }))
    );
  };

  useEffect(() => {
    if (courseId && org?.id) {
      dispatch(
        fetchModules({ business_id: org.id, course_id: courseId as string })
      );
    }
  }, [courseId, dispatch, org?.id]);

  useEffect(() => {
    if (existingModules.length > 0) {
      const formatted = formatModules(existingModules);
      setModules(formatted);
      setSelectedLesson(formatted[0]?.lessons[0] || null);
    }
  }, [existingModules]);

  const handlePublish = async () => {
    if (!courseId || !org?.id) return;

    const statusUpdate =
      currentCourse?.status === ProductStatus.PUBLISHED
        ? ProductStatus.DRAFT
        : ProductStatus.PUBLISHED;
    try {
      const response: any = await dispatch(
        updateCourse({
          id: courseId as string,
          credentials: {
            status: statusUpdate,
          },
          business_id: org.id,
        })
      ).unwrap();

      if (response.type === 'product-course-crud/:id/update/rejected') {
        throw new Error(response.payload.message);
      }

      if (statusUpdate === ProductStatus.PUBLISHED) {
        confetti.onOpen();
      }

      const msg =
        statusUpdate === ProductStatus.PUBLISHED
          ? 'Course published successfully!'
          : 'Course moved to draft successfully.';
      toast.success(msg);
    } catch (error) {
      // console.log(error);

      console.error('Publish error:', error);
      toast.error('Failed to publish course');
    }
  };

  const getMediaType = (lesson?: Lesson) => {
    if (!lesson?.mediaPreview) return 'none';
    if (lesson.mediaType === MultimediaType.IMAGE) return 'image';
    if (lesson.mediaType === MultimediaType.VIDEO) return 'video';
    if (lesson.mediaType === MultimediaType.DOCUMENT) return 'pdf';
    return 'none';
  };

  const mediaType = getMediaType(selectedLesson!);
  const readinessPercent =
    (base_readiness_percent || 0) + (readiness_delta || 0);

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Preview your course'
          enableBreadCrumb={true}
          layer2='Products'
          layer3='Courses'
          layer4='Preview'
          layer3Link='/products/courses'
          enableBackButton={true}
          ctaButtons={
            <div
              className={cn(
                'flex gap-2',
                (currentCourse?.status === ProductStatus.PUBLISHED ||
                  (currentCourse?.status === ProductStatus.DRAFT &&
                    currentCourse.readiness_percent === 100)) &&
                  'h-10'
              )}
            >
              {currentCourse?.status === ProductStatus.PUBLISHED && (
                <Button
                  variant={'primary'}
                  className={cn(
                    'dark:text-white hover:text-white hover:bg-primary-800'
                  )}
                  onClick={handlePublish}
                  disabled={loading}
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <span className='flex gap-1 items-center'>
                      <HiDocumentText />
                      Move to draft
                    </span>
                  )}
                </Button>
              )}

              {currentCourse?.status === ProductStatus.DRAFT &&
                currentCourse.readiness_percent === 100 && (
                  <Button
                    variant={'green'}
                    className={cn('hover:bg-green-800')}
                    onClick={handlePublish}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className='flex items-center justify-center'>
                        <LoadingIcon />
                        Processing...
                      </span>
                    ) : (
                      <span className='flex gap-1 items-center'>
                        <MdPublish />
                        Publish
                      </span>
                    )}
                  </Button>
                )}
            </div>
          }
        />

        <section className='mt-4 mb-6'>
          <CourseProgressIndicator step={3} />
        </section>

        {loading ? (
          <div className='text-center py-10'>Loading course content...</div>
        ) : (
          <div className='flex flex-col md:grid md:grid-cols-4 gap-6'>
            {/* Main Content */}
            <ThemeDivBorder className='order-1 md:order-none md:col-span-3 bg-white dark:bg-gray-900 dark:border-gray-600 border rounded-md p-4 md:p-6 flex flex-col'>
              {selectedLesson ? (
                <>
                  <h2 className='text-xl md:text-2xl font-semibold mb-2'>
                    {selectedLesson.title}
                  </h2>
                  <p className='text-sm mb-4'>{selectedLesson.content}</p>
                  <div className='rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center'>
                    {/* Preloader if media is not ready */}
                    {(mediaType === 'video' ||
                      mediaType === 'image' ||
                      mediaType === 'pdf') &&
                    !selectedLesson.mediaPreview ? (
                      <div className='flex flex-col items-center justify-center w-full h-[300px]'>
                        <LoadingIcon className='w-10 h-10 text-primary-main animate-spin mb-2' />
                        <span className='text-xs text-gray-400'>
                          Loading preview...
                        </span>
                      </div>
                    ) : (
                      <>
                        {mediaType === 'pdf' && (
                          <iframe
                            src={selectedLesson.mediaPreview}
                            title='PDF Preview'
                            className='w-full h-[300px] md:h-[500px]'
                          />
                        )}
                        {mediaType === 'image' && (
                          <img
                            src={selectedLesson.mediaPreview}
                            alt='Lesson Media'
                            className='w-full max-h-[300px] md:max-h-[500px] object-contain'
                          />
                        )}
                        {mediaType === 'video' &&
                          selectedLesson.mediaPreview && (
                            <VideoPlayer
                              title={selectedLesson.title}
                              src={selectedLesson.mediaPreview}
                            />
                          )}
                        {mediaType === 'none' && (
                          <p>No media preview available.</p>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p>Select a lesson to preview</p>
              )}
            </ThemeDivBorder>

            {/* Sidebar & Mobile Toggle */}
            <div className='order-2 md:order-none flex flex-col'>
              {/* Toggle Button - mobile only */}
              <div className='md:hidden flex justify-end my-4 px-4 dark:text-white'>
                <Button
                  variant='outline'
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className='flex items-center gap-2 w-full max-w-40 justify-center'
                >
                  <Menu className='w-5 h-5' />
                  <span>{isSidebarOpen ? 'Hide Lessons' : 'Show Lessons'}</span>
                </Button>
              </div>

              {/* Sidebar */}
              <aside
                className={cn(
                  'md:col-span-1 bg-white dark:bg-gray-900 border dark:border-gray-600 rounded-md p-4 flex-1 overflow-y-auto',
                  isSidebarOpen ? 'block' : 'hidden md:block'
                )}
                style={{ maxHeight: 'calc(100vh - 100px)' }}
              >
                {modules.map((module, mIdx) => (
                  <div key={module.id || `module-${mIdx}`} className='mb-4'>
                    <div
                      className='flex items-center justify-between cursor-pointer mb-2'
                      onClick={() => toggleModule(module.id)}
                    >
                      <h3 className='font-bold text-primary-main text-lg'>
                        Module {mIdx + 1}: {module.title}
                      </h3>
                      {module.isOpen ? (
                        <ChevronDown className='w-4 h-4' />
                      ) : (
                        <ChevronRight className='w-4 h-4' />
                      )}
                    </div>

                    {module.isOpen && (
                      <ul className='space-y-1'>
                        {module.lessons.map((lesson, lIdx) => (
                          <li
                            key={lesson.id || `lesson-${lIdx}`}
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsSidebarOpen(false);
                            }}
                            className={cn(
                              'cursor-pointer px-3 py-2 rounded hover:bg-primary-50 dark:hover:bg-gray-800 transition dark:text-white',
                              selectedLesson?.id === lesson.id
                                ? 'bg-primary-100 dark:bg-primary-800'
                                : ''
                            )}
                          >
                            <span
                              className='block text-ellipsis overflow-hidden whitespace-nowrap'
                              title={lesson.title}
                            >
                              {lesson.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CoursePreview;
