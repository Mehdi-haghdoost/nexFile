import React from 'react'
import useModalStore from '@/store/ui/modalStore'
import { useFilesStore } from '@/store'

const ActionBar = ({ selectedCount, onRestore }) => {
  const { openModal } = useModalStore()
  const { deletedFiles, selectedFiles } = useFilesStore()

  const handleDeletePermanent = () => {
    const selectedFile = deletedFiles.find(f => selectedFiles.includes(f.id))
    openModal('deletePermanent', selectedFile)
  }

  return (
    <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg border border-stroke-300 bg-white shadow-middle 
        dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-dark-panel
        transition-all duration-300 ease-out hover:shadow-heavy dark:hover:shadow-dark-dropdown'>
      <span className='text-xs sm:text-sm text-neutral-700 dark:text-white text-center sm:text-left'>
        {selectedCount} file{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto'>
        <button
          onClick={handleDeletePermanent}
          className='flex items-center justify-center gap-1.5 h-9 sm:h-8 px-3 sm:px-[14px] rounded-lg border border-error-400 bg-gradient-error shadow-lg text-xs sm:text-sm font-medium text-white text-center
            transition-all duration-300 ease-out hover:brightness-110 hover:shadow-xl active:brightness-90 active:scale-95'
        >
          Delete Permanent
        </button>
        <button
          onClick={onRestore}
          className='flex items-center justify-center gap-1.5 h-9 sm:h-8 px-3 sm:px-[14px] rounded-lg border border-primary-500 bg-gradient-primary shadow-lg text-xs sm:text-sm font-medium text-white text-center
            transition-all duration-300 ease-out hover:brightness-110 hover:shadow-xl active:brightness-90 active:scale-95'
        >
          Restore
        </button>
      </div>
    </div>
  )
}

export default ActionBar