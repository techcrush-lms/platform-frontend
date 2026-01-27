'use client';

import TeamMemberAssignedCourseDetails from '@/components/dashboard/team/TeamMemberAssignedCourseDetails';
import PageHeading from '@/components/PageHeading';
import Icon from '@/components/ui/Icon';
import { SystemRole } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { CourseTutor } from '@/types/org';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const AssignedCourses = () => {
  const { profile } = useSelector((state: RootState) => state.auth);

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Assigned Tracks'
          brief='Monitor your assigned learning tracks with ease'
          enableBreadCrumb={true}
          layer2='Assigned Tracks'
          layer3Link='/assigned-courses'
        />

        <section className='my-4'>
          {/* Course Tutoring Card */}
          {profile?.role.role_id === SystemRole.TUTOR && (
            <div className='mt-4 w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                Assigned Courses
              </h3>

              {profile.courses_tutoring?.length ? (
                <div className='space-y-4'>
                  {profile.courses_tutoring.map(
                    (course_tutoring: CourseTutor) => (
                      <TeamMemberAssignedCourseDetails
                        course_tutoring={course_tutoring}
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  This tutor is not assigned to any courses yet.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AssignedCourses;
