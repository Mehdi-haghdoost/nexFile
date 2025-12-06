import React from 'react';
import { CloseIcon } from '@/components/ui/icons';

const FormHeader = ({ onClose, title = "Create new request" }) => (
  <header className='flex justify-between items-center self-stretch'>
    <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>{title}</h1>
    <button 
      type="button"
      onClick={onClose} 
      className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded active:scale-95 transition-all"
      aria-label="Close modal"
    >
      <CloseIcon />
    </button>
  </header>
);

export default FormHeader;