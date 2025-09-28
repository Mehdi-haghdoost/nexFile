import React from 'react'
import FileListHeader from './FileListHeader'
import FileRow from './FileRow'

const FileList = () => {
  const deletedFiles = [
    {
      id: 1,
      name: 'Moodboard_Design_2024.jpg',
      type: 'photo',
      folder: 'Campaign Design',
      category: 'Picture',
      deletedTime: 'Today'
    },
    {
      id: 2,
      name: 'Screen_Record_2024.mp4',
      type: 'video',
      folder: 'Campaign Design',
      category: 'Capture',
      deletedTime: '2 days ago'
    }
  ]

  return (
    <section 
      className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'
      aria-label="Deleted files list"
    >
      <FileListHeader />
      <ul role="list" className='w-full'>
        {deletedFiles.map((file) => (
          <FileRow key={file.id} file={file} />
        ))}
      </ul>
    </section>
  )
}

export default FileList