import { InfoIcon } from '@/components/ui/icons'
import React from 'react'

const InfoBanner = () => {
  return (
    <aside 
      className='flex items-start sm:items-center gap-2 py-2.5 px-3 sm:px-3.5 w-full rounded-lg border border-[#EBEFFE] bg-[#365AF9] bg-opacity-5 dark:border-neutral-600 dark:bg-neutral-800 dark:border-primary-border'
      role="note"
      aria-label="Recovery information"
    >
      <div className='flex flex-1 gap-2 items-start w-full min-w-0'>
        <div className='flex-shrink-0 mt-0.5 sm:mt-0'>
          <InfoIcon aria-hidden="true" />
        </div>
        {/* Restoring a folder brings its contents too, which is why they are not listed separately */}
        <p className='text-xs sm:text-sm text-neutral-500 dark:text-neutral-200 flex-1'>
          Anything here can be restored. Restoring a folder also restores everything that was inside it.
        </p>
      </div>
    </aside>
  )
}

export default InfoBanner