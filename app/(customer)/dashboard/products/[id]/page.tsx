'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Calendar, Clock, BookOpen, PlayCircle } from 'lucide-react';
import moment from 'moment';
import {
  formatMoney,
  getFirstAvailablePlan,
  getFirstAvailableTier,
  getProductType,
  OK,
  productItemInCart,
  ProductType,
  reformatText,
  reformatUnderscoreText,
  sortSubPlansByPrice,
  sortTiersByPrice,
} from '@/lib/utils';
import { Product, SubscriptionPlanPrice, TicketTier } from '@/types/org';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import useProductById from '@/hooks/page/useProductById';
import { getProductIcon } from '@/components/ProductIcon';
import PageHeading from '@/components/PageHeading';
import { useParams, useRouter } from 'next/navigation';
import { capitalize } from 'lodash';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, fetchCart } from '@/redux/slices/cartSlice';
import toast from 'react-hot-toast';

//
// --- UI Helpers ---
const LoadingState = () => (
  <div className='flex justify-center items-center h-[300px]'>
    <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
  </div>
);

const ErrorState = () => (
  <div className='text-center text-red-500 py-8'>
    ⚠️ Failed to load product details.
  </div>
);

const EmptyState = () => (
  <div className='text-center py-8 text-muted-foreground'>
    No product found.
  </div>
);

//
// --- Subcomponents ---
const ProductImages = ({
  product,
  thumbnails,
  activeImage,
  setActiveImage,
}: {
  product: Product;
  thumbnails: { url: string }[];
  activeImage: string | null;
  setActiveImage: (url: string) => void;
}) => (
  <div className='flex gap-4 lg:w-[50%]'>
    {/* Thumbnails */}
    {thumbnails.length > 1 && (
      <div className='flex flex-col gap-3 max-h-[400px] overflow-y-auto'>
        {thumbnails.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(thumb.url)}
            className={cn(
              'border rounded-md overflow-hidden transition hover:shadow-sm',
              activeImage === thumb.url
                ? 'border-blue-500'
                : 'border-gray-200 hover:border-gray-400'
            )}
          >
            <img
              src={thumb.url}
              alt={`Thumbnail ${idx + 1}`}
              className='w-[70px] h-[70px] object-cover'
            />
          </button>
        ))}
      </div>
    )}

    {/* Main Image */}
    <div className='flex-1 flex justify-center rounded-xl overflow-hidden'>
      {product.multimedia?.url && (
        <img
          src={activeImage || product.multimedia.url}
          alt={product.title}
          className='w-full h-[500px] object-cover rounded-xl'
        />
      )}
    </div>
  </div>
);

const ProductMeta = ({
  product,
}: {
  product: Product;
  selectedTier?: TicketTier | null;
  setSelectedTier?: (tier: TicketTier) => void;
  selectedPlanPrice?: SubscriptionPlanPrice | null;
  setSelectedPlanPrice?: React.Dispatch<
    React.SetStateAction<SubscriptionPlanPrice | null>
  >;
  handleTierChange?: (tierId: string) => void;
  displayPrice?: string;
  displayOriginalPrice?: string | null;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    cart,
    count,
    loading: cartLoading,
  } = useSelector((state: RootState) => state.cart);
  const { currency } = useSelector((state: RootState) => state.currency);

  const { anyProductInCart, productInCart } = productItemInCart(
    cart?.items!,
    product.id
  );

  const Icon = getProductIcon(getProductType(product.type));

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      const item_id =
        product.type === ProductType.TICKET
          ? selectedTier?.id!
          : product.type === ProductType.SUBSCRIPTION
          ? selectedPlanPrice?.id
          : product.id;

      // if (!count) {
      const response = await dispatch(
        addToCart({
          product_id: item_id!,
          quantity: 1,
          product_type: product.type,
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

  const [qty] = useState(1);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(
    // @ts-ignore
    getFirstAvailableTier(product as Product)
  );
  const [selectedPlanPrice, setSelectedPlanPrice] =
    useState<SubscriptionPlanPrice | null>(
      getFirstAvailablePlan(product as Product)
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
      product?.type === ProductType.TICKET &&
      product.ticket?.ticket_tiers?.length
    ) {
      const tiers = product?.ticket?.ticket_tiers!;
      const minAmount = Math.min(
        ...tiers.map((t) => parseFloat(t.amount ?? '0') || 0)
      );
      const currency = tiers[0]?.currency ?? product.currency;
      return `${formatMoney(minAmount, currency)}+`;
    } else if (
      product?.type === ProductType.SUBSCRIPTION &&
      product?.subscription_plan?.subscription_plan_prices.length
    ) {
      const plan_prices = product?.subscription_plan.subscription_plan_prices!;
      const minAmount = Math.min(
        ...plan_prices.map(
          (plan_price: SubscriptionPlanPrice) =>
            parseFloat(plan_price.price ?? '0') || 0
        )
      );
      const currency = plan_prices[0]?.currency ?? product.currency;
      const period = plan_prices[0].period;
      return `${formatMoney(minAmount, currency)} / ${capitalize(
        reformatText(period, '_')
      )}`;
    }

    const original_price = product?.original_price
      ? `${formatMoney(+product?.price!, product?.currency)} `
      : '';
    return `${original_price}${formatMoney(
      +product?.price!,
      product?.currency
    )}`;
  };

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
    <div className='flex flex-col gap-6 flex-1 text-gray-800 dark:text-gray-200'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>{product.title}</h1>

        <div className='inline-flex items-center gap-1 rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-800 mb-4'>
          {Icon}
          {reformatUnderscoreText(capitalize(product.type))}
        </div>

        {product.business_info && (
          <a
            href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/b/${product.business_info.business_slug}`}
            target='_blank'
            className='flex items-center gap-2'
          >
            {product.business_info?.logo_url && (
              <img
                src={product.business_info.logo_url}
                alt='logo'
                className='w-6 h-6 rounded-full'
              />
            )}
            <span>{product.business_info.business_name}</span>
          </a>
        )}
      </div>

      {product.description && (
        <div className='w-full overflow-hidden'>
          <div
            className='prose prose-sm max-w-none text-black dark:text-white w-full break-words'
            style={{ color: 'white !important' }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {product.type === ProductType.TICKET && (
        <div className='space-y-4'>
          <p className='font-bold text-md'>Event details</p>
          <div className='flex items-center gap-2 text-sm'>
            <Calendar className='h-4 w-4' />
            <span>
              {moment(product.ticket?.event_start_date).format('LL')}{' '}
              {new Date(product.ticket?.event_end_date!).getTime() !==
                new Date(product.ticket?.event_start_date!).getTime() &&
                `- ${moment(product.ticket?.event_end_date).format('LL')}`}
            </span>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4' />
            <span>{moment(product.ticket?.event_time).format('LT')}</span>
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
              {sortTiersByPrice(product.ticket?.ticket_tiers || []).map(
                (tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.name} ({formatMoney(+tier.amount, currency)})
                  </SelectItem>
                )
              )}
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
              product.subscription_plan?.subscription_plan_prices || []
            ).map((planPrice) => (
              <SelectItem key={planPrice.id} value={planPrice.id}>
                {capitalize(reformatUnderscoreText(planPrice.period))} (
                {formatMoney(+planPrice.price, currency)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Price */}
      <div className='flex items-baseline gap-2'>
        {displayOriginalPrice && (
          <span className='line-through text-sm text-muted-foreground'>
            {formatMoney(+displayOriginalPrice, currency)}
          </span>
        )}
        <span className='text-lg font-semibold'>
          {formatMoney(+displayPrice!, currency)}
        </span>
      </div>

      <div className='flex'>
        {productInCart ? (
          <Button
            variant='outline'
            size='lg'
            className='text-primary font-semibold px-4 py-2 rounded-lg '
            onClick={() => router.push('/dashboard/cart')}
          >
            View in Cart
          </Button>
        ) : (
          <Button
            type='button'
            size='lg'
            onClick={handleAddToCart}
            disabled={anyProductInCart}
          >
            {product.type === ProductType.TICKET && selectedTier
              ? `Buy ${selectedTier.name} Ticket`
              : 'Add to Cart'}
          </Button>
        )}
      </div>
    </div>
  );
};

//
// --- Main Component ---
const BusinessProductView = () => {
  const params = useParams();

  const { product, loading, error } = useProductById(params?.id! as string);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!product) return <EmptyState />;

  const thumbnails = [...(product.multimedia ? [product.multimedia] : [])];

  return (
    <main className='min-h-screen bg-black text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Product Details'
          brief='View more about your product'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link='/dashboard/products'
          layer3='Product Details'
          layer3Link={`/dashboard/products/${product.id}`}
          enableBackButton={true}
        />

        <div className='container py-6'>
          <div className='flex flex-col md:flex-row gap-10'>
            <ProductImages
              product={product}
              thumbnails={thumbnails}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />
            <ProductMeta
              product={product}
              // selectedTier={selectedTier}
              // setSelectedTier={setSelectedTier}
              // selectedPlanPrice={selectedPlanPrice}
              // setSelectedPlanPrice={setSelectedPlanPrice}
              // handleTierChange={handleTierChange}
              // displayPrice={displayPrice}
              // displayOriginalPrice={displayOriginalPrice}
            />
          </div>
          {product.type === ProductType.COURSE && (
            <div className='mt-10'>
              {/* TODO: Rebuild CourseModulesPreview in shadcn style */}
              <CourseModulesPreview modules={product.modules} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

const CourseModulesPreview = ({ modules }: { modules: Product['modules'] }) => {
  if (!modules?.length) {
    return (
      <div className='text-muted-foreground text-sm text-center py-10 rounded-lg border'>
        No modules available for this course.
      </div>
    );
  }

  return (
    <div className='text-gray-800 dark:text-gray-200'>
      <h2 className='text-2xl font-bold mb-6'>Course Modules</h2>
      <Accordion type='single' collapsible className='space-y-4 '>
        {modules.map((module, index) => (
          <AccordionItem
            key={module.id}
            value={`module-${module.id}`}
            className='rounded-xl border bg-card shadow-sm'
          >
            <AccordionTrigger className='px-4 py-3 flex items-center gap-3 text-base font-medium hover:bg-muted/50 rounded-t-xl'>
              <BookOpen className='h-5 w-5 text-primary' />
              <span>
                {index + 1}: {module.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className='px-6 pb-4'>
              {module.contents?.length ? (
                <ul className='space-y-3 mt-3'>
                  {module.contents.map((lesson, lIndex) => (
                    <li
                      key={lesson.id}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-md hover:bg-muted transition text-sm text-muted-foreground'
                      )}
                    >
                      <PlayCircle className='h-4 w-4 text-muted-foreground' />
                      <span>
                        Lesson {lIndex + 1}: {lesson.title}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-muted-foreground mt-2 pl-1'>
                  No lessons in this module yet.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BusinessProductView;
