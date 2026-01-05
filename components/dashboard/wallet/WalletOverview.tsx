import React, { useMemo } from 'react';
import Image from 'next/image';
import {
  Eye,
  EyeOff,
  CreditCard,
  CreditCardIcon,
  WalletIcon,
  Repeat,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { EarningsDetails, Payment, PaymentsResponse } from '@/types/payment'; // your types path
import { cn, DEFAULT_CURRENCY } from '@/lib/utils';

interface Wallet {
  currency: string;
  currency_url: string;
}

interface Props {
  details: EarningsDetails | null;
  wallets: Wallet[];
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  walletBalance: string;
  showBalance: boolean;
  setShowBalance: (val: boolean) => void;
  setWithdrawModalOpen: (val: boolean) => void;
  setConvertModalOpen: (val: boolean) => void;
}

const WalletOverview: React.FC<Props> = ({
  details,
  wallets,
  selectedCurrency,
  setSelectedCurrency,
  walletBalance,
  showBalance,
  setShowBalance,
  setWithdrawModalOpen,
  setConvertModalOpen,
}) => {
  // Pick today's earnings + total payments for selected currency
  const currencyDetails = useMemo(() => {
    return (
      details?.by_currency.find((c) => c.currency === selectedCurrency) || {
        currency: selectedCurrency,
        currency_sign: '',
        total_payments: 0,
        gross_amount: 0,
        total_discount: 0,
        net_earnings: 0,
        performance: {
          gross_change: 0,
          net_change: 0,
          payments_change: 0,
        },
      }
    );
  }, [details, selectedCurrency]);

  const isPostiveNumber = currencyDetails.performance.net_change > 0;

  const isDefault = selectedCurrency === DEFAULT_CURRENCY;

  return (
    <div className='flex gap-6 min-w-max w-full'>
      {/* Wallet Balance */}
      <Card className='flex-[2] bg-[#0B0D39] text-white rounded-2xl shadow-md min-h-[180px] border dark:border-gray-700'>
        <CardContent className='p-6 flex flex-col justify-between h-full'>
          <div className='flex justify-between items-start'>
            <div>
              <p className='text-sm text-gray-300'>Wallet Balance</p>
              <div className='flex items-center gap-2 mt-2'>
                <h2 className='text-3xl font-bold'>
                  {showBalance ? walletBalance : '****'}
                </h2>

                {showBalance ? (
                  <Eye
                    className='w-5 h-5 text-gray-400 hover:cursor-pointer'
                    onClick={() => setShowBalance(false)}
                  />
                ) : (
                  <EyeOff
                    className='w-5 h-5 text-gray-400 hover:cursor-pointer'
                    onClick={() => setShowBalance(true)}
                  />
                )}
              </div>
            </div>

            {/* Wallet Selector */}
            <Select
              value={selectedCurrency}
              onValueChange={(value) => setSelectedCurrency(value)}
            >
              <SelectTrigger className='w-[160px] bg-transparent border border-gray-600 text-white rounded-full px-3 py-1'>
                <SelectValue placeholder='Select wallet' />
              </SelectTrigger>
              <SelectContent className='bg-white dark:bg-[#0B0D39] dark:text-white'>
                {wallets.map((wallet) => (
                  <SelectItem
                    key={wallet.currency}
                    value={wallet.currency}
                    className='flex items-center gap-2'
                  >
                    <div className='flex items-center gap-2'>
                      <span className='w-6 h-6 flex items-center justify-center text-lg overflow-hidden'>
                        <Image
                          src={wallet.currency_url}
                          alt={wallet.currency}
                          width={100}
                          height={100}
                        />
                      </span>
                      <span>{wallet.currency} Wallet</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='mt-6 flex items-center gap-4'>
            <Button
              className='bg-white text-[#0B0D39] rounded-lg flex items-center gap-2'
              size='lg'
              onClick={
                isDefault
                  ? () => setWithdrawModalOpen(true)
                  : () => setConvertModalOpen(true)
              }
            >
              {isDefault ? (
                <>
                  <CreditCard className='w-4 h-4' />
                  Withdraw
                </>
              ) : (
                <>
                  <Repeat className='w-4 h-4' />
                  Convert
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today’s Earnings */}
      <Card className='flex-1 rounded-2xl border dark:border-gray-700 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 transition-all hover:shadow-xl hover:scale-[1.01] duration-200'>
        <CardContent className='p-6 flex flex-col justify-between h-full'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Today&apos;s Earnings
            </p>
            <div className='p-2 bg-blue-500/10 rounded-xl'>
              <WalletIcon
                className='text-blue-600 dark:text-blue-400'
                size={22}
              />
            </div>
          </div>

          <h2 className='text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-3'>
            {currencyDetails.net_earnings}
          </h2>

          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Compared to yesterday:{' '}
            {currencyDetails.performance.net_change === 0 ? (
              <span className='text-gray-500 dark:text-gray-400 font-semibold'>
                No change
              </span>
            ) : (
              <span
                className={cn(
                  'font-semibold',
                  currencyDetails.performance.net_change > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {currencyDetails.performance.net_change}%
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Total Payments */}
      <Card className='flex-1 rounded-2xl border dark:border-gray-700 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 transition-all hover:shadow-xl hover:scale-[1.01] duration-200'>
        <CardContent className='p-6 flex flex-col justify-between h-full'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Today&apos;s Total Payments
            </p>
            <div className='p-2 bg-purple-500/10 rounded-xl'>
              <CreditCardIcon
                className='text-purple-600 dark:text-purple-400'
                size={22}
              />
            </div>
          </div>

          <h2 className='text-3xl font-extrabold text-purple-700 dark:text-purple-300 mt-3'>
            {currencyDetails.total_payments.toLocaleString()}
          </h2>

          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Transactions processed successfully today
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletOverview;
