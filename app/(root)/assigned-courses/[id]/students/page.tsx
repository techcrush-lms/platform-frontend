'use client';

import EnrolledStudentsList from '@/components/dashboard/product/course/students/EnrolledStudentsList';
import PageHeading from '@/components/PageHeading';
import useCourse from '@/hooks/page/useCourse';
import React from 'react';

const AssignedCourseStudents = () => {
  const { course } = useCourse({});

  return (
    <main className='min-h-screen'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Enrolled Students'
          brief='View students enrolled in this course assigned to you.'
          enableBreadCrumb={true}
          layer2='Assigned Courses'
          layer3={course?.title}
          layer4='Enrolled Students'
          layer2Link='/assigned-courses'
        />

        <section className='my-4'>
          {/* Enrolled Students List component */}
          <EnrolledStudentsList />
        </section>
      </div>
    </main>
  );
};

export default AssignedCourseStudents;
