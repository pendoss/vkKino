import React, { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  movieName: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  movieName 
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600/25 dark:bg-gray-900/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 id="confirm-modal-title" className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Подтверждение действия
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
          Добавить фильм <strong>"{movieName}"</strong> в избранное?
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Отмена
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;