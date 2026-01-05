import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByOrganization } from '@/redux/slices/productSlice';

import { useSearchParams } from 'next/navigation';
import useQueryParams from '../useQueryParams';

const priceRangeToMinMax = (priceRange: string) => {
  switch (priceRange) {
    case 'Under ₦10,000':
      return { maxPrice: 10000 };
    case '₦10,000 - ₦50,000':
      return { minPrice: 10000, maxPrice: 50000 };
    case '₦50,000 - ₦100,000':
      return { minPrice: 50000, maxPrice: 100000 };
    case 'Over ₦100,000':
      return { minPrice: 100000 };
    default:
      return {};
  }
};

const useProducts = (
  type: string | undefined,
  search = '',
  priceRange = 'All Prices'
) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSearchParams();

  const { org } = useSelector((state: RootState) => state.org);
  const { currency } = useSelector((state: RootState) => state.currency);

  const {
    products,
    count,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.products);

  const {
    currentPage,
    perPage = 12,
    q,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
  } = useQueryParams(products);

  useEffect(() => {
    const { minPrice, maxPrice } = priceRangeToMinMax(priceRange);

    dispatch(
      fetchProductsByOrganization({
        page: currentPage,
        limit: perPage,
        ...(type ? { type } : {}),
        ...(search && { q: search }),
        ...(org?.id && { business_id: org?.id }),
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
        ...(currency && { currency }),
      })
    ).unwrap();
  }, [dispatch, currentPage, perPage, search, priceRange, org, type, currency]);

  return {
    products,
    count,
    loading: productsLoading,
    error: productsError,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    limit: perPage,
    currentPage,
  };
};

export default useProducts;
