import React from 'react'
import FileListHeader from './FileListHeader'
import FileRow from './FileRow'

const FileList = ({ deletedFiles, selectedFiles, onSelectFile }) => {
  return (
    <section 
      className='flex flex-1 flex-col w-full items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden'
      aria-label="Deleted files list"
    >
      <FileListHeader />
      <ul role="list" className='w-full'>
        {deletedFiles.map((file) => (
          <FileRow 
            key={file.id} 
            file={file}
            isSelected={selectedFiles.includes(file.id)}
            onSelect={onSelectFile}
          />
        ))}
      </ul>
    </section>
  )
}

export default FileList