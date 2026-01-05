import { fetchCategories } from '@/redux/slices/courseSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';

const useProductCategory = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    categories,
    categoriesLoading,
    error,
    categoriesCount: count,
  } = useSelector((state: RootState) => state.course);

  const {
    currentPage,
    perPage,
    q,
    startDate,
    endDate,
    onClickNext,
    onClickPrev,
  } = useQueryParams(categories);

  useEffect(() => {
    dispatch(
      fetchCategories({
        page: currentPage,
        limit: perPage,
        ...(q && { q }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, q, startDate, endDate]);

  return {
    categories,
    loading: categoriesLoading,
    error,
  };
};

export default useProductCategory;
