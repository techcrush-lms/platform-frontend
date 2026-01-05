'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import Input from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ActionKind,
  notificationTemplates,
  NotificationType,
} from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useOrg from '@/hooks/page/useOrg';
import {
  ScheduleEmailProps,
  ScheduleEmailSchema,
} from '@/lib/schema/notification.schema';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { scheduleEmail } from '@/redux/slices/notificationSlice';
import toast from 'react-hot-toast';
import { MultiSelect } from '@/components/ui/MultiSelect';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import useCustomers from '@/hooks/page/useCustomers';
import { capitalize } from 'lodash';

// Dynamically load the CKEditor component
const CkEditor = dynamic(() => import('@/components/CkEditor'), { ssr: false });

const ScheduleEmailForm = () => {
  const [template, setTemplate] = useState('custom');
  const [openModal, setOpenModal] = useState(false);

  const handleScheduleForm = (e: any) => {
    e.preventDefault();
    setOpenModal(true);
  };

  return (
    <>
      <Suspense fallback={<div>Loading form...</div>}>
        <ScheduleEmailFormContent
          template={template}
          setTemplate={setTemplate}
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleScheduleForm={handleScheduleForm}
        />
      </Suspense>
    </>
  );
};

const defaultValue: ScheduleEmailProps = {
  title: '',
  message: '',
  type: NotificationType.EMAIL,
  business_id: '',
  scheduled_time: '',
  recipients: [],
};

const ScheduleEmailFormContent = ({
  template,
  setTemplate,
  openModal,
  setOpenModal,
}: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { org: organization } = useSelector((state: RootState) => state.org);

  const { customers } = useCustomers();

  const [isLoading, setIsLoading] = useState(false);

  const [body, setBody] = useState({
    ...defaultValue,
    business_id: organization?.id!,
  });

  const [editorData, setEditorData] = useState('');

  const customer = customers.find(
    (cust) => cust.id === searchParams.get('customerId')
  );

  const customersList = searchParams.has('customerId')
    ? [
        {
          value: customer?.id!,
          label: `${customer?.name!} - (${customer?.email})`,
        },
      ]
    : customers.map((customer) => ({
        value: customer.id,
        label: `${customer?.name!} - (${customer?.email})`,
      }));

  const [selectedCustomer, setSelectedCustomer] = useState<string[]>([]);

  const [allowAction, setAllowAction] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const details = {
      ...body,
      message: editorData,
      recipients: selectedCustomer,
    };

    setBody(details);

    const { error, value } = ScheduleEmailSchema.validate(details);

    // Handle validation results
    if (error) {
      throw new Error(error.details[0].message);
    }

    setOpenModal(true);
  };

  const handleScheduleEmail = async () => {
    try {
      setIsLoading(true);

      const response: any = await dispatch(scheduleEmail(body));

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      // Clear form
      setBody({
        ...body,
        title: '',
        message: '',
      });

      toast.success(response?.payload?.message);
      router.back();
    } catch (err: any) {
      // console.log(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setAllowAction(false);
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleScheduleEmail();
    }
  }, [allowAction]);

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-2'>
        <form className='flex-1' onSubmit={handleSubmit}>
          <div className='space-y-6 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
            <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
              Compose email
            </h1>
            <div>
              <label
                htmlFor='subject'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Subject
              </label>
              <Input
                type='text'
                name='subject'
                required={true}
                onChange={(e: any) =>
                  setBody({ ...body, title: e.target.value })
                }
                value={body.title}
              />
            </div>
            {/* <div>
              <label
                htmlFor='preheader'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Preheader
              </label>
              <Input type='text' name='preheader' />
            </div> */}

            <div>
              <label
                htmlFor='schedule_time'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Schedule
              </label>
              <Input
                type='datetime-local'
                name='schedule_time'
                value={body.scheduled_time}
                onChange={(e: any) =>
                  setBody({ ...body, scheduled_time: e.target.value! })
                }
              />
            </div>

            <div>
              <label
                htmlFor='template'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Template
              </label>
              <Select
                name='template'
                value={template}
                onValueChange={(value) => setTemplate(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select template' />
                </SelectTrigger>
                <SelectContent>
                  {notificationTemplates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {capitalize(template)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {searchParams.has('customerId') ? (
              <div>
                <label
                  htmlFor='customers'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Customers
                </label>

                <MultiSelect
                  options={customersList}
                  onValueChange={setSelectedCustomer}
                  defaultValue={selectedCustomer}
                  placeholder='Select customers'
                  variant='inverted'
                  animation={2}
                  maxCount={3}
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor='customers'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Customers
                </label>

                <MultiSelect
                  options={customersList}
                  onValueChange={setSelectedCustomer}
                  defaultValue={selectedCustomer}
                  placeholder='Select customers'
                  variant='inverted'
                  animation={2}
                  maxCount={3}
                />
              </div>
            )}

            {template === 'custom' && (
              <div>
                <label
                  htmlFor='body'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Body
                </label>

                {/* Suspense with fallback for CKEditor */}
                <Suspense fallback={<div>Loading editor...</div>}>
                  <CkEditor
                    editorData={editorData}
                    setEditorData={setEditorData}
                  />
                </Suspense>
              </div>
            )}

            <button
              type='submit'
              className='text-white bg-primary-main hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-800 dark:hover:bg-primary-main dark:focus:ring-blue-800 flex gap-2'
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className='animate-spin' /> &nbsp;
                  Loading...
                </>
              ) : (
                <>Send</>
              )}
            </button>
            <ActionConfirmationModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              allowAction={allowAction}
              setAllowAction={setAllowAction}
              action={ActionKind.FAVORABLE}
            />
          </div>
        </form>
        <div className='flex-1 border border-dashed rounded-lg overflow-y-auto'>
          <div className='space-y-6 p-4 rounded-lg shadow sm:p-6 md:p-8 w-full'>
            <div className='flex flex-col items-center justify-center pt-8 mx-auto pt:mt-0 '>
              <a
                href='#'
                className='flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white'
              >
                <Image
                  src={'/logo.png'}
                  width={150}
                  height={150}
                  alt='Logo'
                  className='m-auto block dark:hidden'
                  priority
                />
                <Image
                  src={'/logo-white.png'}
                  width={150}
                  height={150}
                  alt='Logo'
                  className='m-auto hidden dark:block'
                  priority
                />
              </a>

              <div className='mt-3 overflow-hidden dark:text-white text-gray-600 max-h-screen lg:h-[68vh] overflow-y-auto w-full'>
                <div dangerouslySetInnerHTML={{ __html: editorData }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleEmailForm;
