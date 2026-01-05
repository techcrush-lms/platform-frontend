'use client';

import { useState } from 'react';
import { InvoiceStep } from '@/constants/index';
import InvoiceStepper from './InvoiceStepper';

import CustomerInfoStep from './steps/CustomerInfoStep';
import InvoiceDetailsStep from './steps/InvoiceDetailsStep';
import PaymentMethodsStep from './steps/PaymentMethodsStep';
import PreviewInvoiceStep from './steps/PreviewInvoiceStep';
import SendInvoiceStep from './steps/SendInvoiceStep';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { prepareInvoiceData } from '@/redux/slices/invoiceSlice';

const CreateInvoiceLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCustomerId } = useSelector((state: RootState) => state.org);
  const { createInvoiceData } = useSelector(
    (state: RootState) => state.invoice
  );
  const [step, setStep] = useState<InvoiceStep>(InvoiceStep.CUSTOMER);

  const handleCustomerInfoNextCta = () => {
    setStep(InvoiceStep.DETAILS);
    dispatch(
      prepareInvoiceData({ ...createInvoiceData!, user_id: selectedCustomerId })
    );
  };

  const renderStep = () => {
    switch (step) {
      case InvoiceStep.CUSTOMER:
        return <CustomerInfoStep onNext={() => handleCustomerInfoNextCta()} />;
      case InvoiceStep.DETAILS:
        return (
          <InvoiceDetailsStep
            onNext={() => setStep(InvoiceStep.PAYMENT)}
            onBack={() => setStep(InvoiceStep.CUSTOMER)}
          />
        );
      case InvoiceStep.PAYMENT:
        return (
          <PaymentMethodsStep
            onNext={() => setStep(InvoiceStep.PREVIEW)}
            onBack={() => setStep(InvoiceStep.DETAILS)}
          />
        );
      case InvoiceStep.PREVIEW:
        return (
          <PreviewInvoiceStep
            onNext={() => setStep(InvoiceStep.SEND)}
            onBack={() => setStep(InvoiceStep.PAYMENT)}
          />
        );
      case InvoiceStep.SEND:
        return <SendInvoiceStep />;
    }
  };

  return (
    <div className='flex flex-col lg:flex-row gap-4'>
      {/* Left Stepper */}
      <InvoiceStepper currentStep={step} onStepClick={setStep} />

      {/* Right Content */}
      <section className='flex-1 bg-white dark:bg-transparent dark:border-gray-600 dark:text-white text-gray-800 border rounded-xl p-8'>
        {renderStep()}
      </section>
    </div>
  );
};

export default CreateInvoiceLayout;
