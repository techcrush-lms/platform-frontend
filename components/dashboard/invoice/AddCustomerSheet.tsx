'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { ChevronDown, PlusIcon } from 'lucide-react';
import { City, Country, State } from 'country-state-city';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import { COUNTRIES } from '@/lib/utils';
import { CreateCustomerProps } from '@/lib/schema/invoice.schema';
import { FaAngleLeft } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import {
  createCustomer,
  fetchCustomers,
  selectCustomer,
} from '@/redux/slices/orgSlice';

const defaultValue: CreateCustomerProps = {
  business_id: '',
  name: '',
  email: '',
};
const defaultBillingValue: CreateCustomerProps['billing'] = {
  country: '',
  state: '',
  city: '',
  address: '',
  postal_code: '',
};

interface AddCustomerSheetProps {
  ctaButton: JSX.Element;
}

const AddCustomerSheet = ({ ctaButton }: AddCustomerSheetProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { org, currentPage } = useSelector((state: RootState) => state.org);
  const [showBilling, setShowBilling] = useState(false);

  const [formData, setFormData] = useState<CreateCustomerProps>({
    ...defaultValue,
    business_id: org?.id!,
  });
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryIso, setSelectedCountryIso] = useState('');
  const [openSheet, setOpenSheet] = useState(false);

  // Country, state, city change
  const handleCountryChange = (countryName: string) => {
    const selected = countries.find((c) => c.name === countryName);
    if (!selected) return;

    setSelectedCountryIso(selected.isoCode);
    setStates(State.getStatesOfCountry(selected.isoCode));
    setCities([]);

    setFormData((prev) => ({
      ...prev!,
      billing: {
        ...prev?.billing!,
        country: selected.name,
      },
    }));
  };

  const handleStateChange = (stateName: string) => {
    const selected = states.find((s) => s.name === stateName);
    if (!selected) return;

    setCities(City.getCitiesOfState(selectedCountryIso, selected.isoCode));

    setFormData((prev) => ({
      ...prev!,
      billing: {
        ...prev?.billing!,
        state: selected.name,
      },
    }));
  };

  const handleCityChange = (cityName: string) => {
    setFormData((prev) => ({
      ...prev!,
      billing: {
        ...prev?.billing!,
        city: cityName,
      },
    }));
  };

  const handleCreateCustomer = async (e: any) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        createCustomer({ payload: formData, business_id: org?.id! })
      ).unwrap();

      dispatch(selectCustomer(response.data.id));

      toast.success(response.message);

      setOpenSheet(false);
    } catch (error: any) {
      console.log(error);

      toast.error(error);
    } finally {
      setFormData({ ...defaultValue, business_id: org?.id! });
    }
  };

  const handleToggleBilling = () => {
    if (!showBilling) {
      setFormData({
        ...formData,
        billing: defaultBillingValue,
      });
    } else {
      setFormData({
        ...formData,
        billing: undefined,
      });
    }
    setShowBilling(!showBilling);
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild onClick={() => setOpenSheet(true)}>
        {ctaButton}
      </SheetTrigger>

      <SheetContent
        side='right'
        className='
        w-full sm:max-w-[450px]
        bg-gray-100 dark:bg-gray-900
        border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-gray-100
      '
      >
        <form onSubmit={handleCreateCustomer}>
          <SheetHeader className='text-left'>
            <SheetTitle className='font-extrabold'>
              Customer Information
            </SheetTitle>
          </SheetHeader>

          <div className='my-6 space-y-6'>
            {/* Customer Info */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>
                  Customer Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  name='name'
                  placeholder='Enter customer name'
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label>
                  Customer Email Address <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  name='email'
                  placeholder='Enter email address'
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Billing Address CTA */}
            <button
              type='button'
              onClick={() => handleToggleBilling()}
              className='flex items-center justify-between w-full text-sm font-medium text-primary'
            >
              <span>
                {showBilling ? (
                  'Hide billing address'
                ) : (
                  <div className='flex items-center'>
                    <PlusIcon size={15} />
                    Add billing address
                  </div>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showBilling ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Billing Address Form */}
            {showBilling && (
              <ThemeDivBorder className='space-y-4 rounded-lg border border-border p-4 bg-white dark:bg-transparent'>
                <h3 className='font-bold'>Billing Address</h3>
                <div>
                  <Label>
                    Select Country <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    name='country'
                    value={formData?.billing?.country! || ''}
                    onValueChange={(value) => handleCountryChange(value)}
                    required
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Country' />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>
                    Select State <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    name='state'
                    value={formData?.billing?.state || ''}
                    onValueChange={(value) => handleStateChange(value)}
                    required
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select State' />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s.name} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>
                    Select City <span className='text-red-500'>*</span>
                  </Label>

                  <Select
                    name='city'
                    value={formData?.billing?.city || ''}
                    onValueChange={(value) => handleCityChange(value)}
                    required
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select City' />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='address'>
                    Address (With state & country){' '}
                    <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    required
                    type='text'
                    id='address'
                    placeholder='Enter Address'
                    value={formData?.billing?.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev!,
                        billing: {
                          ...prev?.billing!,
                          address: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Postal code (optional)
                  </label>
                  <Input
                    type='text'
                    name='postal_code'
                    placeholder='Enter postal code'
                    value={formData?.billing?.postal_code || ''}
                    onChange={(e: any) =>
                      setFormData({
                        ...formData!,
                        billing: {
                          ...formData?.billing!,
                          postal_code: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>
              </ThemeDivBorder>
            )}
          </div>

          <SheetFooter className='flex'>
            <div className='flex justify-between w-full'>
              <SheetClose asChild>
                <Button type='button' variant='link' className='px-0'>
                  <FaAngleLeft />
                  Go Back
                </Button>
              </SheetClose>
              <Button type='submit' variant='primary' className='sm:w-auto'>
                Create Customer
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddCustomerSheet;
