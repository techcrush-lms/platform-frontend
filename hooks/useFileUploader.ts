import { useState } from 'react';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadRawDocument } from '@/redux/slices/multimediaSlice';

type FileUploaderConfig = {
  type: 'image' | 'zip';
  maxSizeMB: number;
};

export function useFileUploader({ type, maxSizeMB }: FileUploaderConfig) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);

  const handleUpload = async (
    file: File,
    onSuccess: (id: string) => void
  ): Promise<void> => {
    if (!file) return;

    // ✅ Allowed MIME types
    const allowedTypes =
      type === 'image'
        ? ['image/jpeg', 'image/png']
        : ['application/zip', 'application/x-zip-compressed'];

    // ✅ Type validation
    if (
      !allowedTypes.includes(file.type) &&
      type === 'zip' &&
      !file.name.toLowerCase().endsWith('.zip')
    ) {
      toast.error(`Only .${type} files are allowed`);
      return;
    }

    // ✅ File size validation
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append(type === 'image' ? 'image' : 'document', file);

      // ✅ Handle previews
      if (type === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('/icons/zip.png');
        setFileName(file.name);
      }

      // ✅ Choose the right upload action
      const action =
        type === 'image'
          ? uploadImage({ form_data: formData, business_id: org?.id ?? '' })
          : uploadRawDocument({
              form_data: formData,
              business_id: org?.id ?? '',
            });

      const response = (await dispatch(action)) as any;

      if (response.type.includes('/rejected')) {
        throw new Error(response.payload?.message || 'Upload failed');
      }

      onSuccess(response.payload.multimedia.id);
      toast.success(`${type.toUpperCase()} uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  return { preview, fileName, uploading, handleUpload };
}
