import { formatMoney, shortenId } from '@/lib/utils';
import React, { useState } from 'react';

import moment from 'moment'; // Import moment.js

import { SubscriptionPlan } from '@/types/subscription-plan';
import { capitalize } from 'lodash';
import { PencilIcon, VerifiedIcon, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import UpdateSubscriptionPlanForm from './UpdateSubscriptionPlanForm';
import { Button } from '@/components/ui/Button';
import { fetchSubscriptionPlan } from '@/redux/slices/subscriptionPlanSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

interface SubscriptionPlanItemProps {
  subscription_plan: SubscriptionPlan;
}
const SubscriptionPlanItem = ({
  subscription_plan,
}: SubscriptionPlanItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const { org } = useSelector((state: RootState) => state.org);

  let pricing = subscription_plan.subscription_plan_prices.length
    ? subscription_plan.subscription_plan_prices.map((plan_price) => (
        <li>
          {capitalize(plan_price.period.split('_').join(' '))} -{' '}
          {formatMoney(+plan_price.price, plan_price.currency)}
        </li>
      ))
    : 'N/A';

  let roles = subscription_plan.subscription_plan_roles.length
    ? subscription_plan.subscription_plan_roles.map((plan_role) => (
        <li className='flex gap-1 items-center'>
          {capitalize(plan_role.title)}{' '}
          {plan_role.selected && (
            <VerifiedIcon className='text-green-400' size={17} />
          )}
        </li>
      ))
    : 'N/A';

  const handleOpenSubscription = () => {
    dispatch(
      fetchSubscriptionPlan({
        id: subscription_plan.id,
        ...(org?.id && { business_id: org?.id as string }),
      })
    );

    setIsPlanModalOpen(true);
  };

  return (
    <>
      <tr
        key={subscription_plan.id}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      >
        <td
          scope='row'
          className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold relative group'
        >
          <Button
            variant='link'
            onClick={handleOpenSubscription}
            className='hover:text-primary-400 p-0 underline flex items-center gap-1'
            title={subscription_plan.id}
          >
            {shortenId(subscription_plan.id)} <PencilIcon size='13' />
          </Button>
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {subscription_plan.creator?.name}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {pricing}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-bold'>
          {roles}
        </td>

        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(subscription_plan.created_at).format('MMM D, YYYY')}
        </td>
        <td className='px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'>
          {moment(subscription_plan.updated_at).format('MMM D, YYYY')}
        </td>
      </tr>

      {/* Update Plan Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title='Update plan'
        className='relative max-w-xl my-[50%] overflow-y-auto'
      >
        {/* Close Icon */}
        <button
          onClick={() => setIsPlanModalOpen(false)}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
        >
          <X
            size={20}
            className='dark:text-white text-black-1 hover:dark:text-slate-500'
          />
        </button>

        <UpdateSubscriptionPlanForm setIsPlanModalOpen={setIsPlanModalOpen} />
      </Modal>
    </>
  );
};

export default SubscriptionPlanItem;
