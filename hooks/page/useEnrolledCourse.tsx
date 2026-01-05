import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourse } from '@/redux/slices/courseSlice';

const useEnrolledCourse = (courseId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    enrolledCourse: course,
    courseDetailsLoading: loading,
    error,
  } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchEnrolledCourse({ id: courseId })).unwrap();
    }
  }, [dispatch, courseId]);

  return {
    course,
    loading,
    error,
  };
};

export default useEnrolledCourse;
