import React from 'react';
import { CloseIcon } from '@/components/ui/icons';

const FormHeader = ({ onClose, title = "Create new request" }) => (
  <header className='flex justify-between items-center self-stretch'>
    <h1 className='text-medium-18 dark:text-medium-18-white'>{title}</h1>
    <button 
      type="button"
      onClick={onClose} 
      className="p-1 hover:bg-gray-100 rounded"
      aria-label="Close modal"
    >
      <CloseIcon />
    </button>
  </header>
);

export default FormHeader;