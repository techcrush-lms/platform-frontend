import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/textarea';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupChat, fetchContacts } from '@/redux/slices/chatSlice';
import toast from 'react-hot-toast';
import { Camera, ChevronLeft, X, XCircle } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { IoIosArrowBack } from 'react-icons/io';
import ContactSelector from '../ContactSelector';
import useContacts from '@/hooks/page/useContacts';

interface CreateTeamChatProps {
  openCreateTeamModal: boolean;
  setOpenCreateTeamModal: Dispatch<SetStateAction<boolean>>;
}

const CreateTeamChat = ({
  openCreateTeamModal,
  setOpenCreateTeamModal,
}: CreateTeamChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { token, profile } = useSelector((state: RootState) => state.auth);

  // 👉 State to hold selected member IDs
  const [selectedMembers, setSelectedMembers] = useState<
    { member_id: string }[]
  >([]);

  const [previewUrl, setPreviewUrl] = useState('');
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [body, setBody] = useState({
    name: '',
    description: '',
    multimedia_id: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      e.target instanceof HTMLInputElement &&
      e.target.files &&
      name === 'group_chat_icon'
    ) {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
        setFile(file);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file) {
      toast.error('Image is required.');
    }

    // Create FormData for file upload
    const fileData = new FormData();
    fileData.append('image', file!);

    let response: any;
    try {
      // For HTTP Request
      setIsSubmitting(true);
      const response = await dispatch(
        uploadImage({
          form_data: fileData,
        })
      ).unwrap();

      setIsSubmitting(false);

      // For Socket request
      dispatch(
        createGroupChat({
          token: token!,
          name: body.name,
          description: body.description,
          multimedia_id: response.multimedia.id,
          members: selectedMembers,
        })
      );

      setBody({
        name: '',
        description: '',
        multimedia_id: '',
      });
      setSelectedMembers([]);
      setStep(1);
      setPreviewUrl('');
      setOpenCreateTeamModal(false);
    } catch (error: any) {
      console.log(error);
      const message = error || error.message;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = body.name && body.description && previewUrl;
  const isFormStep2Valid = Boolean(selectedMembers.length);

  return (
    <>
      <Button
        onClick={() => setOpenCreateTeamModal(true)}
        className='h-10 text-xs font-bold mb-4 bg-primary-main dark:bg-primary-main'
      >
        {' '}
        Create Group{' '}
      </Button>
      <Modal
        isOpen={openCreateTeamModal}
        onClose={() => setOpenCreateTeamModal(false)}
        title='New Group'
        className='max-w-xl text-gray-800 dark:text-gray-200'
      >
        {/* Close Button */}
        <button
          onClick={() => setOpenCreateTeamModal(false)}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
        >
          <XCircle className='w-5 h-5' />
        </button>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            {step === 1 && (
              <>
                {/* Group Name with Camera Icon */}
                <div className='flex items-center gap-2'>
                  <div className='text-gray-400 hover:cursor-pointer'>
                    <label
                      htmlFor='group_chat_image'
                      className='hover:cursor-pointer'
                    >
                      {/* <Camera width={25} height={25} /> */}

                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt='Profile'
                          className='object-cover w-[46px] h-[40px] rounded-full'
                        />
                      ) : (
                        <div className='p-2 border border-gray-400 rounded-full bg-primary-20 hover:bg-primary-faded '>
                          <Icon
                            url='/icons/camera.png'
                            className=''
                            width={30}
                            height={30}
                          />
                        </div>
                      )}
                    </label>

                    <input
                      type='file'
                      id='group_chat_image'
                      name='group_chat_icon'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='hidden'
                    />
                  </div>
                  <Input
                    type='text'
                    name='name'
                    placeholder='Group Name'
                    className='w-full rounded-md py-3'
                    value={body.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Textarea
                    rows={3}
                    name='description'
                    placeholder='Description'
                    className='w-full rounded-md px-4 py-3'
                    value={body.description}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Button
                  type='button'
                  onClick={() => setStep(1)}
                  variant='primary'
                  className='p-2 px-3'
                >
                  <IoIosArrowBack /> Go Back
                </Button>

                <ContactSelector
                  selectedMembers={selectedMembers}
                  setSelectedMembers={setSelectedMembers}
                />
              </>
            )}

            {/* Next Button */}
            {step === 1 && (
              <button
                type='button'
                disabled={!isFormValid}
                className={cn(
                  'w-full py-3  text-white rounded-md',
                  isFormValid
                    ? 'bg-primary-main hover:bg-blue-700'
                    : 'bg-primary-faded cursor-not-allowed'
                )}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            )}

            {/* Create Button */}
            {step === 2 && (
              <button
                type='submit'
                disabled={!isFormStep2Valid || isSubmitting}
                className={cn(
                  'w-full py-3  text-white rounded-md',
                  isFormStep2Valid
                    ? 'bg-primary-main hover:bg-blue-700'
                    : 'bg-primary-faded cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <LoadingIcon />
                    Processing...
                  </span>
                ) : (
                  'Proceed'
                )}
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateTeamChat;
