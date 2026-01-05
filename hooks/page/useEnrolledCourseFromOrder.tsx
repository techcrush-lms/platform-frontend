import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourse } from '@/redux/slices/orderSlice';

const useEnrolledCourseFromOrder = (courseId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    enrolledCourse: course,
    enrolledCourseLoading: loading,
    error,
  } = useSelector((state: RootState) => state.order);

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

export default useEnrolledCourseFromOrder;
