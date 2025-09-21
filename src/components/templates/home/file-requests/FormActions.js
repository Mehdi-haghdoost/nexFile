// C:\Users\LENOVO\Desktop\nexFile\src\components\templates\home\file-requests\FormActions.js

import React from 'react';

const FormActions = ({ onCancel, isLoading = false, isFormValid = false }) => (
  <footer className='flex justify-end items-end gap-3 self-stretch'>
    <button 
      type="button"
      onClick={onCancel}
      disabled={isLoading}
      className='flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 text-center disabled:opacity-50'
    >
      Cancel
    </button>
    <button 
      type="submit"
      disabled={isLoading || !isFormValid}
      className={`flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 shadow-light text-medium-14 text-center disabled:opacity-50 ${
        isFormValid && !isLoading 
          ? 'bg-white text-medium-14' 
          : 'bg-stroke-100 text-medium-14-neutral-100'
      }`}
    >
      {isLoading ? 'Creating...' : 'Create'}
    </button>
  </footer>
);

export default FormActions;