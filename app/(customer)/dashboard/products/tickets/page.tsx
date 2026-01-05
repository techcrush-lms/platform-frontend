'use client';

import PageHeading from '@/components/PageHeading';
import React, { useState } from 'react';
import useProducts from '@/hooks/page/useProducts';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import ProductGridItemSkeleton from '@/components/dashboard/product/ProductGridItemSkeleton';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { formatMoney, OK, isBusiness, SystemRole } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import useProductById from '@/hooks/page/useProductById';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addToCart, fetchCart } from '@/redux/slices/cartSlice';
import { ProductType } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { TicketTier } from '@/types/product';
import NotFound from '@/components/ui/NotFound';
import PublicProductGridItem from '@/components/dashboard/product/course/PublicCourseGridItem';

const Tickets = () => {
  const [search, setSearch] = useState('');
  const [priceRange] = useState('All Prices');
  const [modalOpenId, setModalOpenId] = useState<string | null>(null);
  const {
    products = [],
    count = 0,
    loading,
    error,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleRefresh,
    limit = 10,
    currentPage,
  } = useProducts('TICKET', search, priceRange);
  const dispatch = useDispatch<AppDispatch>();
  const {
    cart,
    count: cartCount,
    loading: cartLoading,
  } = useSelector((state: RootState) => state.cart);
  const { currency } = useSelector((state: RootState) => state.currency);
  const router = useRouter();

  // Only fetch product details for the currently open modal
  const { product, loading: ticketLoading } = useProductById(
    modalOpenId || undefined
  );

  return (
    <main className='min-h-screen bg-black dark:text-white text-gray-800'>
      <div className='section-container pb-4'>
        <PageHeading
          title='Event Tickets'
          brief='Buy your event tickets with ease'
          enableBreadCrumb={true}
          layer2='Products'
          layer2Link={'/dashboard/products'}
          layer3='Tickets'
          layer3Link={'/dashboard/products/tickets'}
        />
        <div className='flex flex-col gap-4 mt-2'>
          <Filter
            pageTitle='Featured Tickets'
            searchPlaceholder='Search for tickets...'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            handleSearchSubmit={setSearch}
            handleRefresh={handleRefresh}
          />
          {loading ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductGridItemSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <NotFound
              title='No Tickets Found'
              description='No tickets are currently available. Check back later or try searching for different tickets.'
              searchPlaceholder='Search for tickets...'
              onSearch={handleSearchSubmit}
            />
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
              {products.map((product) => {
                return (
                  <PublicProductGridItem
                    key={product.id}
                    details={product}
                    id={product.id}
                    type={product.type}
                    title={product.title}
                    imageSrc={
                      product.multimedia?.url || '/images/course/course1.png'
                    }
                    price={product.price!}
                    onView={() => {}}
                    onBuy={() => {}}
                  />
                );
              })}
            </div>
          )}
          {/* Modal for viewing ticket details */}
          <Modal
            isOpen={!!modalOpenId}
            onClose={() => setModalOpenId(null)}
            title={product?.title || 'Ticket Details'}
          >
            {ticketLoading ? (
              <div className='text-center py-8'>Loading...</div>
            ) : product ? (
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col  gap-6 items-start'>
                  <img
                    src={
                      product.multimedia?.url || '/images/course/course1.png'
                    }
                    alt={product.title}
                    className='w-full  h-56 object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'
                  />
                  <div className='flex flex-col'>
                    <div
                      className=' text-gray-700 dark:text-gray-300'
                      dangerouslySetInnerHTML={{
                        __html: product.description || '',
                      }}
                    />
                  </div>
                </div>
                {/* Ticket Tiers */}
                <div className='mt-2'>
                  <div className='font-semibold mb-3 text-lg text-primary'>
                    Available Tiers
                  </div>

                  {
                    // @ts-ignore
                    product?.ticket?.ticket_tiers.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {product?.ticket?.ticket_tiers.map(
                          (tier: TicketTier) => {
                            // Find if any tier for this ticket is in the cart
                            const anyTierInCart =
                              product?.ticket?.ticket_tiers.some((t) =>
                                cart?.items?.some(
                                  (item) => item.product_id === t.id
                                )
                              );
                            // Is this specific tier in the cart?
                            const tierInCart = cart?.items?.some(
                              (item) => item.product_id === tier.id
                            );
                            return (
                              <div
                                key={tier.id}
                                className='flex flex-col justify-between border border-primary/30 bg-primary/5 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-150 '
                              >
                                <div className='flex items-center gap-3'>
                                  {/* <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-xl font-bold'>
                                {tier.name.charAt(0)}
                              </span> */}
                                  <div>
                                    <div className='font-bold text-gray-800 dark:text-gray-200'>
                                      {tier.name}
                                    </div>
                                  </div>
                                </div>
                                <div className='flex flex-col mt-2 gap-2'>
                                  <span className='font-semibold text-gray-800 dark:text-gray-200'>
                                    {formatMoney(
                                      Number(tier.amount),
                                      tier.currency
                                    )}
                                  </span>
                                  {tierInCart ? (
                                    <Button
                                      variant='outline'
                                      className='text-primary font-semibold px-4 py-2 rounded-lg '
                                      onClick={() =>
                                        router.push('/dashboard/cart')
                                      }
                                    >
                                      View in Cart
                                    </Button>
                                  ) : (
                                    <Button
                                      variant='primary'
                                      className='font-semibold px-4 py-2 rounded-lg shadow gap-2'
                                      onClick={async () => {
                                        try {
                                          if (!product) return;
                                          const response = await dispatch(
                                            addToCart({
                                              product_id: tier.id,
                                              quantity: 1,
                                              product_type: ProductType.TICKET,
                                              currency,
                                            })
                                          ).unwrap();

                                          if (response.statusCode !== OK) {
                                            throw new Error(response.message);
                                          }
                                          await dispatch(
                                            fetchCart({ currency })
                                          );
                                          toast.success(response.message);
                                        } catch (error: any) {
                                          toast.error(error.message);
                                        }
                                      }}
                                      disabled={anyTierInCart}
                                    >
                                      <span role='img' aria-label='Buy'>
                                        <Icon
                                          url='/icons/cart.svg'
                                          width={15}
                                        />
                                      </span>{' '}
                                      Buy
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className='text-gray-500 italic'>
                        No tiers available for this ticket.
                      </div>
                    )
                  }
                </div>
              </div>
            ) : (
              <div className='text-center py-8 text-red-500'>
                Ticket not found.
              </div>
            )}
          </Modal>
          {!loading && count > limit && (
            <Pagination
              currentPage={currentPage}
              total={count}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Tickets;
