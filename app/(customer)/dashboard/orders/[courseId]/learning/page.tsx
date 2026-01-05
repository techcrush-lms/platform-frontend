'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import ContentPreview from '@/components/ContentPreview';
import {
  Play,
  BookOpen,
  Video,
  FileText,
  Lock,
  ArrowLeft,
  Menu,
  Settings,
  Image,
  Check,
} from 'lucide-react';
import useEnrolledCourseFromOrder from '@/hooks/page/useEnrolledCourseFromOrder';
import {
  updateCourseProgress,
  updateCourseProgressValue,
} from '@/redux/slices/orderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { fetchEnrolledCourse } from '@/redux/slices/courseSlice';

const detectContentType = (content: any) => {
  if (!content?.multimedia?.type) return 'text';
  const type = content.multimedia.type.toLowerCase();
  if (type.includes('video')) return 'video';
  if (type.includes('image')) return 'image';
  if (type.includes('pdf') || type.includes('doc') || type.includes('document'))
    return 'document';
  return 'text';
};

const CourseLearningPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const dispatch = useDispatch<AppDispatch>();

  // Use the correct hook for fetching course data
  const { course, loading, error } = useEnrolledCourseFromOrder(courseId);
  const { progressUpdateLoading } = useSelector(
    (state: RootState) => state.order
  );

  // Defensive: get modules and current module/contents
  const modules = course?.course?.modules || [];
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedContent, setSelectedContent] = useState(0);
  const [contentType, setContentType] = useState('text');
  const [showSidebar, setShowSidebar] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lastUpdatedContent, setLastUpdatedContent] = useState<string | null>(
    null
  );
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  // MOCK: Replace with real calculation or API value when available
  const totalDuration = '8 hours';

  // Defensive: get current content
  const currentModuleObj = modules[selectedModule] || { contents: [] };
  const contents = currentModuleObj.contents || [];
  const currentContentObj = contents[selectedContent] || null;

  // Set contentType on load/module/content change
  useEffect(() => {
    setContentType(detectContentType(currentContentObj));
  }, [selectedModule, selectedContent, course]);

  // Calculate and update local progress based on completed lessons
  const updateLocalProgress = useCallback(() => {
    const totalLessons = modules.reduce(
      (total, module) => total + (module.contents?.length || 0),
      0
    );
    const completedCount = completedLessons.size;
    const newProgress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    setProgress(newProgress);
  }, [modules, completedLessons]);

  // Set progress from API
  useEffect(() => {
    if (course?.progress !== undefined) setProgress(course.progress);
  }, [course]);

  // Initialize completed lessons from course data
  useEffect(() => {
    if (course?.course?.modules) {
      const completedContentIds = new Set<string>();
      course.course.modules.forEach((module) => {
        module.contents?.forEach((content) => {
          if (content.progress && content.progress.length > 0) {
            completedContentIds.add(content.id);
          }
        });
      });
      setCompletedLessons(completedContentIds);
    }
  }, [course]);

  // Update progress when completed lessons change
  useEffect(() => {
    updateLocalProgress();
  }, [completedLessons, updateLocalProgress]);

  // Progress update function with debouncing and duplicate prevention
  const updateProgress = useCallback(
    async (contentId: string, showToast = false) => {
      // Prevent duplicate updates for the same content
      if (lastUpdatedContent === contentId) {
        return;
      }

      try {
        await dispatch(
          updateCourseProgress({ content_id: contentId })
        ).unwrap();
        setLastUpdatedContent(contentId);

        // Update local progress immediately for real-time feedback
        updateLocalProgress();

        if (showToast) {
          toast.success('Progress updated successfully!');
        }
      } catch (error) {
        console.error('Failed to update progress:', error);
        if (showToast) {
          toast.error('Failed to update progress');
        }
      }
    },
    [dispatch, lastUpdatedContent]
  );

  // When switching modules, reset content to 0
  const handleModuleClick = (moduleIdx: any) => {
    setSelectedModule(moduleIdx);
    setSelectedContent(0);
  };

  // When switching content, update contentType and progress
  const handleContentClick = async (contentIdx: any) => {
    setSelectedContent(contentIdx);

    // Update progress when user manually selects content
    const selectedContentObj = contents[contentIdx];
    if (selectedContentObj?.id) {
      try {
        await dispatch(
          updateCourseProgress({ content_id: selectedContentObj.id })
        ).unwrap();

        // Update the selected content's progress
        // if (selectedContentObj) {
        //   selectedContentObj.progress = [
        //     {
        //       id: Date.now().toString(),
        //       completed_at: new Date().toISOString(),
        //     },
        //   ];
        // }
      } catch (error) {
        console.error('Failed to update progress:', error);
        // Silent fail for manual selection
      }
    }
  };

  // Auto-advance to next content on video complete
  const handleVideoComplete = async () => {
    // Update progress when video completes
    if (currentContentObj?.id) {
      try {
        await dispatch(
          updateCourseProgress({ content_id: currentContentObj.id })
        ).unwrap();

        // Update local completed lessons state immediately
        setCompletedLessons((prev) => {
          const newSet = new Set(prev);
          newSet.add(currentContentObj.id);
          return newSet;
        });

        // Calculate new progress based on updated local state
        const totalLessons = modules.reduce(
          (total, module) => total + (module.contents?.length || 0),
          0
        );

        const updatedCompletedCount = completedLessons.size + 1;
        const newProgress =
          totalLessons > 0
            ? Math.round((updatedCompletedCount / totalLessons) * 100)
            : 0;

        // Update local progress state immediately
        setProgress(newProgress);

        // Update the course progress using Redux reducer
        dispatch(
          updateCourseProgressValue({
            progress: newProgress,
            contentId: currentContentObj.id,
            isCompleted: true,
          })
        );

        toast.success('Lesson completed!');
      } catch (error) {
        console.error('Failed to update progress:', error);
        toast.error('Failed to update progress');
      }
    }

    // Auto-advance to next content
    if (selectedContent < contents.length - 1) {
      setSelectedContent(selectedContent + 1);
    }
  };

  // Handle lesson completion via checkbox
  const handleLessonComplete = async (
    contentId: string,
    isCompleted: boolean
  ) => {
    try {
      // Update progress on server
      await dispatch(updateCourseProgress({ content_id: contentId })).unwrap();

      // Update local completed lessons state immediately for real-time feedback
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        if (isCompleted) {
          newSet.add(contentId);
        } else {
          newSet.delete(contentId);
        }
        return newSet;
      });

      // Calculate new progress based on updated local state
      const totalLessons = modules.reduce(
        (total, module) => total + (module.contents?.length || 0),
        0
      );

      // Count completed lessons from local state for immediate accuracy
      const updatedCompletedCount = isCompleted
        ? completedLessons.size + 1
        : completedLessons.size - 1;

      const newProgress =
        totalLessons > 0
          ? Math.round((updatedCompletedCount / totalLessons) * 100)
          : 0;

      // Update local progress state immediately
      setProgress(newProgress);

      // Update the course progress using Redux reducer
      dispatch(
        updateCourseProgressValue({
          progress: newProgress,
          contentId: contentId,
          isCompleted: isCompleted,
        })
      );

      toast.success(
        isCompleted ? 'Lesson completed!' : 'Lesson marked as incomplete'
      );
    } catch (error) {
      console.error('Failed to update lesson progress:', error);
      toast.error('Failed to update lesson progress');
    }
  };

  const handleBackToOrders = () => router.push('/dashboard/orders');

  // Loading/Error/No Course states
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-300 font-medium'>
            Loading course...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 mb-4'>
            <BookOpen className='w-12 h-12 mx-auto' />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
            Course Not Found
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>{error}</p>
          <button
            onClick={handleBackToOrders}
            className='bg-primary-main text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  if (!course || modules.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-gray-500 dark:text-gray-400 mb-4'>
            <BookOpen className='w-12 h-12 mx-auto' />
          </div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
            Course Not Available
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            This course is not available or you don't have access to it.
          </p>
          <button
            onClick={handleBackToOrders}
            className='bg-primary-main text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='section-container pb-4'>
        {/* Header */}
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center gap-4'>
                <button
                  onClick={handleBackToOrders}
                  className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105'
                >
                  <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                </button>
                <div>
                  <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {course.course.title}
                  </h1>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    Module {selectedModule + 1} of {modules.length} • Content{' '}
                    {selectedContent + 1} of {contents.length}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {/* <button className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105'>
                  <Settings className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                </button> */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105'
                >
                  <Menu className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Main Content */}
            <div className='lg:col-span-3'>
              {/* Content Preview */}
              <div className='bg-black rounded-xl shadow-2xl overflow-hidden'>
                <div className='aspect-video relative'>
                  {currentContentObj ? (
                    <ContentPreview
                      content={currentContentObj}
                      contentType={contentType as any}
                      onComplete={handleVideoComplete}
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black'>
                      <div className='text-center text-white'>
                        <BookOpen className='w-16 h-16 mx-auto mb-4 opacity-70' />
                        <p className='text-lg font-medium'>
                          No Content Available
                        </p>
                        <p className='text-sm opacity-70'>
                          This lesson doesn't have any content
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Module Content */}
              <div className='mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                  {currentContentObj?.title ||
                    currentModuleObj?.title ||
                    'Module Content'}
                </h2>
                <div className='prose dark:prose-invert max-w-none'>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>
                    {course.course.description}
                  </p>
                  <div className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 mb-4 border border-gray-200/50 dark:border-gray-600/50 hidden'>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      Learning Objectives
                    </h3>
                    <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
                      <li>• Understand core concepts</li>
                      <li>• Practice with real examples</li>
                      <li>• Complete interactive exercises</li>
                      <li>• Test your knowledge</li>
                    </ul>
                  </div>
                  <div className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/30'>
                    <h3 className='font-semibold text-blue-900 dark:text-blue-300 mb-2'>
                      💡 Pro Tip
                    </h3>
                    <p className='text-blue-800 dark:text-blue-200 text-sm'>
                      Take notes as you learn! You can access your notes anytime
                      during the course.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            {showSidebar && (
              <div className='lg:col-span-1'>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                  <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        Course Progress
                      </h3>
                      {progressUpdateLoading && (
                        <div className='flex items-center gap-2 text-xs text-primary-main dark:text-primary-400'>
                          <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-primary-main'></div>
                          <span>Updating...</span>
                        </div>
                      )}
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3'>
                      <div
                        className='bg-gradient-to-r from-primary-main to-primary-600 h-2.5 rounded-full transition-all duration-300 shadow-sm'
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {course.progress}% Complete
                    </p>
                  </div>

                  <div className='p-4'>
                    <h4 className='font-semibold text-gray-900 dark:text-white mb-4 text-base'>
                      Course Modules
                    </h4>
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                      {modules.map((module, moduleIdx) => (
                        <div key={module.id} className='space-y-1'>
                          {/* Module Header */}
                          <div
                            onClick={() => handleModuleClick(moduleIdx)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm ${
                              moduleIdx === selectedModule
                                ? 'bg-gradient-to-r from-primary-main to-primary-600 text-white border-primary-main shadow-md '
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3'>
                                {moduleIdx === selectedModule ? (
                                  <Play className='w-4 h-4' />
                                ) : (
                                  <BookOpen className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                                )}
                                <div>
                                  <p
                                    className={`font-semibold text-sm ${
                                      moduleIdx === selectedModule
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-white'
                                    }`}
                                  >
                                    Module {moduleIdx + 1}
                                  </p>
                                  <p
                                    className={`text-xs font-medium ${
                                      moduleIdx === selectedModule
                                        ? 'text-primary-100'
                                        : 'text-gray-600 dark:text-gray-300'
                                    }`}
                                  >
                                    {module.title}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  moduleIdx === selectedModule
                                    ? 'text-primary-100'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {module.contents?.length || 0} lessons
                              </span>
                            </div>
                          </div>

                          {/* Module Contents */}
                          {moduleIdx === selectedModule && module.contents && (
                            <div className='ml-4 space-y-1'>
                              {module.contents.map((content, contentIdx) => {
                                const getContentIcon = () => {
                                  if (!content.multimedia?.type)
                                    return <FileText className='w-3 h-3' />;
                                  const type =
                                    content.multimedia.type.toLowerCase();
                                  if (type.includes('video'))
                                    return <Video className='w-3 h-3' />;
                                  if (type.includes('image'))
                                    return <Image className='w-3 h-3' />;
                                  if (
                                    type.includes('pdf') ||
                                    type.includes('doc') ||
                                    type.includes('document')
                                  )
                                    return <FileText className='w-3 h-3' />;
                                  return <BookOpen className='w-3 h-3' />;
                                };
                                const isCompleted = Boolean(
                                  content.progress.length
                                );
                                return (
                                  <div
                                    key={content.id}
                                    className={`p-2.5 rounded-lg border transition-all duration-200 ${
                                      contentIdx === selectedContent
                                        ? 'bg-primary-main text-white border-primary-main shadow-sm'
                                        : isCompleted
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                    }`}
                                    onClick={() =>
                                      handleContentClick(contentIdx)
                                    }
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <div className='flex items-center justify-between'>
                                      <div className='flex items-center gap-2.5 flex-1 cursor-pointer'>
                                        {contentIdx === selectedContent ? (
                                          <Play className='w-3.5 h-3.5' />
                                        ) : (
                                          <div className='text-gray-500 dark:text-gray-400'>
                                            {getContentIcon()}
                                          </div>
                                        )}
                                        <div className='flex-1'>
                                          <p
                                            className={`text-xs font-semibold ${
                                              contentIdx === selectedContent
                                                ? 'text-white'
                                                : isCompleted
                                                ? 'text-green-700 dark:text-green-300'
                                                : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                          >
                                            {content.title}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Completion Checkbox */}
                                      <div className='flex items-center ml-2'>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleLessonComplete(
                                              content.id,
                                              !isCompleted
                                            );
                                          }}
                                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                            isCompleted
                                              ? 'bg-primary-main border-primary-main'
                                              : 'border-gray-300 dark:border-gray-500 hover:border-primary-main dark:hover:border-primary-400'
                                          }`}
                                        >
                                          {isCompleted && (
                                            <Check className='w-2.5 h-2.5 text-white' />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300'>
                      <span>Total Duration</span>
                      <span className='text-primary-main dark:text-primary-400'>
                        {totalDuration}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mt-2'>
                      <span>Modules Completed</span>
                      <span className='text-primary-main dark:text-primary-400'>
                        {course.completed_lessons || 0}/
                        {course.total_lessons || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
