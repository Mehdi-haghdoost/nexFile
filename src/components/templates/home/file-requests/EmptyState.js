import React from 'react';
import { DownloadIcon } from '@/components/ui/icons';

const EmptyState = () => (
  <section className='flex flex-1 flex-col justify-center items-center py-4 px-7 self-stretch rounded-lg border-stroke-200 bg-white' aria-labelledby="empty-state-title">
    <div className='flex flex-col justify-center items-center gap-2 p-1 w-[72px] h-[72px] rounded-2xl border-2 border-[rgba(255,255,255,0.70)] bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2]'>
      <div className='flex items-center justify-center'>
        <DownloadIcon aria-hidden="true" />
      </div>
    </div>

    <div className='flex flex-col items-center gap-2'>
      <h2 id="empty-state-title" className='text-medium-16'>There is currently no request file</h2>
      <p className='text-regular-12 text-center w-[500px]'>
        Request files from anyone, with or without a NexFile account, and store them securely in your chosen folder. Files are auto-organized, ensuring privacy.
      </p>
    </div>
  </section>
);

export default EmptyState;