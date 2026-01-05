import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProduct } from '@/redux/slices/productSlice';

const useProductById = (id?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { product, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { currency } = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchPublicProduct({ product_id: id, ...(currency && { currency }) })
      );
    }
  }, [dispatch, id, currency]);

  return { product, loading, error };
};

export default useProductById;
