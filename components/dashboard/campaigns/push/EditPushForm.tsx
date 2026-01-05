'use client';

import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import Input from '@/components/ui/Input';
import Select from '@/components/Select';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { HiMinus, HiPlus, HiPlusCircle } from 'react-icons/hi';

const EditPushForm = () => {
  const searchParams = useSearchParams();

  const [count, setCount] = useState(1);
  const [dataList, setDataList] = useState<Array<number>>([count]);

  const [template, setTemplate] = useState('custom');

  const [openModal, setOpenModal] = useState(false);

  const handleCreateForm = (e: any) => {
    e.preventDefault();

    setOpenModal(true);
  };

  const handleDataListAppend = () => {
    const _count = count + 1;
    const _dataList = [...dataList, _count];

    setCount(_count);
    setDataList(_dataList);
  };

  const handleDataListRemove = (index: number) => {
    const _dataList = dataList.filter((_index: number) => _index !== index);

    setDataList(_dataList);
  };

  return (
    <>
      <form className='space-y-6' onSubmit={handleCreateForm}>
        <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
          Edit job push
        </h1>
        <div>
          <label
            htmlFor='title'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Title
          </label>
          <Input type='text' name='title' required={true} />
        </div>
        <div>
          <label
            htmlFor='body'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Body
          </label>
          <Input type='text' name='body' required={true} />
        </div>
        <div>
          <label
            htmlFor='network'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Network
          </label>
          <Select name='network' required={true} data={[]} />
        </div>

        {searchParams.get('type') === 'scheduled' && (
          <div>
            <label
              htmlFor='schedule'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Schedule
            </label>
            <Input type='datetime-local' name='schedule' required={true} />
          </div>
        )}

        <div>
          <label
            htmlFor='imageUrl'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Image URL (Optional)
          </label>
          <Input type='url' name='imageUrl' />
        </div>

        <div>
          <label
            htmlFor='url'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            URL (Optional)
          </label>
          <Input type='url' name='url' />
        </div>

        <div>
          <div className='flex justify-between'>
            <label
              htmlFor='metadata'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Metadata (Optional)
            </label>
            <HiPlus className='cursor-pointer' onClick={handleDataListAppend} />
          </div>

          <div className='mt-3'>
            {dataList?.map((index) => (
              <div key={index} className='flex gap-2 mb-2'>
                <div className='flex-1'>
                  <label
                    htmlFor='metadata'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Key
                  </label>
                  <Input type='text' name='body' />
                </div>
                <div className='flex-1'>
                  <label
                    htmlFor='metadata'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Value
                  </label>
                  <Input type='text' name='body' />
                </div>
                {dataList[0] !== index && (
                  <HiMinus
                    className='mt-10 cursor-pointer'
                    onClick={() => handleDataListRemove(index)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type='submit'
          className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Send
        </button>
      </form>
      <ActionConfirmationModal
        body='Are you sure you want to continue'
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default EditPushForm;
