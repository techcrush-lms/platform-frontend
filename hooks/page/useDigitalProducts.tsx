import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '../useQueryParams';
import { fetchDigitalProducts } from '@/redux/slices/productSlice';

const useDigitalProducts = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { digital_products, loading, error, count } = useSelector(
    (state: RootState) => state.products
  );
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
  } = useQueryParams(digital_products);

  useEffect(() => {
    dispatch(
      fetchDigitalProducts({
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
    digitalProducts: digital_products,
    count,
    currentPage,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  };
};

export default useDigitalProducts;
