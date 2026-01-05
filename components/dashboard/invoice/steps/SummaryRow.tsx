import { cn, formatMoney } from '@/lib/utils';
import React from 'react';

const SummaryRow = ({
  label,
  value,
  deduct = false,
}: {
  label: string;
  value: number;
  deduct?: boolean;
}) => (
  <div
    className={cn(
      'flex justify-between text-sm text-muted-foreground',
      deduct && 'text-red-600'
    )}
  >
    <span>{label}</span>
    <span>
      {deduct && '-'}
      {formatMoney(value)}
    </span>
  </div>
);

export default SummaryRow;
