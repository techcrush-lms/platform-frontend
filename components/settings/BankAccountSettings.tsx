'use client';

import React, { use, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Input from '../ui/Input';
import { Label } from '../ui/label';
import { Button } from '../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Icon from '../ui/Icon';
import useBanks from '@/hooks/page/useBanks';
import {
  fetchOrg,
  resolveAccount,
  saveWithdrawalAccount,
  setOnboardingStep,
  updateOnboardingProcess,
} from '@/redux/slices/orgSlice';
import toast from 'react-hot-toast';
import LoadingIcon from '../ui/icons/LoadingIcon';
import { OnboardingProcess } from '@/lib/utils';

const defaultValue = {
  business_id: '',
  account_number: '',
  bank_code: '',
  bank_name: '',
};

const BankAccountSettings = () => {
  const { banks, loading } = useBanks();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);

  const [body, setBody] = useState({ ...defaultValue, business_id: org?.id! });
  const [accountName, setAccountName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccountResolve = async (
    bank_name: string,
    account_number: string
  ) => {
    if (account_number.length === 10 && bank_name) {
      const bank = banks.find((bank) => bank.name === bank_name);
      if (bank) {
        try {
          const { payload, type }: any = await dispatch(
            resolveAccount({
              account_number,
              bank_code: bank.code,
            })
          );

          if (type === 'auth/resolve-account/rejected') {
            throw new Error(payload.message);
          }

          setBody((prev) => ({
            ...prev,
            bank_code: payload.details.bank_code,
          }));
          setAccountName(payload.details.account_name);
        } catch (error: any) {
          // console.log(error);
          toast.error(error.message);
        }
      }
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setBody((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'account_number' && value) {
      await handleAccountResolve(body.bank_name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await dispatch(saveWithdrawalAccount(body)).unwrap();

      if (
        !org?.onboarding_status.onboard_processes?.includes(
          OnboardingProcess.WITHDRAWAL_ACCOUNT
        )
      ) {
        // Update onboarding process
        await dispatch(
          updateOnboardingProcess({
            business_id: org?.id!,
            process: OnboardingProcess.WITHDRAWAL_ACCOUNT,
          })
        );
      }

      // Refetch org details
      dispatch(fetchOrg(org?.id!));

      toast.success(response?.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (org && !body.bank_name) {
      const bank = banks.find(
        (bank) => bank.name === org.withdrawal_account?.bank_name
      );
      setBody({
        ...defaultValue,
        bank_name: org.withdrawal_account?.bank_name || '',
        account_number: org.withdrawal_account?.account_number || '',
        business_id: org.id,
        bank_code: bank?.code || '',
      });

      handleAccountResolve(
        org.withdrawal_account?.bank_name,
        org.withdrawal_account?.account_number
      );
    }
  }, [org?.id, banks]);

  return (
    <div className='text-black-1 dark:text-white'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card className='dark:border-gray-600'>
          <CardHeader>
            <CardTitle>Bank Account Information</CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='w-full md:max-w-sm bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden'>
              <div className='flex flex-col gap-4 mt-6'>
                {/* Bank Name */}
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-200'>
                    Bank
                  </div>
                  <div className='text-base font-semibold'>
                    {body.bank_name || '---'}
                  </div>
                </div>

                {/* Account Number */}
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-200'>
                    Account Number
                  </div>
                  <div className='text-lg font-mono tracking-widest'>
                    {body.account_number || '---'}
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <div className='text-xs uppercase tracking-wide text-gray-200'>
                    Account Name
                  </div>
                  <div className='text-base font-semibold'>
                    {accountName || '---'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Name */}
            <div className='space-y-2'>
              <Label htmlFor='bank'>Bank Name</Label>
              <Select
                value={body.bank_name}
                onValueChange={(value) => {
                  setAccountName('');
                  setBody({ ...body, bank_name: value, account_number: '' });
                }}
                required
              >
                <SelectTrigger
                  id='bank'
                  className='w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                >
                  <SelectValue placeholder='Select your bank' />
                </SelectTrigger>
                <SelectContent className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'>
                  {loading ? (
                    <span className='text-gray-500 dark:text-gray-400'>
                      Loading
                    </span>
                  ) : (
                    banks.map((bank, index) => (
                      <SelectItem
                        key={index}
                        value={`${bank.name}`}
                        className='hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                      >
                        {bank.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div className='space-y-2'>
              <Label htmlFor='account-number'>Account Number</Label>
              <Input
                id='account-number'
                type='text'
                inputMode='numeric'
                maxLength={10}
                value={body.account_number}
                onChange={handleChange}
                name='account_number'
                placeholder='Enter 10-digit account number'
                required
              />
            </div>

            {/* Account Name */}
            <div className='space-y-2'>
              <Label htmlFor='account-name'>Account Name</Label>
              <Input
                id='account-name'
                type='text'
                value={accountName}
                readOnly
                placeholder='Enter account name'
                required
              />
            </div>

            {/* Submit Button */}
            <div className='pt-4'>
              <Button
                type='submit'
                variant='primary'
                disabled={isSubmitting}
                className='w-full md:w-auto flex gap-2 items-center'
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <LoadingIcon />
                    Processing...
                  </span>
                ) : (
                  'Save Bank Details'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default BankAccountSettings;
