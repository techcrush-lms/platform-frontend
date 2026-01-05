import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { SendInvoicePayload } from '@/lib/schema/invoice.schema';
import toast from 'react-hot-toast';
import { createInvoice, sendInvoice } from '@/redux/slices/invoiceSlice';

// Custom hooks
import { usePreviewInvoice } from '@/hooks/usePreviewInvoice';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations';

// Components
import CompanyHeader from '../components/CompanyHeader';
import InvoiceMeta from '../components/InvoiceMeta';
import ItemsTable from '../components/ItemsTable';
import TotalsSection from '../components/TotalsSection';
import PaymentMethods from '../components/PaymentMethods';

interface PreviewInvoiceStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PreviewInvoiceStep: React.FC<PreviewInvoiceStepProps> = ({
  onNext,
  onBack,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSending, setIsSending] = useState(false);

  // Use custom hooks for data and calculations
  const { org, profile, createInvoiceData, coupon_info, selectedCustomer } =
    usePreviewInvoice();

  const { subtotal, vatAmount, total, invoiceItems } = useInvoiceCalculations({
    createInvoiceData,
    couponDiscount: coupon_info.discount,
  });

  const handleSendInvoice = async () => {
    if (!createInvoiceData || !org?.id) {
      toast.error('Missing required data to send invoice');
      return;
    }

    setIsSending(true);

    try {
      // Create the invoice first
      const createResponse = await dispatch(
        createInvoice({
          payload: createInvoiceData,
          business_id: org.id,
        })
      ).unwrap();

      // Then send the invoice
      const sendInvoicePayload: SendInvoicePayload = {
        id: createResponse.data.id,
      };

      const sendResponse = await dispatch(
        sendInvoice({
          payload: sendInvoicePayload,
          business_id: org.id,
        })
      ).unwrap();

      toast.success(sendResponse.message || 'Invoice sent successfully!');

      // Navigate to next step
      onNext();

      // Clean up localStorage
      localStorage.removeItem('selected_customer');
      localStorage.removeItem('invoice_draft');
    } catch (error: any) {
      console.log(300003);
      console.log(error);

      console.error('Failed to send invoice:', error);

      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'Failed to send invoice';
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>Preview Invoice</h2>

      <ThemeDivBorder className='rounded-lg'>
        {/* Company Header */}
        <CompanyHeader
          logoUrl={org?.logo_url}
          businessName={org?.business_name}
          email={profile?.email}
          location={org?.location}
        />

        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Invoice Summary</CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Invoice Meta Information */}
          <InvoiceMeta
            customerName={selectedCustomer?.name}
            issuedAt={createInvoiceData?.issued_at}
            dueAt={createInvoiceData?.due_at}
            status={createInvoiceData?.status}
          />

          <Separator />

          {/* Invoice Items Table */}
          <ItemsTable items={invoiceItems} />

          <Separator />

          {/* Totals Section */}
          <TotalsSection
            subtotal={subtotal}
            vatAmount={vatAmount}
            total={total}
            isCouponApplied={createInvoiceData?.is_coupon_applied}
            discount={coupon_info.discount}
          />

          <Separator />

          {/* Payment Methods */}
          {createInvoiceData?.payment_methods && (
            <PaymentMethods
              paymentMethods={createInvoiceData.payment_methods}
            />
          )}
        </CardContent>
      </ThemeDivBorder>

      {/* Action Buttons */}
      <div className='flex justify-between pt-2'>
        <Button variant='outline' onClick={onBack} disabled={isSending}>
          Back
        </Button>
        <Button
          onClick={handleSendInvoice}
          disabled={isSending || !createInvoiceData}
        >
          {isSending ? 'Sending Invoice...' : 'Send Invoice'}
        </Button>
      </div>
    </div>
  );
};

/* -------------------- Small Helper -------------------- */
const InfoBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className='space-y-1'>
    <p className='text-muted-foreground'>{label}</p>
    <p className='font-medium'>{value || '-'}</p>
  </div>
);

export default PreviewInvoiceStep;
