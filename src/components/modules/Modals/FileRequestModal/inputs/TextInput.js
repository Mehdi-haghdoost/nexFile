// C:\Users\LENOVO\Desktop\nexFile\src\components\templates\home\file-requests\TextInput.js

import React from 'react';

const TextInput = ({ label, id, isTextarea = false, value, onChange, ...props }) => (
  <div className='flex flex-col justify-center items-start gap-1 self-stretch'>
    <label htmlFor={id} className='text-regular-12-neutral-300'>
      {label}
    </label>
    <div className={`flex ${isTextarea ? 'items-start' : 'gap-2'}  w-full py-3 px-4 rounded-lg border border-stroke-500 dark:border-neutral-600 bg-white dark:bg-neutral-800`}>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className='flex-1 text-regular-14-neutral-200 dark:text-regular-14-neutral-300 outline-0 gap-10 resize-none h-[25px] dark:bg-transparent'
          {...props}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={onChange}
          className='flex-1 text-regular-14-neutral-200 dark:text-regular-14-neutral-300 outline-0 gap-10 dark:bg-transparent'
          type="text"
          {...props}
        />
      )}
    </div>
  </div>
);

export default TextInput;