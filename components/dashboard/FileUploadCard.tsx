import React, { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Props = {
  preview: string | null;
  fileName?: string | null;
  uploading: boolean;
  accept: string;
  onFileSelect: (file: File) => void;
  multiple?: boolean;
  placeholder: {
    icon: string;
    title: string;
    description: string;
  };
};

const FileUploadCard: React.FC<Props> = ({
  preview,
  fileName,
  uploading = false,
  accept,
  multiple = false,
  onFileSelect,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // @ts-ignore
      onFileSelect(files);
      e.target.value = ''; // reset input to allow re-uploading same file
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div
        className='relative flex flex-col items-center justify-center w-full sm:w-72 h-56 rounded-md border-2 border-dashed border-primary-main bg-primary-main/10 text-center cursor-pointer overflow-hidden transition hover:bg-primary-main/20'
        onClick={() => inputRef.current?.click()}
      >
        {/* Preview */}
        {preview ? (
          <img
            src={preview}
            alt='Preview'
            className='w-full h-full object-cover rounded-md'
          />
        ) : (
          <>
            <img
              src={placeholder.icon}
              alt='upload icon'
              className='mb-2 w-10 opacity-80'
            />
            <p className='font-medium'>{placeholder.title}</p>
            {placeholder.description && (
              <p className='text-xs mt-1 text-gray-600 dark:text-gray-400'>
                {placeholder.description}
              </p>
            )}
          </>
        )}

        {/* Upload overlay */}
        {uploading && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center text-white'>
            Uploading...
          </div>
        )}

        <input
          ref={inputRef}
          type='file'
          hidden
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
      </div>

      {/* Show file name if available */}
      {fileName && (
        <Link href={fileName} target='_blank'>
          <Badge>{fileName.split('/').pop()}</Badge>
        </Link>
      )}
    </div>
  );
};

export default FileUploadCard;
