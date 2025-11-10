import RequestForFiles from '@/components/templates/home/file-requests/RequestForFiles'
import React from 'react'

const FileRequestsContent = () => {
  return (
    <div className='flex flex-1 py-6 px-8 flex-col items-start gap-6 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800'>
      <RequestForFiles />
    </div>
  )
}

export default FileRequestsContent