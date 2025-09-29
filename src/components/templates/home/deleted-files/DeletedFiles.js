import React from 'react'
import DeletedFilesHeader from './DeletedFilesHeader'
import InfoBanner from './InfoBanner'
import FilterControls from './FilterControls'
import FileList from './FileList'
import ActionBar from './ActionBar'
import EmptyDeletedFiles from './EmptyDeletedFiles'
import { useFilesStore } from '@/store'

const DeletedFiles = () => {
  const {
    deletedFiles,
    selectedFiles,
    selectFile,
    restoreFiles
  } = useFilesStore()

  const isEmpty = deletedFiles.length === 0

  return (
    <main className='flex flex-1 flex-col items-start gap-6 py-6 px-8 bg-white self-stretch h-screen'>
      <section className='flex flex-1 flex-col items-start gap-5 self-stretch'>
        <DeletedFilesHeader />
        <InfoBanner />
        
        {/* Filter Controls و Action Bar */}
        <div className='flex items-center justify-between w-full gap-4'>
          <FilterControls />
          {selectedFiles.length > 0 && !isEmpty && (
            <ActionBar
              selectedCount={selectedFiles.length}
              onRestore={restoreFiles}
            />
          )}
        </div>

        {/* Conditional Rendering: Empty State یا File List */}
        {isEmpty ? (
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