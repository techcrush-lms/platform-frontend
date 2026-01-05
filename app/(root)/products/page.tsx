'use client';

import { Card } from '@/components/dashboard/Card';
import { Button } from '@/components/ui/Button';
import { PurchaseItemType } from '@/lib/utils';
import { RootState, AppDispatch } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { fetchCourses } from '@/redux/slices/courseSlice';
import { fetchTickets } from '@/redux/slices/ticketSlice';
import { fetchSubscriptionPlans } from '@/redux/slices/subscriptionPlanSlice';
import {
  CreditCard,
  GraduationCap,
  Ticket,
  Package,
  ArrowRight,
  Package2Icon,
} from 'lucide-react';
import { FaArrowRightLong } from 'react-icons/fa6';
import {
  fetchDigitalProducts,
  fetchPhysicalProducts,
} from '@/redux/slices/productSlice';

const Products = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { coursesCount } = useSelector((state: RootState) => state.course);
  const { count: ticketsCount } = useSelector(
    (state: RootState) => state.ticket
  );
  const { count: subscriptionsCount } = useSelector(
    (state: RootState) => state.subscriptionPlan
  );
  const { digital_products_count: digitalProductsCount } = useSelector(
    (state: RootState) => state.products
  );
  const { physical_products_count: physicalProductsCount } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (org?.id) {
      dispatch(fetchCourses({ business_id: org.id }));
      dispatch(fetchTickets({ business_id: org.id }));
      dispatch(fetchSubscriptionPlans({ business_id: org.id }));
      dispatch(fetchPhysicalProducts({ business_id: org.id }));
      dispatch(fetchDigitalProducts({ business_id: org.id }));
      // TODO: dispatch for fetching digital products count if not already
      // dispatch(fetchDigitalProducts({ business_id: org.id }));
    }
  }, [dispatch, org?.id]);

  const productOptions = [
    {
      type: PurchaseItemType.SUBSCRIPTION,
      title: 'Subscriptions',
      description: 'Manage subscription plans for your customers',
      icon: CreditCard,
      action: () => router.push('/products/subscriptions'),
      count: subscriptionsCount,
    },
    {
      type: PurchaseItemType.COURSE,
      title: 'Courses',
      description: 'Create and sell online courses',
      icon: GraduationCap,
      action: () => router.push('/products/courses'),
      count: coursesCount,
    },
    {
      type: PurchaseItemType.TICKET,
      title: 'Tickets',
      description: 'Sell tickets for events and workshops',
      icon: Ticket,
      action: () => router.push('/products/tickets'),
      count: ticketsCount,
    },
    {
      type: PurchaseItemType.DIGITAL_PRODUCT,
      title: 'Digital Products',
      description:
        'Upload and sell digital products like ebooks, designs, and more',
      icon: Package,
      action: () => router.push('/products/digital-products'),
      count: digitalProductsCount,
    },
    {
      type: PurchaseItemType.PHYSICAL_PRODUCT,
      title: 'Physical Products',
      description:
        'List and sell tangible items such as books, clothing, and other physical goods.',
      icon: Package2Icon as React.ElementType,
      action: () => router.push('/products/physical-products'),
      count: physicalProductsCount,
    },
  ];

  return (
    <main className='section-container text-gray-600 dark:text-gray-300'>
      <header className='flex flex-col md:flex-row justify-between md:items-center mb-8'>
        <div>
          <h2 className='text-2xl font-semibold'>Products</h2>
          <p className='text-gray-600 dark:text-gray-300 mt-1'>
            Manage your subscriptions, courses, tickets, and digital products
          </p>
        </div>
      </header>

      {/* Product Options - grouped in twos */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {productOptions.map((product) => (
          <Card
            key={product.type}
            className='flex flex-col justify-between p-4 hover:shadow-md transition-shadow'
          >
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg'>
                <product.icon className='w-6 h-6 text-primary-600 dark:text-primary-400' />
              </div>
              <h3 className='text-lg font-semibold'>{product.title}</h3>
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-300 flex-1'>
              {product.description}
            </p>

            <div className='mt-4 flex items-center justify-between'>
              <span className='text-xl font-bold'>{product.count}</span>
              <Button
                size='sm'
                variant='outline'
                onClick={product.action}
                className='flex gap-1 dark:border-gray-400'
                // className='rounded-full'
              >
                Manage <FaArrowRightLong />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Products;
