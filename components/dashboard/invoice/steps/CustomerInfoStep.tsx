'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { User } from 'lucide-react';

import AddCustomerSheet from '@/components/dashboard/invoice/AddCustomerSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import useCustomers from '@/hooks/page/useCustomers';
import { PlusCircle, PlusIcon } from 'lucide-react';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchCustomers, selectCustomer } from '@/redux/slices/orgSlice';
import toast from 'react-hot-toast';
import { prepareInvoiceData } from '@/redux/slices/invoiceSlice';

const CUSTOMER_SELECTION_STORAGE_KEY = 'selected_customer';

const CustomerInfoStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    customers,
    page_customers,
    count,
    customersLoading,
    limit,
    currentPage,
  } = useCustomers();
  const { org, selectedCustomerId } = useSelector(
    (state: RootState) => state.org
  );

  const { createInvoiceData } = useSelector(
    (state: RootState) => state.invoice
  );

  const [open, setOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchMoreCustomers = async () => {
    dispatch(
      fetchCustomers({
        page: currentPage + 1,
        limit: limit,
        ...(org?.id && { business_id: org?.id as string }),
      })
    );
  };

  const customer_comp = Boolean(count) ? (
    <>
      {customers.map((customer) => (
        <SelectItem key={customer.id} value={customer.id}>
          {customer.name} ({customer.email})
        </SelectItem>
      ))}
      {count > limit && Boolean(page_customers.length) && (
        <div
          className='mx-auto text-center flex items-center justify-center text-sm'
          onClick={fetchMoreCustomers}
        >
          <FaAngleDoubleDown /> Load more
        </div>
      )}
    </>
  ) : (
    <AddCustomerSheet
      ctaButton={
        (
          <div className='flex items-center px-2 gap-1 py-1 text-sm'>
            <PlusCircle size={14} /> Create a new customer
          </div>
        ) as JSX.Element
      }
    />
  );

  const handleSelectCustomer = (value: string) => {
    dispatch(selectCustomer(value));

    localStorage.setItem(CUSTOMER_SELECTION_STORAGE_KEY, value);
  };

  const handleContinue = () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    dispatch(
      prepareInvoiceData({
        ...createInvoiceData!,
        user_id: selectedCustomerId,
      })
    );

    onNext();
  };

  useEffect(() => {
    const savedCustomerId = localStorage.getItem(
      CUSTOMER_SELECTION_STORAGE_KEY
    );

    if (savedCustomerId && savedCustomerId !== selectedCustomerId) {
      dispatch(selectCustomer(savedCustomerId));
    }
  }, []);

  useEffect(() => {
    if (!selectedCustomerId || !customers.length) {
      setSelectedCustomer(null);
      return;
    }

    const customer = customers.find(
      (customer) => customer.id === selectedCustomerId
    );

    setSelectedCustomer(customer || null);
  }, [selectedCustomerId, customers]);

  return (
    <section className='space-y-8'>
      {/* Header */}
      <div>
        <h2 className='text-xl font-semibold tracking-tight text-foreground'>
          Customer Information
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Select an existing customer or add a new one
        </p>
      </div>

      {/* Select Box Area */}
      <div className='space-y-3 max-w-md'>
        <Label>
          Customer <span className='text-red-500'>*</span>
        </Label>
        <Select
          name='customer'
          value={selectedCustomerId}
          onValueChange={(value) => handleSelectCustomer(value)}
          required
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Search or select a customer' />
          </SelectTrigger>
          <SelectContent>{customer_comp}</SelectContent>
        </Select>
      </div>

      {selectedCustomer && (
        <div
          className='
      flex items-start gap-3
      rounded-lg border dark:border-gray-500
      bg-primary-main/50 dark:bg-primary-main
      p-4 text-sm  max-w-md
    '
        >
          {/* Icon */}
          <div
            className='
        flex h-9 w-9 items-center justify-center
        rounded-full bg-primary dark:bg-white dark:hover:bg-none  dark:text-primary-main text-primary-foreground
      '
          >
            <User className='hover:bg-none' size={18} />
          </div>

          {/* Details */}
          <div className='space-y-0.5'>
            <p className='font-medium text-foreground'>
              {selectedCustomer.name}
            </p>
            <p className='text-muted-foreground'>{selectedCustomer.email}</p>
          </div>
        </div>
      )}

      <AddCustomerSheet
        ctaButton={
          <Button
            type='button'
            variant='ghost'
            className='
          flex items-center justify-start gap-2
          h-auto px-0
          text-sm font-medium text-primary
          hover:bg-transparent hover:underline
        '
          >
            <PlusIcon size={15} />
            <span>Add new customer</span>
          </Button>
        }
      />

      {/* Footer */}
      <div className='flex justify-end pt-6 border-border'>
        <Button
          variant='primary'
          onClick={handleContinue}
          className='min-w-[120px]'
        >
          Continue
        </Button>
      </div>
    </section>
  );
};

export default CustomerInfoStep;
