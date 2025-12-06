import React from 'react';
import { DownloadIcon } from '@/components/ui/icons';

const EmptyState = () => (
  <section className='flex flex-1 flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-7 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900' aria-labelledby="empty-state-title">
    <div className='flex flex-col justify-center items-center gap-2 p-1 w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-2xl border-2 border-[rgba(255,255,255,0.70)] dark:border-dark-white-70 bg-gradient-to-b from-[#E1E1E5] to-[#AFAFB2] dark:bg-dark-neutral-gradient'>
      <div className='flex items-center justify-center'>
        <DownloadIcon aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
    </div>

    <div className='flex flex-col items-center gap-2 mt-4'>
      <h2 id="empty-state-title" className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>
        There is currently no request file
      </h2>
      <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center max-w-[500px] px-4'>
        Request files from anyone, with or without a NexFile account, and store them securely in your chosen folder. Files are auto-organized, ensuring privacy.
      </p>
    </div>
  </section>
);

export default EmptyState;