import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '@/redux/slices/courseSlice';
import useQueryParams from '../useQueryParams';

const useCourses = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    courses,
    coursesLoading: loading,
    error,
    coursesCount: count,
  } = useSelector((state: RootState) => state.course);
  const { org } = useSelector((state: RootState) => state.org);

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useQueryParams(courses);

  useEffect(() => {
    dispatch(
      fetchCourses({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(org?.id && { business_id: org.id }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate, org]);

  return {
    courses,
    count,
    currentPage,
    perPage,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useCourses;
