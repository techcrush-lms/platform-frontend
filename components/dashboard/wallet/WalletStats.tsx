// components/WalletDashboard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, CreditCard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import WithdrawalModal from '../withdrawal/WithdrawalModal';
import { formatMoney, reorderWallets } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BusinessWallet } from '@/types/org';
import WalletOverview from './WalletOverview';
import CurrencyConversionModal from '../withdrawal/CurrencyConversionModal';

export default function WalletStats() {
  const { org } = useSelector((state: RootState) => state.org);
  const { payments, details } = useSelector(
    (state: RootState) => state.payment
  );

  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isConvertModalOpen, setConvertModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');

  // Reorder the wallets (NGN first)
  const wallets: BusinessWallet[] = useMemo(
    () => reorderWallets(org?.business_wallet || []),
    [org]
  );

  // Find the selected wallet (default NGN)
  const selectedWallet = wallets.find(
    (wallet) => wallet.currency === selectedCurrency
  );

  const walletBalance = selectedWallet
    ? formatMoney(+selectedWallet.balance || 0, selectedWallet.currency)
    : formatMoney(0, selectedCurrency);

  return (
    <div className='flex gap-6 w-full overflow-x-auto'>
      <WalletOverview
        details={details}
        wallets={wallets}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        walletBalance={walletBalance}
        showBalance={showBalance}
        setShowBalance={setShowBalance}
        setWithdrawModalOpen={setWithdrawModalOpen}
        setConvertModalOpen={setConvertModalOpen}
      />

      {/* Withdraw Modal */}
      <WithdrawalModal
        walletBalance={formatMoney(
          +selectedWallet?.balance! || 0,
          selectedCurrency
        )}
        currency={selectedCurrency}
        isWithdrawModalOpen={isWithdrawModalOpen}
        setWithdrawModalOpen={setWithdrawModalOpen}
      />

      <CurrencyConversionModal
        walletBalance={formatMoney(
          +selectedWallet?.balance! || 0,
          selectedCurrency
        )}
        currentCurrency={selectedCurrency}
        isConvertModalOpen={isConvertModalOpen}
        setConvertModalOpen={setConvertModalOpen}
      />
    </div>
  );
}
