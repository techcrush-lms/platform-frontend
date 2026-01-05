import { formatCurrency } from '@/lib/utils';
import SummaryRow from '../steps/SummaryRow';

interface TotalsSectionProps {
  subtotal: number;
  vatAmount: number;
  total: number;
  isCouponApplied?: boolean;
  discount?: number;
}

const TotalsSection = ({
  subtotal,
  vatAmount,
  total,
  isCouponApplied,
  discount = 0,
}: TotalsSectionProps) => {
  return (
    <div className='space-y-2 text-sm max-w-md ml-auto'>
      <SummaryRow label='Subtotal' value={subtotal} />
      <SummaryRow label='VAT' value={vatAmount} />

      {isCouponApplied && (
        <SummaryRow label='Discount' deduct value={discount} />
      )}

      <div className='flex justify-between font-semibold pt-2'>
        <span>Total</span>
        <span>{formatCurrency(String(total))}</span>
      </div>
    </div>
  );
};

export default TotalsSection;
