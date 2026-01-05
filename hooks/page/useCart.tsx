import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCart, removeCartItem } from '@/redux/slices/cartSlice';
import { ProductType } from '@/lib/utils';

const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, count, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  const { currency } = useSelector((state: RootState) => state.currency);

  const items = cart?.items || [];

  const getItemPrice = (item: (typeof items)[number]) => {
    if (item.product_type === ProductType.TICKET) {
      return Number(item.ticket_tier?.amount || 0);
    } else if (item.product_type === ProductType.COURSE) {
      return Number(item.course?.price || 0);
    } else if (item.product_type === ProductType.DIGITAL_PRODUCT) {
      return Number(item.digital_product?.price || 0);
    } else if (item.product_type === ProductType.SUBSCRIPTION) {
      return Number(item.subscription_plan_price?.price || 0);
    }
    return 0;
  };

  // Calculate totals
  const totals = {
    subtotal:
      cart?.items?.reduce((total, item) => {
        return total + getItemPrice(item) * item.quantity;
      }, 0) || 0,
    itemCount: cart?.items?.length || 0,
    totalQuantity:
      cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0,
  };

  useEffect(() => {
    dispatch(fetchCart({ currency }));
  }, [dispatch, currency]);

  return {
    cart,
    count,
    loading,
    error,
    totals,
  };
};

export default useCart;
