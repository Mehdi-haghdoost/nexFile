import React from 'react';

const FormActions = ({ onCancel, isLoading = false, isFormValid = false }) => (
  <footer className='flex flex-col sm:flex-row justify-end items-stretch sm:items-end gap-2 sm:gap-3 self-stretch w-full'>
    <button
      type="button"
      onClick={onCancel}
      disabled={isLoading}
      className='flex justify-center items-center gap-2 h-10 sm:h-8 py-2.5 sm:py-[13px] px-4 sm:px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-sm font-medium text-neutral-500 dark:text-white text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-gradient dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-gradient-hover active:scale-95 transition-all w-full sm:w-auto'
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isLoading || !isFormValid}
      className={`flex justify-center items-center gap-2 h-10 sm:h-8 py-2.5 sm:py-[13px] px-4 sm:px-6 rounded-lg border shadow-light text-sm font-medium text-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all w-full sm:w-auto ${
        isFormValid && !isLoading
          ? 'border-primary-500 shadow-middle bg-gradient-primary dark:bg-primary-800 dark:border-primary-border text-white hover:opacity-90'
          : 'border-stroke-300 bg-white text-neutral-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-300'
      }`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating...
        </>
      ) : (
        'Create'
      )}
    </button>
  </footer>
);

export default FormActions;