import { Button } from '@/components/ui/Button';
import { formatMoney, isTutor, ProductStatus } from '@/lib/utils';
import { CourseTutor } from '@/types/org';
import { capitalize } from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { AssignCourseModal } from '../product/course/AssignCourseModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchInvites, viewInvite } from '@/redux/slices/orgSlice';
import { useParams } from 'next/navigation';

interface TeamMemberAssignedCourseDetailsProps {
  course_tutoring: CourseTutor;
}

const TeamMemberAssignedCourseDetails = ({
  course_tutoring,
}: TeamMemberAssignedCourseDetailsProps) => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useSelector((state: RootState) => state.auth);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleNextAction = async () => {
    await dispatch(viewInvite({ id: params?.id as string }));
  };

  const viewLink = isTutor(profile?.role.role_id!)
    ? `/assigned-courses/${course_tutoring.course_id}/students`
    : `/courses/tracks/${course_tutoring.course_id}/edit`;

  return (
    <div
      key={course_tutoring.id}
      className='flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700'
    >
      {/* Thumbnail */}
      {course_tutoring.course ? (
        <img
          src={`${course_tutoring.course.multimedia.url}`}
          alt={course_tutoring.course.title}
          className='w-20 h-20 rounded-md object-cover bg-gray-100'
        />
      ) : (
        <div className='w-20 h-20 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500'>
          No Image
        </div>
      )}

      {/* Course Details */}
      <div className='flex-1 space-y-2'>
        <div className='flex items-center justify-between'>
          <h4 className='text-md font-semibold text-gray-900 dark:text-gray-100'>
            {course_tutoring.course.title}
          </h4>

          {!isTutor(profile?.role.role_id!) && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                course_tutoring.course.status === ProductStatus.PUBLISHED
                  ? 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400'
              }`}
            >
              {capitalize(course_tutoring.course.status)}
            </span>
          )}
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2'>
          {course_tutoring.course.description}
        </p>

        <div className='flex flex-wrap gap-2 text-xs'>
          <span className='px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400'>
            {course_tutoring.course.type}
          </span>

          <span className='px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
            {formatMoney(
              +course_tutoring.course.price,
              course_tutoring.course.currency,
            )}
          </span>

          <span className='px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-800/20 dark:text-purple-400'>
            {course_tutoring.course.cohort.cohort_number} (
            {course_tutoring.course.cohort.cohort_month})
          </span>
        </div>

        {course_tutoring.course.status === ProductStatus.PUBLISHED && (
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            Published on{' '}
            {new Date(
              course_tutoring.course.published_at!,
            ).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Action */}
      <div className='flex items-center gap-2'>
        {!isTutor(profile?.role.role_id!) && (
          <Button
            type='button'
            variant='primary'
            size='sm'
            onClick={handleModalOpen}
          >
            Assign
          </Button>
        )}
        {course_tutoring.course.status === ProductStatus.PUBLISHED && (
          <Link href={viewLink} className='text-sm bg-outline'>
            View
          </Link>
        )}
      </div>

      <AssignCourseModal
        id={course_tutoring.course_id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        courses={[]}
        onSubmit={() => {}}
        isSubmitting={false}
        onNext={handleNextAction}
      />
    </div>
  );
};

export default TeamMemberAssignedCourseDetails;
