import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { uploadImage } from '@/redux/slices/multimediaSlice';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
    businessId?: string;
    onUploaded: (result: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ businessId, onUploaded }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            return toast.error('Image size should be less than 5MB');
        }

        setUploading(true);

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response: any = await dispatch(
                uploadImage({
                    form_data: formData,
                    // business_id: businessId,
                    onUploadProgress: (event) => {
                        const percent = Math.round((event.loaded * 100) / (event.total || 1));
                        setUploadProgress(percent);
                    },
                })
            );

            if (response.type === 'multimedia-upload/image/rejected') {
                throw new Error(response.payload.message);
            }

            toast.success('Image uploaded successfully');
            onUploaded(response.payload);
        } catch (error) {
            toast.error('Failed to upload image');
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div
            className="relative flex flex-col items-center justify-center w-full sm:w-64 h-56 rounded-md bg-primary-main text-white p-4 text-center cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
            ) : (
                <>
                    <img src="/icons/course/file.svg" alt="upload icon" className="mb-2 w-10 h-10" />
                    <p className="font-medium">Upload, Drag or drop image</p>
                    <p className="text-xs">Supported Format: png, jpeg. Max size is 5MB</p>
                </>
            )}

            {uploading && (
                <div className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 px-4">
                    <p className="font-semibold text-white text-sm mb-3">
                        Uploading... {uploadProgress}%
                    </p>
                    <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <input
                type="file"
                accept="image/png, image/jpeg"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ImageUploader;
