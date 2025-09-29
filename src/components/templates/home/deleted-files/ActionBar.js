import React from 'react'
import useModalStore from '@/store/ui/modalStore'
import { useFilesStore } from '@/store'

const ActionBar = ({ selectedCount, onRestore }) => {
  const { openModal } = useModalStore()
  const { deletedFiles, selectedFiles } = useFilesStore()

  const handleDeletePermanent = () => {
    // پیدا کردن اولین فایل انتخاب شده برای نمایش در مدال
    const selectedFile = deletedFiles.find(f => selectedFiles.includes(f.id))
    
    openModal('deletePermanent', selectedFile)
  }

  return (
    <div className='flex items-center justify-end gap-3 py-2 px-4 rounded-lg border border-stroke-300 bg-white shadow-middle'>
      <span className='text-regular-14 text-neutral-700'>
        {selectedCount} file{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className='flex items-center gap-2'>
        <button
          onClick={handleDeletePermanent}
          className='flex items-center justify-center gap-1.5 h-8 px-[14px] rounded-lg border border-error-400 bg-gradient-to-b from-[#E95858] to-[#B63542] shadow-lg text-medium-14-white text-center'
        >
          Delete Permanent
        </button>
        <button
          onClick={onRestore}
          className='flex items-center justify-center gap-1.5 h-8 px-[14px] rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-lg text-medium-14-white text-center'
        >
          Restore
        </button>
      </div>
    </div>
  )
}

export default ActionBar