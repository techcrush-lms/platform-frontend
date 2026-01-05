'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeading from '@/components/PageHeading';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import NotFound from '@/components/ui/NotFound';
import ClientPaymentItem from '@/components/dashboard/payment/ClientPaymentItem';
import { Modal } from '@/components/ui/Modal';
import useClientPayments from '@/hooks/page/useClientPayments';
import { Payment } from '@/types/payment';
import {
  formatMoney,
  PaymentStatus,
  ProductType,
  shortenId,
} from '@/lib/utils';
import {
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ShoppingBag,
  Play,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Lock,
  Clock,
  DownloadIcon,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import {
  cancelPayment,
  fetchClientPayments,
} from '@/redux/slices/paymentSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    q,
    startDate,
    endDate,
    payments,
    perPage,
    count,
    loading,
    error,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useClientPayments();

  const [cancelOrderOpenModal, setCancelOrderOpenModal] = useState(false);
  const [allowCancelOrderAction, setAllowCancelOrderAction] = useState(false);
  const [isSubmittingPaymentCancellation, setIsSubmittingPaymentCancellation] =
    useState(false);

  const handleViewPaymentDetails = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    }
  };

  const handlePreviewCourse = (courseId: string) => {
    router.push(`/dashboard/orders/${courseId}/learning`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPurchaseTypeLabel = (type: string) => {
    switch (type) {
      case 'TICKET':
        return 'Event Ticket';
      case 'COURSE':
        return 'Course';
      case 'SUBSCRIPTION':
        return 'Subscription';
      case 'DIGITAL_PRODUCT':
        return 'Digital Product';
      case 'PRODUCT':
        return 'Product';
      default:
        return type;
    }
  };

  const hasCoursePurchase = (payment: Payment) => {
    return payment.purchase?.items?.some(
      (item) => item.purchase_type === 'COURSE'
    );
  };

  const getCourseId = (payment: Payment) => {
    const courseItem = payment.purchase?.items?.find(
      (item) => item.purchase_type === 'COURSE'
    );
    return courseItem?.product_id;
  };

  const handleDownload = (url: string) => {
    // Path to your zip file (public folder in Next.js)
    const fileUrl = url; // put the .zip inside /public/files/
    const link = document.createElement('a');
    link.href = fileUrl;
    const filename = url.split('/')[url.split('/').length - 1];
    link.setAttribute('download', filename); // optional, forces the name
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCancelOrder = async () => {
    try {
      setIsSubmittingPaymentCancellation(true);

      // Submit logic here
      const response = await dispatch(
        cancelPayment({
          payment_id: selectedPayment?.id!,
        })
      ).unwrap();

      // Refresh
      dispatch(
        fetchClientPayments({
          page: currentPage,
          limit: perPage,
          ...(q && { q }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        })
      ).unwrap();

      toast.success(response.message);
    } catch (error: any) {
      console.error('Submission failed:', error);
      const message = error || error.message;
      toast.error(message);
    } finally {
      setIsSubmittingPaymentCancellation(false);
      setShowPaymentModal(false);
    }
  };

  useEffect(() => {
    if (allowCancelOrderAction) {
      handleCancelOrder();
      setAllowCancelOrderAction(false);
    }
  }, [allowCancelOrderAction]);

  return (
    <main className='min-h-screen text-gray-900 dark:text-white'>
      <div className='section-container pb-4'>
        <PageHeading
          title='My Orders'
          brief='View and track your order history'
          enableBreadCrumb={true}
          layer2='Orders'
        />

        <div className='flex flex-col gap-4 mt-2'>
          <Filter
            pageTitle='Order History'
            searchPlaceholder='Search orders...'
            showPeriod={false}
            enableRightSearchBar={true}
            showFullSearchWidth={true}
            showFilterByDate={true}
            handleSearchSubmit={handleSearchSubmit}
            handleFilterByDateSubmit={handleFilterByDateSubmit}
            handleRefresh={handleRefresh}
          />

          {loading ? (
            <div className='space-y-4'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse'
                >
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
                  <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded'></div>
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <NotFound
              title='No Orders Found'
              description={
                "You haven't placed any orders yet. Start shopping to see your order history here."
              }
              searchPlaceholder='Search orders...'
              onSearch={handleSearchSubmit}
            />
          ) : (
            <div className='space-y-4'>
              {payments.map((payment) => (
                <div key={payment.id} className='relative'>
                  <ClientPaymentItem
                    payment={payment}
                    onViewDetails={handleViewPaymentDetails}
                  />
                  {/* Course Preview Button */}
                  {hasCoursePurchase(payment) && (
                    <div className='absolute top-4 right-4'>
                      <button
                        onClick={() =>
                          handlePreviewCourse(getCourseId(payment)!)
                        }
                        className='bg-primary-main hover:bg-primary-dark text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200'
                      >
                        <BookOpen className='w-4 h-4' />
                        Start Learning
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && count > 0 && (
            <Pagination
              total={count}
              currentPage={currentPage}
              onClickNext={onClickNext}
              onClickPrev={onClickPrev}
              noMoreNextPage={payments.length === 0}
              paddingRequired={false}
            />
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Payment #${shortenId(selectedPayment?.id!)}`}
        className='max-w-4xl'
      >
        {/* X Close Button */}
        <button
          onClick={() => setShowPaymentModal(false)}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
        >
          <XCircle className='w-5 h-5' />
        </button>
        {selectedPayment && (
          <div className='space-y-6'>
            {/* Payment Summary */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Payment Summary
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <Package className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Status:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.payment_status}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Date:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {formatDate(selectedPayment.created_at)}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <CreditCard className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Total:{' '}
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {formatMoney(
                        Number(selectedPayment.amount),
                        selectedPayment.currency
                      )}
                    </span>
                  </span>
                </div>
                {selectedPayment.transaction_id && (
                  <div className='flex items-center gap-2'>
                    <User className='w-4 h-4 text-gray-500' />
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      Transaction ID:{' '}
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {selectedPayment.transaction_id}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Payment Information
              </h3>
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Payment Method
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Currency
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.currency}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Purchase Type
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {selectedPayment.purchase_type}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Discount Applied
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {formatMoney(
                        Number(selectedPayment.discount_applied),
                        selectedPayment.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Items */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Purchase Items ({selectedPayment.purchase?.items.length})
              </h3>
              <div className='space-y-3'>
                {selectedPayment.purchase?.items.map((item, index) => (
                  <div
                    key={item.id}
                    className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <h4 className='font-medium text-gray-900 dark:text-white'>
                          {item.name}
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          Type: {getPurchaseTypeLabel(item.purchase_type)} |
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-gray-900 dark:text-white'>
                          {formatMoney(item.price, selectedPayment.currency)}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {formatMoney(item.price, selectedPayment.currency)}{' '}
                          each
                        </p>
                      </div>
                    </div>
                    {/* Course Learning Button in Modal */}
                    {item.purchase_type === ProductType.COURSE &&
                      selectedPayment.payment_status ===
                        PaymentStatus.SUCCESS && (
                        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
                          <button
                            onClick={() => {
                              handlePreviewCourse(item.product_id);
                              setShowPaymentModal(false);
                            }}
                            className='bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200'
                          >
                            <BookOpen className='w-4 h-4' />
                            Start Learning
                          </button>
                        </div>
                      )}
                    {item.purchase_type === ProductType.DIGITAL_PRODUCT &&
                      selectedPayment.payment_status ===
                        PaymentStatus.SUCCESS && (
                        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
                          <button
                            className='bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200'
                            onClick={() =>
                              handleDownload(
                                selectedPayment?.full_purchases_details?.items[
                                  index
                                ]?.details?.product?.zip_file.url
                              )
                            }
                          >
                            <DownloadIcon className='w-4 h-4' />
                            Download
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>
                Business Information
              </h3>
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Business Name
                    </p>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/b/${selectedPayment.business_info.business_slug}`}
                      target='_blank'
                      className='hover:underline font-medium text-gray-900 dark:text-white'
                    >
                      {selectedPayment.business_info.business_name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Order Section */}
            {selectedPayment.payment_status === PaymentStatus.PENDING && (
              <div className='pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end'>
                <button
                  onClick={() => setCancelOrderOpenModal(true)}
                  className=' bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-200'
                  disabled={isSubmittingPaymentCancellation}
                >
                  {isSubmittingPaymentCancellation ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <X className='w-4 h-4' />
                      Cancel Order
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ActionConfirmationModal
        body={`Are you sure you want to cancel this order - #${shortenId(
          selectedPayment?.id!
        )}`}
        openModal={cancelOrderOpenModal}
        setOpenModal={setCancelOrderOpenModal}
        allowAction={allowCancelOrderAction}
        setAllowAction={setAllowCancelOrderAction}
      />
    </main>
  );
};

export default Orders;
