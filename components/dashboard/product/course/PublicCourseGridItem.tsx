'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import {
  Calendar,
  EyeIcon,
  X,
  Clock,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';
import {
  formatMoney,
  getFirstAvailablePlan,
  getFirstAvailableTier,
  getProductType,
  hyphenate,
  OK,
  productItemInCart,
  ProductType,
  reformatText,
  reformatUnderscoreText,
  sortSubPlansByPrice,
  sortTiersByPrice,
} from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, fetchCart } from '@/redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { capitalize } from 'lodash';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getProductIcon } from '@/components/ProductIcon';
import { Product, SubscriptionPlanPrice, TicketTier } from '@/types/org';
import moment from 'moment-timezone';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PublicProductGridItemProps {
  id: string;
  details: Product;
  title: string;
  type: ProductType;
  imageSrc: string;
  price: string;
  onView: () => void;
  onBuy: () => void;
}

const PublicProductGridItem: React.FC<PublicProductGridItemProps> = ({
  id,
  details,
  title,
  type,
  imageSrc,
  price,
  onView,
  onBuy,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    cart,
    count,
    loading: cartLoading,
  } = useSelector((state: RootState) => state.cart);
  const [qty, setQty] = useState(1);

  const { anyProductInCart, productInCart } = productItemInCart(
    cart?.items!,
    id
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { currency } = useSelector((state: RootState) => state.currency);

  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(
    // @ts-ignore
    getFirstAvailableTier(details as Product)
  );
  const [selectedPlanPrice, setSelectedPlanPrice] =
    useState<SubscriptionPlanPrice | null>(
      getFirstAvailablePlan(details as Product)
    );

  const handleTierChange = (tierId: string) => {
    if (product?.type === ProductType.TICKET && product?.ticket) {
      const tier = sortTiersByPrice(product.ticket.ticket_tiers).find(
        (t) => t.id === tierId
      );
      if (tier) setSelectedTier(tier! as TicketTier);
    }
    if (
      product?.type === ProductType.SUBSCRIPTION &&
      product?.subscription_plan
    ) {
      // product.subscription_plan.subscription_plan_prices[0].
      const tier = sortSubPlansByPrice(
        product?.subscription_plan?.subscription_plan_prices!
      ).find((t) => t.id === tierId);
      if (tier) setSelectedPlanPrice(tier);
    }
  };

  const displayPrice = useMemo(() => {
    const basePrice =
      product?.type === ProductType.TICKET && selectedTier
        ? +selectedTier.amount
        : product?.type === ProductType.SUBSCRIPTION && selectedPlanPrice
        ? +selectedPlanPrice.price
        : +product?.price!;
    return (basePrice * qty).toFixed(2);
  }, [product, selectedTier, selectedPlanPrice, qty]);

  const displayOriginalPrice = useMemo(() => {
    const basePrice =
      product?.type === ProductType.TICKET && selectedTier
        ? selectedTier.original_amount
          ? +selectedTier.original_amount
          : null
        : product?.original_price
        ? +product.original_price
        : null;
    return basePrice ? (basePrice * qty).toFixed(2) : null;
  }, [product, selectedTier, qty]);

  const getPrice = () => {
    if (
      details?.type === ProductType.TICKET &&
      details.ticket?.ticket_tiers?.length
    ) {
      const tiers = details?.ticket?.ticket_tiers!;
      const minAmount = Math.min(
        ...tiers.map((t) => parseFloat(t.amount ?? '0') || 0)
      );

      const currency = tiers[0]?.currency ?? details.currency;
      return `${formatMoney(minAmount, currency)}+`;
    } else if (
      details.type === ProductType.SUBSCRIPTION &&
      details.subscription_plan?.subscription_plan_prices.length
    ) {
      const plan_prices = details?.subscription_plan.subscription_plan_prices;
      const minAmount = Math.min(
        ...plan_prices.map(
          (plan_price) => parseFloat(plan_price.price ?? '0') || 0
        )
      );
      const currency = plan_prices[0]?.currency ?? details.currency;
      const period = plan_prices[0].period;
      return `${formatMoney(minAmount, currency)} / ${capitalize(
        reformatText(period, '_')
      )}`;
    }

    const original_price = Boolean(+details.original_price)
      ? `<s>${formatMoney(+details?.original_price!, details?.currency)}</s> `
      : '';
    return `${original_price}${formatMoney(
      +details?.price!,
      details?.currency
    )}`;
  };

  const handleView = async () => {
    setLoading(true);
    try {
      // const res = await api.get(`/product-general/public/${id}`);
      setProduct(details!);
      setModalOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
    onView();
  };

  const handleAddToCart = async () => {
    try {
      if (!details) return;

      const product_id =
        details.type === ProductType.TICKET
          ? selectedTier?.id
          : details.type === ProductType.SUBSCRIPTION
          ? selectedPlanPrice?.id
          : details.id;

      const response = await dispatch(
        addToCart({
          product_id: product_id!,
          quantity: 1,
          product_type: type,
          currency,
        })
      ).unwrap();

      if (response.statusCode !== OK) {
        throw new Error(response.message);
      }

      await dispatch(fetchCart({ currency }));
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Ensure we have a selected tier when the product changes
  // This handles cases where the product is updated after initial render
  useEffect(() => {
    if (!selectedTier && product?.type === ProductType.TICKET) {
      const firstTier = getFirstAvailableTier(product);
      if (firstTier) {
        // @ts-ignore
        setSelectedTier(firstTier);
      }
    }
    if (!selectedPlanPrice && product?.type === ProductType.SUBSCRIPTION) {
      const firstTier = getFirstAvailablePlan(product);
      if (firstTier) {
        // @ts-ignore
        setSelectedPlanPrice(firstTier);
      }
    }
  }, [product, selectedTier, selectedPlanPrice]);

  return (
    <>
      <div className='shadow-md dark:shadow-none hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 min-h-[320px] flex flex-col justify-between rounded-xl bg-black/80 dark:bg-transparent'>
        <div className='relative'>
          <img
            className='w-full h-48 object-cover rounded-t-xl hover:cursor-pointer'
            src={imageSrc}
            alt={title}
            onClick={handleView}
          />
        </div>
        <div className='flex flex-col flex-grow justify-between px-4 dark:px-0 py-3 space-y-2'>
          <div>
            <h3 className='text-base font-bold truncate text-gray-800 dark:text-gray-200'>
              <Link href={`/dashboard/products/${details.id}`}>{title}</Link>
            </h3>
            <p
              className='text-sm min-h-[20px] text-gray-800 dark:text-gray-200'
              dangerouslySetInnerHTML={{ __html: getPrice() }}
            />
          </div>
          <div className='flex flex-row gap-2 w-full'>
            {productInCart ? (
              <Button
                variant='outline'
                className='flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary-main rounded-md border border-primary-main'
                onClick={() => router.push('/dashboard/cart')}
              >
                <ShoppingCart size={18} /> View
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-main rounded-md hover:bg-blue-800 transition border border-primary-main'
              >
                <ShoppingCart size={18} /> Buy
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Product Details`}
        className='max-w-2xl lg:max-w-4xl text-gray-800 dark:text-gray-200'
      >
        {/* Close Button */}
        <button
          onClick={() => setModalOpen(false)}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
        >
          <X className='w-5 h-5' />
        </button>

        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <span className='text-gray-500'>Loading...</span>
          </div>
        ) : product ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Image */}
            <div>
              <img
                src={product.multimedia?.url || imageSrc}
                alt={product.title}
                className='w-full aspect-square object-cover rounded-2xl shadow-md'
              />
            </div>

            {/* Content */}
            <div className='flex flex-col justify-between'>
              <div>
                <h3 className='text-2xl font-bold mb-3'>{product.title}</h3>
                <Badge className='gap-1 items-center bg-gray-200 text-gray-800  mb-4'>
                  {getProductIcon(getProductType(product.type))}

                  {capitalize(reformatUnderscoreText(product.type))}
                </Badge>
                <div
                  className='prose prose-sm dark:prose-invert mb-2 max-h-40 overflow-y-auto w-full'
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className='text-sm flex items-center text-primary-main dark:text-primary-faded hover:underline mb-6'
                >
                  View more details <ChevronRight size={15} className='ml-1' />
                </Link>

                {product.type === ProductType.TICKET && (
                  <div className='space-y-4'>
                    <p className='font-bold text-md'>Event details</p>
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        {moment(product.ticket?.event_start_date).format('LL')}{' '}
                        {new Date(product.ticket?.event_end_date!).getTime() !==
                          new Date(
                            product.ticket?.event_start_date!
                          ).getTime() &&
                          `- ${moment(product.ticket?.event_end_date).format(
                            'LL'
                          )}`}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4' />
                      <span>
                        {moment(product.ticket?.event_time).format('LT')}
                      </span>
                    </div>
                    <p className='text-gray-500 text-sm'>
                      The full event information will be shared after purchase.
                    </p>

                    <Select
                      onValueChange={(val) => handleTierChange?.(val)}
                      defaultValue={selectedTier?.id || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Choose a ticket' />
                      </SelectTrigger>
                      <SelectContent>
                        {sortTiersByPrice(
                          product.ticket?.ticket_tiers || []
                        ).map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name} (
                            {formatMoney(+tier.amount, tier.currency)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {product.type === ProductType.SUBSCRIPTION && (
                  <Select
                    onValueChange={(val) => handleTierChange?.(val)}
                    defaultValue={selectedPlanPrice?.id}
                    // value={selectedPlanPrice?.id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Choose a plan' />
                    </SelectTrigger>
                    <SelectContent>
                      {sortSubPlansByPrice(
                        product.subscription_plan?.subscription_plan_prices ||
                          []
                      ).map((planPrice) => (
                        <SelectItem key={planPrice.id} value={planPrice.id}>
                          {capitalize(reformatUnderscoreText(planPrice.period))}{' '}
                          ({formatMoney(+planPrice.price, planPrice.currency)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className='flex flex-col gap-6 pt-3'>
                {/* <div className='text-xl font-semibold text-primary-main dark:text-primary-faded mb-4'>
                  {formatMoney(+product.price, product.currency)}
                </div> */}
                {/* Price Section */}
                <div className='flex items-center gap-2'>
                  {displayOriginalPrice && (
                    <span className='text-sm font-semibold line-through'>
                      <s>{formatMoney(+displayOriginalPrice, currency)}</s>
                    </span>
                  )}
                  <span className='text-lg font-semibold'>
                    {formatMoney(+displayPrice, currency)}
                  </span>
                </div>

                {productInCart ? (
                  <Button
                    variant='outline'
                    className='text-primary font-semibold px-4 py-2 rounded-lg '
                    onClick={() => router.push('/dashboard/cart')}
                  >
                    View in Cart
                  </Button>
                ) : (
                  <button
                    className='w-full bg-primary-main text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50'
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center py-12 text-red-500'>
            {capitalize(type)} not found.
          </div>
        )}
      </Modal>
    </>
  );
};

export default PublicProductGridItem;
