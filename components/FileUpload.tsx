import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { uploadDocument } from '@/redux/slices/multimediaSlice';
import toast from 'react-hot-toast';
import { EyeIcon } from 'lucide-react';

interface FileUploadProps {
  label: string;
  onUploaded: (result: any) => void;
  accept?: string;
  fileUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onUploaded,
  accept,
  fileUrl,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileUrl) {
      setFileName(fileUrl.split('/').pop() || '');
      setFilePreview(
        fileUrl.endsWith('.pdf') ? '/pdf_image.png' : '/file_image.png'
      );
    }
  }, [fileUrl]);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024)
      return toast.error('File size should be less than 10MB');

    setUploading(true);
    setFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setFilePreview('/pdf_image.png');
    } else {
      setFilePreview('/file_image.png');
    }

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response: any = await dispatch(
        uploadDocument({
          form_data: formData,
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / (event.total || 1)
            );
            setUploadProgress(percent);
          },
        })
      );

      if (response.type === 'multimedia-upload/image/rejected')
        throw new Error(response.payload.message);

      toast.success('File uploaded successfully');
      onUploaded(response.payload);
    } catch (error) {
      toast.error('Failed to upload file');
      setFilePreview(null);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <>
      <div
        className='relative flex flex-col items-center justify-center w-full h-48 rounded-md border border-dashed border-gray-400 p-4 text-center cursor-pointer overflow-hidden'
        onClick={() => fileInputRef.current?.click()}
      >
        {filePreview && !fileUrl ? (
          filePreview.startsWith('data:image') ? (
            <img
              src={filePreview}
              alt='Preview'
              className='w-full h-full object-cover rounded-md'
            />
          ) : (
            <div className='flex flex-col items-center'>
              <img
                src={filePreview}
                alt='file preview'
                className='w-12 h-12 mb-2'
              />
              <p className='truncate w-full px-2 text-sm'>{fileName}</p>
            </div>
          )
        ) : (
          !uploading && (
            <>
              <img
                src='/icons/course/file.svg'
                alt='upload icon'
                className='mb-2 w-10 h-10'
              />
              <p className='font-medium'>Click or drop to upload</p>
              <p className='text-xs'>Supported: JPG, PNG, PDF, DOC. Max 10MB</p>
            </>
          )
        )}

        {uploading && (
          <div className='absolute inset-0 flex justify-center items-center z-10'>
            {/* Transparent dark overlay */}
            <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />

            {/* Upload content */}
            <div className='relative flex flex-col justify-center items-center px-4 gap-3'>
              <p className='font-semibold text-white text-sm mb-3'>
                Uploading... {uploadProgress}%
              </p>
              <div className='w-full bg-white/30 rounded-full h-2'>
                <div
                  className='bg-white h-2 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <input
          type='file'
          accept={accept || 'image/*,.pdf,.doc,.docx'}
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <p className='mt-2 text-sm text-gray-600'>{label}</p>
      </div>

      {fileUrl && (
        <div className='flex items-center justify-between gap-x-2 mt-2'>
          <div className='flex items-center gap-x-2'>
            {/\.(jpe?g|png|gif|webp)$/i.test(fileUrl) ? (
              <img
                src={fileUrl}
                alt='file preview'
                className='size-7 rounded object-cover'
              />
            ) : (
              <img
                src={
                  fileUrl.endsWith('.pdf')
                    ? '/pdf_image.png'
                    : '/file_image.png'
                }
                alt='file icon'
                className='size-6'
              />
            )}
            <p className='truncate w-32 text-sm'>{fileUrl.split('/').pop()}</p>
          </div>

          <a
            href={fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600'
          >
            <EyeIcon className='w-5 h-5' />
          </a>
        </div>
      )}
    </>
  );
};

export default FileUpload;
