'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Checkbox from '@/components/ui/Checkbox';
import { X, Plus } from 'lucide-react';
import ThemeDiv from '@/components/ui/ThemeDiv';
import {
  CreateInvoicePayload,
  Currency,
  InvoiceStatus,
} from '@/lib/schema/invoice.schema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { prepareInvoiceData } from '@/redux/slices/invoiceSlice';
import { applyCoupon } from '@/redux/slices/couponSlice';
import toast from 'react-hot-toast';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SummaryRow from './SummaryRow';

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const INVOICE_FORM_STORAGE_KEY = 'invoice_draft';

const InvoiceDetailsStep = ({ onNext, onBack }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const { customers, selectedCustomerId } = useSelector(
    (state: RootState) => state.org
  );
  const { createInvoiceData } = useSelector(
    (state: RootState) => state.invoice
  );

  const { coupon_info } = useSelector((state: RootState) => state.coupon);

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Customer details
  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId
  );

  const [form, setForm] = useState<CreateInvoicePayload>(() => {
    const saved = localStorage.getItem(INVOICE_FORM_STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(INVOICE_FORM_STORAGE_KEY);
      }
    }

    return {
      ...createInvoiceData!,
      user_id: selectedCustomerId,
      status: createInvoiceData?.status ?? InvoiceStatus.PUBLISHED,
      invoice_items: createInvoiceData?.invoice_items?.length
        ? createInvoiceData.invoice_items
        : [{ item: '', quantity: 1, amount: 0 }],
    };
  });

  console.log(createInvoiceData);

  /* -------------------- Handlers -------------------- */

  const updateField = (key: keyof CreateInvoicePayload, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...form.invoice_items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, invoice_items: items });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      invoice_items: [
        ...prev?.invoice_items,
        { item: '', quantity: 1, amount: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      invoice_items: prev.invoice_items.filter((_, i) => i !== index),
    }));
  };

  /* -------------------- Calculations -------------------- */

  const subtotal = useMemo(() => {
    return form.invoice_items.reduce(
      (sum, item) => sum + item.quantity * item.amount,
      0
    );
  }, [form.invoice_items]);

  const vatAmount = useMemo(() => {
    return form.is_vat_applied ? (subtotal * form.vat || 0) / 100 : 0;
  }, [subtotal, form.is_vat_applied, form.vat]);

  const total = subtotal - coupon_info.discount + vatAmount;

  /* -------------------- Navigation -------------------- */

  const handleContinue = () => {
    if (!form.issued_at || !form.due_at) {
      toast.error('Please select issue and due dates');
      return;
    }

    dispatch(prepareInvoiceData(form));

    onNext();
  };

  /** -------------------- Dispatch ---------------------- */
  const handleApplyCoupon = async () => {
    try {
      setIsApplyingCoupon(true);

      const res = await dispatch(
        applyCoupon({
          email: selectedCustomer?.email!,
          code: form?.coupon_code!,
          amount: String(subtotal),
        })
      ).unwrap();

      toast.success('Coupon applied');
    } catch (error: any) {
      console.log(error);

      toast.error(error || error.message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(INVOICE_FORM_STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  /* -------------------- UI -------------------- */

  return (
    <section className='space-y-8 max-w-5xl'>
      {/* Header */}
      <div>
        <h2 className='text-xl font-semibold'>Invoice Information</h2>
        <div className='h-px bg-border mt-1' />
      </div>

      {/* Title */}
      <div className='space-y-2 max-w-xl'>
        <Label>Invoice Title</Label>
        <Input
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder='Website Development Invoice'
        />
      </div>

      {/* Currency */}
      <div className='space-y-2 max-w-xl'>
        <Label>Currency</Label>
        <Select
          value={form.currency}
          onValueChange={(value) => updateField('currency', value as Currency)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select currency' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Currency).map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items */}
      <div className='space-y-4'>
        <div className='grid grid-cols-12 gap-4 text-sm text-muted-foreground bg-muted/40 px-4 py-3 rounded-md'>
          <span className='col-span-6'>Item</span>
          <span className='col-span-2'>Qty</span>
          <span className='col-span-3'>Amount</span>
        </div>

        {form.invoice_items.map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-12 gap-4 items-center px-4'
          >
            <Input
              className='col-span-6'
              value={item.item}
              placeholder='Item description'
              onChange={(e) => updateItem(index, 'item', e.target.value)}
            />
            <Input
              className='col-span-2'
              type='number'
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, 'quantity', Number(e.target.value))
              }
            />
            <Input
              className='col-span-3'
              type='number'
              value={item.amount}
              onChange={(e) =>
                updateItem(index, 'amount', Number(e.target.value))
              }
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => removeItem(index)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}

        <Button variant='ghost' onClick={addItem} className='text-primary'>
          <Plus className='h-4 w-4 mr-1' />
          Add Item
        </Button>
      </div>

      {/* Charges */}
      <div className='space-y-4 max-w-xl'>
        <Label>Additional Charges</Label>

        <ThemeDiv className='flex justify-between px-4 py-3 border rounded-md'>
          <div className='flex items-center gap-3'>
            <Checkbox
              name='is_vat_applied'
              checked={form.is_vat_applied}
              onChange={(e: any) =>
                updateField('is_vat_applied', !form.is_vat_applied)
              }
            />
            <Label className='font-normal'>Apply VAT</Label>
          </div>

          <Input
            type='number'
            className='w-20'
            disabled={!form.is_vat_applied}
            value={form.vat}
            onChange={(e) => updateField('vat', Number(e.target.value))}
          />
        </ThemeDiv>
      </div>

      {/* Coupon */}
      <div className='space-y-4 max-w-xl'>
        <Label>Coupon</Label>

        <ThemeDiv className='flex justify-between px-4 py-3 border rounded-md'>
          <div className='flex items-center gap-3'>
            <Checkbox
              name='is_coupon_applied'
              checked={form.is_coupon_applied}
              onChange={(e: any) =>
                updateField('is_coupon_applied', !form.is_coupon_applied)
              }
            />
            <Label className='font-normal'>Apply Coupon</Label>
          </div>

          <div className='flex items-center gap-2'>
            <Input
              type='text'
              className='w-40'
              disabled={!form.is_coupon_applied}
              value={form.coupon_code}
              onChange={(e) => updateField('coupon_code', e.target.value)}
              placeholder='Enter code'
            />

            <Button
              type='button'
              size='sm'
              variant='outline'
              disabled={!form.is_coupon_applied || !form.coupon_code}
              onClick={() => handleApplyCoupon()}
            >
              Apply
            </Button>
          </div>
        </ThemeDiv>
      </div>

      {/* Dates */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl'>
        <div className='space-y-2'>
          <Label>
            Issue Date <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='date'
            value={form.issued_at}
            onChange={(e) => updateField('issued_at', e.target.value)}
          />
        </div>

        <div className='space-y-2'>
          <Label>
            Due Date <span className='text-red-500'>*</span>
          </Label>
          <Input
            type='date'
            value={form.due_at}
            min={form.issued_at || undefined}
            onChange={(e) => updateField('due_at', e.target.value)}
          />
        </div>
      </div>

      {/* Status */}
      <div className='space-y-2 max-w-xl'>
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) =>
            updateField('status', value as InvoiceStatus)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={InvoiceStatus.PUBLISHED}>PUBLISHED</SelectItem>
            <SelectItem value={InvoiceStatus.DRAFT}>DRAFT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className='space-y-2 max-w-3xl'>
        <Label>Additional Notes</Label>
        <Textarea
          value={form.additional_notes}
          onChange={(e) => updateField('additional_notes', e.target.value)}
          placeholder='Thank you for your patronage.'
        />
      </div>

      {/* Summary */}
      <div className='flex justify-end'>
        <div className='w-full max-w-sm space-y-2 border-t pt-4'>
          <SummaryRow label='Subtotal' value={subtotal} />
          <SummaryRow label='VAT' value={vatAmount} />
          {form.is_coupon_applied && (
            <SummaryRow
              label='Discount'
              deduct={true}
              value={coupon_info.discount}
            />
          )}
          <div className='flex justify-between font-semibold pt-2'>
            <span>Total</span>
            <span>{formatCurrency(String(total))}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='flex justify-between pt-6 border-t'>
        <Button variant='outline' onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </section>
  );
};

export default InvoiceDetailsStep;
