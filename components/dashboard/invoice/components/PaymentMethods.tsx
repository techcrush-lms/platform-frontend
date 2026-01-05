import { Badge } from '@/components/ui/badge';

interface PaymentMethodsProps {
  paymentMethods: string[];
}

const PaymentMethods = ({ paymentMethods }: PaymentMethodsProps) => {
  return (
    <div className='space-y-2 text-sm'>
      <p className='font-medium'>Payment Methods</p>
      <div className='flex flex-wrap gap-2'>
        {paymentMethods.map((payment_method, index) => (
          <Badge key={index} variant='outline'>
            {payment_method.split('_').join(' ')}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
