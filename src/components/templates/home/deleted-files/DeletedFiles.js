import React from 'react'
import DeletedFilesHeader from './DeletedFilesHeader'
import InfoBanner from './InfoBanner'
import FilterControls from './FilterControls'
import FileList from './FileList'

const DeletedFiles = () => {
  return (
    <main className='flex flex-1 flex-col items-start gap-6 py-6 px-8 bg-white self-stretch h-screen'>
      <section className='flex flex-1 flex-col items-start gap-5 self-stretch'>
        <DeletedFilesHeader />
        <InfoBanner />
        <FilterControls />
        <FileList />
      </section>
    </main>
  )
}

export default DeletedFiles