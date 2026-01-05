'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Trash2, Pencil, X, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { City, Country, State } from 'country-state-city';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import useCurrencies from '@/hooks/page/useCurrencies';
import useShippingLocations from '@/hooks/page/useShippingLocations';
import toast from 'react-hot-toast';
import { createShippingLocationSchema } from '@/lib/schema/shipping.schema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  createShipping,
  deleteShippingDetails,
  updateShippingDetails,
} from '@/redux/slices/shippingSlice';
import { OtherCurrencyProps } from '@/lib/schema/product.schema';
import { formatMoney, shortenId } from '@/lib/utils';
import { ShippingLocation } from '@/types/shipping';
import ActionConfirmationModal from '../ActionConfirmationModal';

interface DefaultFormTypes {
  title: string;
  country: string;
  state: string;
  city: string;
  address: string;
  price: number | null;
  other_currencies: OtherCurrencyProps[];
  arrival_time: number | null;
}

const DEFAULT_FORM: DefaultFormTypes = {
  title: '',
  country: '',
  state: '',
  city: '',
  address: '',
  price: null,
  other_currencies: [],
  arrival_time: null,
};

const ShippingLocationSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { org } = useSelector((state: RootState) => state.org);
  const { shippingLocation } = useSelector(
    (state: RootState) => state.shipping
  );

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryIso, setSelectedCountryIso] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { foreignCurrencies } = useCurrencies();

  const {
    shippingLocations,
    loading,
    count,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useShippingLocations();

  const [deleteShippingOpenModal, setDeleteShippingOpenModal] = useState(false);
  const [allowDeleteShippingAction, setAllowDeleteShippingAction] =
    useState(false);
  const [isSubmittingShippingDeletion, setIsSubmittingShippingDeletion] =
    useState(false);

  const [shippingTitle, setShippingTitle] = useState('');
  const [shippingId, setShippingId] = useState('');

  /** -------------------------------
   * Modal Controls
   * ------------------------------- */

  const openAddModal = () => {
    setForm(DEFAULT_FORM);

    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (location: ShippingLocation) => {
    handleCountryStateCityChange(location.country, location.state);

    setForm({
      title: location.title,
      country: location.country,
      state: location.state,
      city: location.city,
      address: location.address,
      price: +location.price,
      other_currencies: location.other_currencies,
      arrival_time: location.arrival_time,
    });

    setEditingId(location.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(DEFAULT_FORM);
  };

  /** -------------------------------
   * CRUD Logic (stubbed)
   * ------------------------------- */
  const handleSave = async () => {
    const payload = { ...form, price: +form?.price! };

    setIsSubmitting(true);

    const { error, value } = createShippingLocationSchema.validate(payload);

    if (error) throw new Error(error.details[0].message);

    try {
      if (editingId) {
        // update stub (future implementation)
        const response = await dispatch(
          updateShippingDetails({
            id: editingId,
            business_id: org?.id!,
            payload,
          })
        ).unwrap();

        toast.success(response.message);
        handleRefresh();

        // Check for redirect parameter and navigate if present
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } else {
        // Submit logic here
        const response = await dispatch(
          createShipping({
            payload,
            business_id: org?.id!,
          })
        ).unwrap();

        setForm(DEFAULT_FORM);

        toast.success(response.message);
        handleRefresh();

        // Check for redirect parameter and navigate if present
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast.error(error.message);
    } finally {
      closeModal();
    }
  };

  const handleDelete = (id: string, title: string) => {
    setShippingId(id);
    setShippingTitle(title);
    setDeleteShippingOpenModal(true);
  };

  // Country, state, city change
  const handleCountryChange = (countryName: string) => {
    const selected = countries.find((c) => c.name === countryName);
    if (!selected) return;

    setSelectedCountryIso(selected.isoCode);
    setStates(State.getStatesOfCountry(selected.isoCode));
    setCities([]);

    setForm((prev) => ({
      ...prev,
      country: selected.name,
      state: '',
      city: '',
    }));
  };

  const handleStateChange = (stateName: string) => {
    const selected = states.find((s) => s.name === stateName);
    if (!selected) return;

    setCities(City.getCitiesOfState(selectedCountryIso, selected.isoCode));

    setForm((prev) => ({
      ...prev,
      state: selected.name,
      city: '',
    }));
  };

  const handleCityChange = (cityName: string) => {
    setForm((prev) => ({ ...prev, city: cityName }));
  };

  const handleCountryStateCityChange = (
    countryName: string,
    stateName: string
  ) => {
    const selected = countries.find((c) => c.name === countryName);
    if (!selected) return;

    setSelectedCountryIso(selected.isoCode);

    const fetched_states = State.getStatesOfCountry(selected.isoCode);
    setStates(fetched_states);

    const stateSelected = fetched_states.find((s) => s.name === stateName);
    if (!stateSelected) return;

    setCities(City.getCitiesOfState(selected.isoCode, stateSelected.isoCode));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('other_currencies')) {
      const match = name.match(/other_currencies\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        setForm((prev: any) => {
          // Ensure it's always an array
          const updated = Array.isArray(prev.other_currencies)
            ? [...prev.other_currencies]
            : [];

          // Ensure slot exists
          if (!updated[index]) {
            updated[index] = {
              currency: foreignCurrencies()?.[index]?.currency || '',
              price: 0,
              original_price: undefined,
            };
          }

          updated[index] = {
            ...updated[index],
            [field]:
              field === 'original_price'
                ? value
                  ? +value
                  : undefined
                : value
                ? +value
                : 0,
          };

          return { ...prev, other_currencies: updated };
        });
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) || 0 : value,
    }));

    // Clear error when user starts typing
    // if (errors[name as keyof CreatePhysicalProductProps]) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     [name]: undefined,
    //   }));
    // }
  };

  const handleDeleteShipping = async () => {
    try {
      setIsSubmittingShippingDeletion(true);

      // Submit logic here
      const response = await dispatch(
        deleteShippingDetails({ id: shippingId, business_id: org?.id! })
      ).unwrap();

      toast.success(response.message);
    } catch (error: any) {
      console.error('Submission failed:', error);
      const message = error || error.message;
      toast.error(message);
    } finally {
      setIsSubmittingShippingDeletion(false);
      // setShowPaymentModal(false);
      closeModal();
    }
  };

  useEffect(() => {
    if (allowDeleteShippingAction) {
      handleDeleteShipping();
      setAllowDeleteShippingAction(false);
    }
  }, [allowDeleteShippingAction]);

  /** -------------------------------
   * Render
   * ------------------------------- */

  return (
    <div className='text-black-1 dark:text-white'>
      <Card className='dark:border-gray-600'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='w-5 h-5 ' />
            Shipping Locations
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* ADD BUTTON */}
          <Button onClick={() => setShowModal(true)} variant='primary'>
            <Plus className='w-4 h-4 mr-1' /> Add Shipping Location
          </Button>

          {/* EMPTY STATE */}
          {shippingLocations.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center border rounded-lg dark:border-gray-700'>
              {/* <img
                src='/empty-box.svg'
                alt='No shipping locations'
                className='w-32 h-32 mb-4 opacity-80'
              /> */}
              <PackageX className='w-20 h-20 text-gray-400 dark:text-gray-500 mb-4' />

              <h3 className='text-lg font-semibold mb-2'>
                No Shipping Locations Yet
              </h3>

              <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                Add your first shipping location to get started.
              </p>

              <Button
                onClick={() => setShowModal(true)}
                className='bg-primary-main'
              >
                <Plus className='w-4 h-4 mr-1' /> Add Shipping Location
              </Button>
            </div>
          ) : (
            <>
              {/* LOCATION LIST */}
              <div className='space-y-3'>
                {shippingLocations.map((location) => (
                  <div
                    key={location.id}
                    className='border p-4 rounded-lg dark:border-gray-600 space-y-2'
                  >
                    <div>
                      <p className='font-semibold'>{location.title}</p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {location.address}
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {location.state}, {location.country}
                      </p>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm'>
                      <p>
                        <span className='font-medium'>Price: </span>
                        {formatMoney(+location.price, location.currency)}
                      </p>
                      {location.other_currencies &&
                        location.other_currencies.map(
                          (other_currency, index) => (
                            <p key={index}>
                              <span className='font-medium'>
                                Price ({other_currency.currency}):{' '}
                              </span>
                              {formatMoney(
                                other_currency.price,
                                other_currency.currency
                              )}
                            </p>
                          )
                        )}
                      <p>
                        <span className='font-medium'>Arrival: </span>
                        {location.arrival_time} days
                      </p>
                    </div>

                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openEditModal(location)}
                      >
                        <Pencil className='w-4 h-4' />
                      </Button>

                      {!Boolean(location.payments?.length) && (
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() =>
                            handleDelete(location.id, location.title)
                          }
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------------------
          MODAL
      ---------------------- */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          editingId ? 'Edit Shipping Location' : 'Add New Shipping Location'
        }
        className='m-2 dark:text-gray-400 text-gray-800'
      >
        {/* Close Icon */}
        <button
          onClick={closeModal}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
        >
          <X className='w-5 h-5' />
        </button>

        {/* FORM INPUTS */}
        <div className='grid grid-cols-1 gap-3 mt-4'>
          <div>
            <Label htmlFor='title'>
              Title/Area Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              required
              type='text'
              id='title'
              placeholder='E.g: Lagos Island'
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label>
              Select Country <span className='text-red-500'>*</span>
            </Label>
            <Select
              name='country'
              value={form.country || ''}
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
              value={form.state || ''}
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
              value={form.city || ''}
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
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor='price'>
              Price (NGN) <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='text'
              placeholder={`Enter Price (NGN)`}
              value={form?.price!}
              onChange={(e: any) =>
                setForm({ ...form, price: Number(e.target.value!) })
              }
              required
            />
          </div>

          {foreignCurrencies()?.map((product_currency, index) => (
            <div key={index} className='flex-1'>
              <label className='text-sm font-medium mb-1 block'>
                Price ({product_currency.currency}){' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name={`other_currencies[${index}].price`}
                className='w-full rounded-md py-3'
                value={form.other_currencies?.[index]?.price!}
                onChange={handleInputChange}
                placeholder={`Enter Price (${
                  form.other_currencies?.[index]?.currency! ||
                  product_currency.currency
                })`}
                required
              />
            </div>
          ))}

          <div>
            <Label htmlFor='arrival_time'>
              Arrival Time (In working days)
              <span className='text-red-500'>*</span>
            </Label>
            <Input
              type='text'
              placeholder={`Arrival Time e.g: 4`}
              value={form?.arrival_time!}
              onChange={(e: any) =>
                setForm({ ...form, arrival_time: Number(e.target.value!) })
              }
              required
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className='flex justify-end mt-6 gap-3'>
          <Button variant='outline' onClick={closeModal}>
            Cancel
          </Button>

          <Button onClick={handleSave} variant='primary'>
            {editingId ? 'Save Changes' : 'Add Shipping'}
          </Button>
        </div>
      </Modal>

      <ActionConfirmationModal
        body={`Are you sure you want to delete this shipping - ${shippingTitle}`}
        openModal={deleteShippingOpenModal}
        setOpenModal={setDeleteShippingOpenModal}
        allowAction={allowDeleteShippingAction}
        setAllowAction={setAllowDeleteShippingAction}
      />
    </div>
  );
};

export default ShippingLocationSettings;
