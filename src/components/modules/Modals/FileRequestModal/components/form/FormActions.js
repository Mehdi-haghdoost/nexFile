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
      className={`flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 shadow-light text-medium-14 text-center disabled:opacity-50 ${isFormValid && !isLoading
          ? 'flex items-center justify-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-primary-500 shadow-middle bg-gradient-primary text-medium-14-white disabled:opacity-50 hover:opacity-90'
          : 'bg-white text-medium-14'
        }`}
    >
      {isLoading ? 'Creating...' : 'Create'}
    </button>
  </footer>
);

export default FormActions;