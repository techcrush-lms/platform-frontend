import Input from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCurrencies from '@/hooks/page/useCurrencies';
import { PlanPriceProps } from '@/lib/schema/subscription.schema';
import { XIcon } from 'lucide-react';

export const SubscriptionPlanPriceFields: React.FC<PlanPriceProps> = ({
  plan_price_tier,
  periods,
  index,
  onPlanPriceTierChange,
  onRemovePlanPriceTier,
}) => {
  const { foreignCurrencies } = useCurrencies();

  // Handles both flat fields and nested other_currencies
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('other_currencies')) {
      const match = name.match(/other_currencies\[(\d+)\]\.(\w+)/);
      if (match) {
        const currencyIndex = parseInt(match[1], 10);
        const field = match[2];

        onPlanPriceTierChange(index, 'other_currencies', {
          currencyIndex,
          field,
          value,
          defaultCurrency: foreignCurrencies()?.[currencyIndex]?.currency || '',
        });
        return;
      }
    }

    // Normal tier fields
    onPlanPriceTierChange(index, name, value);
  };

  return (
    <>
      {/* Plan price tier basic info */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='dark:text-white font-medium mb-1 block'>
            Price (NGN)<span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            placeholder='Price (₦)'
            value={plan_price_tier.price}
            onChange={(e) =>
              onPlanPriceTierChange(index, 'price', e.target.value)
            }
            required
          />
        </div>
        {foreignCurrencies()?.map((product_currency, i) => (
          <div key={i} className='flex-1'>
            <label className='dark:text-white font-medium mb-1 block'>
              Price ({product_currency.currency}){' '}
              <span className='text-red-500'>*</span>
            </label>
            <Input
              type='text'
              name={`other_currencies[${i}].price`}
              className='w-full rounded-md'
              value={plan_price_tier.other_currencies?.[i]?.price ?? ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        {/* Period Select */}
        <div>
          <label className='dark:text-white font-medium mb-1 block'>
            Period <span className='text-red-500'>*</span>
          </label>
          <Select
            value={plan_price_tier.period}
            name='period'
            onValueChange={(value) =>
              onPlanPriceTierChange(index, 'period', value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a period' />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period.replace(/_/g, ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex justify-end'>
        {/* Remove button */}
        <button
          type='button'
          onClick={() => onRemovePlanPriceTier(index)}
          className='text-red-500 hover:underline'
        >
          <XIcon className='w-4 h-4' />
        </button>
      </div>
    </>
  );
};
