import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductCategoryById } from '@/redux/slices/productSlice';

const useProductCategoryById = (category_id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { category, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  const { org } = useSelector((state: RootState) => state.org);

  useEffect(() => {
    dispatch(
      fetchProductCategoryById({
        category_id, // You might want to pass the actual ID here
        business_id: org?.id,
      }),
    ).unwrap();
  }, [dispatch]);

  return {
    category,
    loading,
    error,
  };
};

export default useProductCategoryById;
