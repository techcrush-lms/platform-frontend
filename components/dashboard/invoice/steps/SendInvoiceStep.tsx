import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchInvoice } from '@/redux/slices/invoiceSlice';
import toast from 'react-hot-toast';

const SendInvoiceStep = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [copied, setCopied] = useState(false);

  const { invoice, loading } = useSelector((state: RootState) => state.invoice);

  useEffect(() => {
    // Fetch invoice details if we have an ID but no invoice data
    if (invoice) {
      dispatch(fetchInvoice({ id: invoice.id }));
    }
  }, [invoice, dispatch]);

  const handleCopyInvoiceLink = async () => {
    if (!invoice) {
      toast.error('Invoice ID not found');
      return;
    }

    const invoiceUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/invoice/${invoice.invoice_no}`;
    try {
      await navigator.clipboard.writeText(invoiceUrl);
      setCopied(true);
      toast.success('Invoice link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy invoice link');
    }
  };

  const handleCreateAnotherInvoice = () => {
    // Navigate to invoice creation (Redux state will be cleared on navigation)
    router.push('/invoices/create');
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className='flex h-full w-full items-center justify-center px-4'>
        <div className='flex flex-col items-center text-center max-w-md space-y-6 py-20'>
          <div className='animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full'></div>
          <p className='text-muted-foreground'>Loading invoice details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full items-center justify-center px-4'>
      <div className='flex flex-col items-center text-center max-w-md space-y-6 py-20'>
        {/* Success Icon */}
        <div className='flex items-center justify-center h-20 w-20 rounded-full border-4 border-green-500'>
          <Check className='h-10 w-10 text-green-500' />
        </div>

        {/* Success Message */}
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold'>
            Invoice sent successfully to{' '}
            <span className='text-primary'>
              {invoice?.user?.name || 'Customer'}
            </span>
          </h2>
          {invoice?.invoice_no && (
            <p className='text-muted-foreground'>
              Invoice #{invoice.invoice_no}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col items-center gap-4 w-full'>
          <Button
            variant='secondary'
            className='rounded-full px-6'
            onClick={handleCopyInvoiceLink}
            disabled={!invoice?.id}
          >
            <Copy size={13} className='mr-2' />
            {copied ? 'Copied!' : 'Copy Invoice Link'}
          </Button>

          <Button
            className='w-full max-w-xs rounded-full text-base'
            onClick={handleCreateAnotherInvoice}
          >
            Create another invoice
          </Button>
        </div>

        {/* Back Button */}
        <button
          onClick={goBack}
          className='text-sm text-primary hover:underline transition-colors'
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SendInvoiceStep;
