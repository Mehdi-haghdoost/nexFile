import RequestForFiles from '@/components/templates/home/file-requests/RequestForFiles'
import React from 'react'

const FileRequestsContent = () => {
  return (
    <div className='flex flex-1 py-4 px-4 md:py-6 md:px-8 flex-col items-start gap-4 md:gap-6 self-stretch bg-white dark:bg-neutral-900 dark:border-neutral-800 w-full min-w-0'>
      <RequestForFiles />
    </div>
  )
}

export default FileRequestsContent;