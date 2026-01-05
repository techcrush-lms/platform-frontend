import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={cn(
          'bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className='text-lg font-semibold mb-4 text-gray-800 dark:text-white'>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};
