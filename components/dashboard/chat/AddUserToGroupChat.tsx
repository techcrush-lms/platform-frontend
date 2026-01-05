import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupChat, updateGroupChat } from '@/redux/slices/chatSlice';
import toast from 'react-hot-toast';
import { XCircle } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import { cn } from '@/lib/utils';
import ContactSelector from '../ContactSelector';
import useContacts from '@/hooks/page/useContacts';

interface AddUserToGroupChatProps {
  editCreateTeamModal: boolean;
  setEditCreateTeamModal: Dispatch<SetStateAction<boolean>>;
}

const AddUserToGroupChat = ({
  editCreateTeamModal,
  setEditCreateTeamModal,
}: AddUserToGroupChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { token, profile } = useSelector((state: RootState) => state.auth);
  const { chat_group, chat } = useSelector((state: RootState) => state.chat);

  const { contactsCount, contactsLoading, contacts } = useContacts();

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

    // if (!file) {
    //   toast.error('Image is required.');
    // }

    // // Create FormData for file upload
    // const fileData = new FormData();
    // fileData.append('image', file!);

    let response: any;
    try {
      // For HTTP Request
      // setIsSubmitting(true);
      // const response = await dispatch(
      //   uploadImage({
      //     form_data: fileData,
      //   })
      // ).unwrap();

      // setIsSubmitting(false);

      // For Socket request
      dispatch(
        updateGroupChat({
          group_id: chat?.chat_group_id!,
          token: token!,
          // name: body.name,
          // description: body.description,
          // multimedia_id: response.multimedia.id,
          members: selectedMembers,
        })
      );

      toast.success('User has been added to group successfully.');

      setSelectedMembers([]);
      setEditCreateTeamModal(false);
    } catch (error: any) {
      console.log(error);
      const message = error || error.message;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const isFormValid = body.name && body.description && previewUrl;
  const isFormStep2Valid = Boolean(selectedMembers.length);

  return (
    <>
      <button onClick={() => setEditCreateTeamModal(true)}>
        <Icon
          url='/icons/chat/img/user-plus.png'
          width={20}
          height={10}
          className='object-contain'
        />
      </button>
      <Modal
        isOpen={editCreateTeamModal}
        onClose={() => setEditCreateTeamModal(false)}
        title='Add Group Members'
        className='max-w-xl text-gray-800 dark:text-gray-200'
      >
        {/* Close Button */}
        <button
          onClick={() => setEditCreateTeamModal(false)}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
        >
          <XCircle className='w-5 h-5' />
        </button>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <>
              <ContactSelector
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                addedMembers={chat?.chat_group?.group_members}
                isEditGroup={true}
              />
            </>

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
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddUserToGroupChat;
