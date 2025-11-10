import React from 'react';
import { Switch } from '@/components/ui/Switch';

const ToggleOption = ({ label, id, checked, onChange }) => (
  <div className='flex justify-between items-center self-stretch'>
    <div className='flex flex-1 flex-col justify-center items-start gap-0.5'>
      <label htmlFor={id} className='text-regular-14-neutral-500 dark:text-regular-14-white'>
        {label}
      </label>
    </div>
    <div className='flex flex-col justify-center items-end gap-3'>
      <Switch id={id} checked={checked} onChange={onChange} />
    </div>
  </div>
);

export default ToggleOption;