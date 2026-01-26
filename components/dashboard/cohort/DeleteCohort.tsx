import ActionConfirmationModal from '@/components/ActionConfirmationModal';
import { ActionKind } from '@/lib/utils';
import { deleteCohort } from '@/redux/slices/cohortSlice';
import { AppDispatch } from '@/redux/store';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiTrash } from 'react-icons/hi';
import { useDispatch } from 'react-redux';

const DeleteCohort = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [allowAction, setAllowAction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const handleDeletePrompt = async () => {
    setOpenModal(true);
  };

  // const handleComposeForm = (e: any) => {
  // e.preventDefault();
  // setOpenModal(true);
  // };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response: any = await dispatch(
        deleteCohort({ id: params?.id! as string }),
      );

      if (response.requestStatus === 'rejected') {
        throw new Error(response.payload);
      }

      toast.success(response?.payload?.message);
      router.back();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
      setAllowAction(false);
    }
  };

  useEffect(() => {
    if (allowAction) {
      handleDelete();
    }
  }, [allowAction]);

  return (
    <>
      <button
        type='button'
        className='px-4 py-2 rounded-md bg-primary text-white'
        onClick={handleDeletePrompt}
        disabled={isLoading}
      >
        <span className='flex gap-1 items-center'>
          <HiTrash /> Delete
        </span>
      </button>

      <ActionConfirmationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        allowAction={allowAction}
        setAllowAction={setAllowAction}
        action={ActionKind.FAVORABLE}
      />
    </>
  );
};

export default DeleteCohort;
