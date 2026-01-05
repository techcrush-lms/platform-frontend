import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
// import { convertCurrency } from '@/redux/slices/walletSlice'; // hypothetical thunk

const CurrencyConversionModal = ({
  isConvertModalOpen,
  setConvertModalOpen,
  walletBalance,
  currentCurrency,
}: {
  isConvertModalOpen: boolean;
  setConvertModalOpen: (open: boolean) => void;
  walletBalance: string;
  currentCurrency: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [step, setStep] = useState(1);

  const { org } = useSelector((state: RootState) => state.org);

  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };

  const getCurrencySymbol = (code: string) =>
    currencySymbols[code.toUpperCase()] || code.toUpperCase();

  const handleConvert = async () => {
    if (!convertAmount || Number(convertAmount) <= 0) return;
    if (!targetCurrency) {
      toast.error('Please select a target currency');
      return;
    }

    const payload = {
      amount: Number(convertAmount),
      from: currentCurrency,
      to: targetCurrency,
      business_id: org?.id!,
    };

    setIsLoading(true);

    try {
      // const resultAction = await dispatch(convertCurrency(payload));

      // if (resultAction.type === 'wallet/convert/rejected') {
      //   throw new Error(resultAction.payload as string);
      // }

      toast.success('Currency converted successfully');
      setConvertAmount('');
      setTargetCurrency('');
      setStep(1);
      setConvertModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Conversion failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isConvertModalOpen}
      onClose={() => {
        setStep(1);
        setConvertModalOpen(false);
      }}
      title='Convert Currency'
    >
      <div className='space-y-4'>
        <div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Available Balance ({currentCurrency})
          </p>
          <p className='text-xl font-semibold text-blue-600'>{walletBalance}</p>
        </div>

        {step === 1 && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Amount to Convert
              </label>
              <Input
                type='number'
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                placeholder={`${getCurrencySymbol(currentCurrency)}500`}
                className='w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-600 dark:text-white'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Converted to
              </label>
              <Input
                type='number'
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                placeholder={`${getCurrencySymbol(currentCurrency)}500`}
                className='w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-600 dark:text-white'
                readOnly
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className='text-center space-y-3'>
            <p className='text-gray-600 dark:text-gray-300'>
              You are about to convert{' '}
              <strong>
                {getCurrencySymbol(currentCurrency)} {convertAmount}
              </strong>{' '}
              from {currentCurrency} to {targetCurrency}.
            </p>
            <p className='text-sm text-gray-500'>
              Please confirm this transaction.
            </p>
          </div>
        )}

        {/* ==== Buttons === */}
        <div className='flex justify-end gap-2'>
          {step === 1 && (
            <>
              <Button
                variant='outline'
                className='dark:border-gray-600 dark:text-white text-gray-600'
                onClick={() => setConvertModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !convertAmount ||
                  Number(convertAmount) <= 0 ||
                  !targetCurrency
                }
                onClick={() => setStep(2)}
                className='dark:text-white'
              >
                Proceed
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button
                variant='outline'
                className='dark:border-gray-600 dark:text-white text-gray-600'
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleConvert}
                className='dark:text-white'
              >
                {isLoading && <LoadingIcon />}
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CurrencyConversionModal;
