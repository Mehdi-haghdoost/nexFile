import React from 'react';

const TextInput = ({ label, id, isTextarea = false, value, onChange, ...props }) => (
  <div className='flex flex-col justify-center items-start gap-1.5 self-stretch'>
    <label htmlFor={id} className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300'>
      {label}
    </label>
    <div className={`flex ${isTextarea ? 'items-start' : 'gap-2'} w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border border-stroke-500 dark:border-neutral-600 bg-white dark:bg-neutral-800`}>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className='flex-1 text-sm text-neutral-200 dark:text-neutral-300 outline-0 resize-none h-[60px] sm:h-[25px] dark:bg-transparent'
          {...props}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          className='flex-1 text-sm text-neutral-200 dark:text-neutral-300 outline-0 dark:bg-transparent'
          type="text"
          {...props}
        />
      )}
    </div>
  </div>
);

export default TextInput;