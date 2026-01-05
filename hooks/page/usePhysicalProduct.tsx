import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchPhysicalProduct } from '@/redux/slices/physicalProductSlice';

const usePhysicalProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { physical_product, loading } = useSelector(
    (state: RootState) => state.physicalProduct
  );

  useEffect(() => {
    dispatch(
      fetchPhysicalProduct({ id: params.id as string, business_id: org?.id })
    ).unwrap();
  }, [dispatch, org]);

  return {
    physical_product,
    loading,
  };
};

export default usePhysicalProduct;
