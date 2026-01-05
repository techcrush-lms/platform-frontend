import { Button } from '@/components/ui/Button';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import useOrg from '@/hooks/page/useOrg';
import {
  createWithdrawal,
  fetchWithdrawals,
} from '@/redux/slices/withdrawalSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const WithdrawalModal = ({
  isWithdrawModalOpen,
  setWithdrawModalOpen,
  walletBalance,
  currency,
}: {
  isWithdrawModalOpen: boolean;
  setWithdrawModalOpen: (open: boolean) => void;
  walletBalance: string;
  currency: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [step, setStep] = useState(1);

  const { org } = useSelector((state: RootState) => state.org);

  // Currency symbol mapping
  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };

  const getCurrencySymbol = (code: string) =>
    currencySymbols[code.toUpperCase()] || code.toUpperCase();

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    if (!withdrawPassword) {
      toast.error('Please enter your password');
      return;
    }

    const payload = {
      amount: Number(withdrawAmount),
      currency,
      password: withdrawPassword,
    };

    setIsLoading(true);

    try {
      const resultAction = await dispatch(
        createWithdrawal({
          payload,
          business_id: org?.id!,
        })
      );

      if (resultAction.type === 'withdrawal/create/rejected') {
        throw new Error(resultAction.payload as string);
      }

      toast.success('Withdrawal request created successfully');
      dispatch(fetchWithdrawals({ page: 1, limit: 5 }));
      setWithdrawAmount('');
      setWithdrawPassword('');
      setStep(1);
      setWithdrawModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isWithdrawModalOpen}
      onClose={() => {
        setStep(1);
        setWithdrawModalOpen(false);
      }}
      title='Withdraw Funds'
    >
      <div className='space-y-4'>
        <div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Available Balance
          </p>
          <p className='text-xl font-semibold text-blue-600'>{walletBalance}</p>
        </div>

        {step === 1 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Amount to Withdraw
            </label>
            <Input
              type='number'
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`${getCurrencySymbol(currency)}5000`}
              className='w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-600 dark:text-white'
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Password
            </label>
            <Input
              type='password'
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder='Enter your password'
              className='w-full px-4 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-600 dark:text-white'
            />
          </div>
        )}

        {/* ==== Buttons === */}
        <div className='flex justify-end gap-2'>
          {step === 1 && (
            <>
              <Button
                variant='outline'
                className='dark:border-gray-600 dark:text-white text-gray-600'
                onClick={() => setWithdrawModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
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
                disabled={!withdrawPassword}
                onClick={handleWithdraw}
                className='dark:text-white'
              >
                {isLoading && <LoadingIcon />}
                Submit
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawalModal;
