'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import CourseProgressIndicator from '@/components/dashboard/product/course/CourseProgressIndicator';
import EditCourseForm from '@/components/dashboard/product/course/EditCourseForm';
import PageHeading from '@/components/PageHeading';
import { Button } from '@/components/ui/Button';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import useCourse from '@/hooks/page/useCourse';
import { deleteCourse } from '@/redux/slices/courseSlice';
import { AppDispatch, RootState } from '@/redux/store';
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdTrash } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

const EditCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { course } = useCourse();
  const { org } = useSelector((state: RootState) => state.org);

  const [deleteCourseOpenModal, setDeleteCourseOpenModal] = useState(false);
  const [allowAction, setAllowAction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteCourseNavigation = async () => {
    try {
      setIsSubmitting(true);

      // Submit logic here
      const response: any = await dispatch(
        deleteCourse({
          id: course?.id!,
          business_id: org?.id!,
        })
      );

      if (response.type === 'product-course-crud/:id/delete/rejected') {
        throw new Error(response.payload.message);
      }

      toast.success('Course deleted successfully!');
      router.push(`/products/courses`);
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleDeleteCourseNavigation();
      setAllowAction(false);
    }
  }, [allowAction]);

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Edit Course'
          brief={`Date created - ${moment(course?.created_at).format('LL')}`}
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/products'
          layer3='Courses'
          layer3Link='/products/courses'
          layer4='Edit Course'
          enableBackButton={true}
          ctaButtons={
            <div className='flex-shrink-0 self-start'>
              <Button
                variant='red'
                className='flex gap-1'
                onClick={() => setDeleteCourseOpenModal(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <LoadingIcon />
                    Processing...
                  </span>
                ) : (
                  <>
                    <IoMdTrash />
                    Delete
                  </>
                )}
              </Button>
            </div>
          }
        />

        <section>
          {/* Step Progress Indicator */}
          <CourseProgressIndicator />

          {/* Course Form Fields */}
          <EditCourseForm />
        </section>

        <ActionConfirmationModal
          body={`Are you sure you want to delete your course - ${course?.title}`}
          openModal={deleteCourseOpenModal}
          setOpenModal={setDeleteCourseOpenModal}
          allowAction={allowAction}
          setAllowAction={setAllowAction}
        />
      </div>
    </main>
  );
};

export default EditCourse;
