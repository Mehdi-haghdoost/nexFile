'use client';
import React, { useEffect } from 'react'
import DeletedFilesHeader from './DeletedFilesHeader'
import InfoBanner from './InfoBanner'
import FilterControls from './FilterControls'
import FileList from './FileList'
import ActionBar from './ActionBar'
import EmptyDeletedFiles from './EmptyDeletedFiles'
import { useFilesStore } from '@/store'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

const DeletedFiles = () => {
  const {
    deletedFiles,
    selectedFiles,
    selectFile,
    restoreFiles,
    fetchDeletedFiles,
    isDeletedLoading,
    clearSelection,
  } = useFilesStore()

  // Load the trash contents on mount, and clear any stale selection
  useEffect(() => {
    fetchDeletedFiles()
    return () => clearSelection()
  }, [fetchDeletedFiles, clearSelection])

  const isEmpty = deletedFiles.length === 0

  // Restore selected items and surface the result via toast
  const handleRestore = async () => {
    const count = selectedFiles.length
    const result = await restoreFiles()
    if (result?.success) {
      showSuccessToast(`${count} item${count > 1 ? 's' : ''} restored`)
    } else {
      showErrorToast(result?.error || 'Failed to restore')
    }
  }

  return (
    <main className='flex flex-1 flex-col items-start gap-4 md:gap-6 py-4 px-4 md:py-6 md:px-8 bg-white self-stretch min-h-screen dark:bg-neutral-900 dark:border-neutral-800 w-full'>
      <section className='flex flex-1 flex-col items-start gap-4 md:gap-5 self-stretch w-full'>
        <DeletedFilesHeader />
        <InfoBanner />

        {/* Filter controls and the selection action bar */}
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-3 lg:gap-4'>
          <FilterControls />
          {selectedFiles.length > 0 && !isEmpty && (
            <ActionBar
              selectedCount={selectedFiles.length}
              onRestore={handleRestore}
            />
          )}
        </div>

        {/* Loading, empty, or the list */}
        {isDeletedLoading ? (
          <div className='flex items-center justify-center w-full py-16'>
            <div className='w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin' />
          </div>
        ) : isEmpty ? (
          <EmptyDeletedFiles />
        ) : (
          <FileList
            deletedFiles={deletedFiles}
            selectedFiles={selectedFiles}
            onSelectFile={selectFile}
          />
        )}
      </section>
    </main>
  )
}

export default DeletedFiles