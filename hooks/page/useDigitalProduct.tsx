import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchDigitalProduct } from '@/redux/slices/digitalProductSlice';

const useDigitalProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { digital_product, loading } = useSelector(
    (state: RootState) => state.digitalProduct
  );

  useEffect(() => {
    dispatch(
      fetchDigitalProduct({ id: params.id as string, business_id: org?.id })
    ).unwrap();
  }, [dispatch, org]);

  return {
    digital_product,
    loading,
  };
};

export default useDigitalProduct;
