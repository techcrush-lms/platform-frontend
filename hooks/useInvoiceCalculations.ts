import { useMemo } from 'react';
import { CreateInvoicePayload } from '@/lib/schema/invoice.schema';

interface UseInvoiceCalculationsProps {
  createInvoiceData: CreateInvoicePayload | null;
  couponDiscount: number;
}

export const useInvoiceCalculations = ({
  createInvoiceData,
  couponDiscount,
}: UseInvoiceCalculationsProps) => {
  const invoiceItems = createInvoiceData?.invoice_items ?? [];

  // Calculate subtotal
  const subtotal = useMemo(
    () =>
      invoiceItems.reduce((sum, item) => sum + item.quantity * item.amount, 0),
    [invoiceItems]
  );

  // Calculate VAT amount
  const vatAmount = useMemo(() => {
    if (!createInvoiceData?.is_vat_applied) return 0;
    return (subtotal * (createInvoiceData?.vat ?? 0)) / 100;
  }, [subtotal, createInvoiceData?.is_vat_applied, createInvoiceData?.vat]);

  // Calculate total
  const total = useMemo(() => {
    return subtotal + vatAmount - couponDiscount;
  }, [subtotal, vatAmount, couponDiscount]);

  return {
    subtotal,
    vatAmount,
    total,
    invoiceItems,
  };
};
