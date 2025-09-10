import { NewTaskIcon, NoFindingsIcon, SaveIcon } from '@/components/ui/icons'
import React from 'react'

const SignaturesList = () => {
  return (
    <div className='flex flex-col flex-1 items-start gap-5 self-stretch'>
      <h3 className='text-medium-18'>Signatures</h3>
      {/* Filter Button */}
      <div className='flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100'>
        <button className='flex py-1 pr-4 pl-3 justify-center items-center gap-1.5 self-stretch rounded-lg border border-stroke-200 bg-white shadow-middle text-medium-14'>
          <NewTaskIcon />
          Document
        </button>
        <button className='flex py-1 pr-4 pl-3 justify-center items-center gap-1.5 self-stretch rounded text-medium-14'>
          <SaveIcon />
          Template
        </button>
      </div>
      {/* No findings container */}
      <div className='flex py-[70px] px-7 flex-col justify-center items-center gap-4 flex-1 self-stretch rounded-lg border border-stroke-200 bg-white'>
        {/* Logomark */}
        <div className='flex w-[72px] h-[72px]  flex-col justify-center items-center gap-2 rounded-2xl border-2 border-white/70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)]'>
          <NoFindingsIcon />
        </div>
        {/* No findings description */}
        <div className='flex flex-col items-center gap-2'>
          <h3 className='text-medium-16'>There were no findings</h3>
          <p className='text-regular-12-light w-[245px] text-center'> If you sign a document or send it for others to sign, it will appear in this section</p>
        </div>
      </div>
    </div>
  )
}

export default SignaturesList