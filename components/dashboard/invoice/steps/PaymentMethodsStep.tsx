'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { prepareInvoiceData } from '@/redux/slices/invoiceSlice';
import {
  CreateInvoicePayload,
  PaymentMethod,
} from '@/lib/schema/invoice.schema';

interface PaymentMethodsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentMethodsStep: React.FC<PaymentMethodsStepProps> = ({
  onNext,
  onBack,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { createInvoiceData } = useSelector(
    (state: RootState) => state.invoice
  );

  const { customers, selectedCustomerId } = useSelector(
    (state: RootState) => state.org
  );

  const [form, setForm] = useState<CreateInvoicePayload>({
    ...createInvoiceData!,
    user_id: selectedCustomerId,
    payment_methods: [PaymentMethod.BANK_TRANSFER, PaymentMethod.PAYSTACK],
  });

  const handleContinue = () => {
    console.log(form);

    dispatch(prepareInvoiceData(form));
    onNext();
  };

  return (
    <div className='space-y-8'>
      <h2 className='text-lg font-semibold'>Payment Methods</h2>

      {/* Payment Methods */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-3'>
          <Checkbox name='card' id='card' checked={true} disabled={true} />
          <Label htmlFor='card' className='cursor-pointer'>
            Card Payments
          </Label>
        </div>

        <div className='flex items-center space-x-3'>
          <Checkbox name='bank' id='bank' checked={true} disabled={true} />
          <Label htmlFor='bank' className='cursor-pointer'>
            Bank Transfer
          </Label>
        </div>
      </div>

      {/* Payment Terms */}
      <div className='space-y-2'>
        <Label>Payment Terms</Label>
        <Select defaultValue='full' value='full'>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select payment term' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='full'>Full Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-between pt-4'>
        <Button
          variant='outline'
          className='border dark:border-gray-600 border-gray-200'
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
};

export default PaymentMethodsStep;
