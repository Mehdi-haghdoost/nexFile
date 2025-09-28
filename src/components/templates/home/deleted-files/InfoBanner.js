import { InfoIcon } from '@/components/ui/icons'
import React from 'react'

const InfoBanner = () => {
  return (
    <aside 
      className='flex items-center gap-2 py-2.5 px-3.5 w-full rounded-lg border border-[#EBEFFE] bg-[#365AF9] bg-opacity-5'
      role="note"
      aria-label="Recovery information"
    >
      <div className='flex flex-1 gap-2 items-start  w-full'>
        <InfoIcon aria-hidden="true" />
        <p className='text-regular-14-neutral-500'>You can recover any deleted file listed below</p>
      </div>
    </aside>
  )
}

export default InfoBanner