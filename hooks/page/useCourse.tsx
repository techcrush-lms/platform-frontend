import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse } from '@/redux/slices/courseSlice';
import { useParams } from 'next/navigation';

const useCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { course } = useSelector((state: RootState) => state.course);

  useEffect(() => {
    dispatch(
      fetchCourse({ id: params.id as string, business_id: org?.id })
    ).unwrap();
  }, [dispatch, org]);

  return {
    course,
  };
};

export default useCourse;
