import FileIcon from '@/components/ui/FileIcon';

const TransfersTable = ({ transfers, onActionClick }) => {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getFirstFileExtension = (transfer) => {
    if (transfer.files && transfer.files.length > 0) {
      return transfer.files[0].extension || 'file';
    }
    return 'file';
  };

  return (
    <div className='flex flex-col gap-4 self-stretch w-full overflow-x-hidden'>
      {/* Desktop Table - 1024px+ */}
      <div className='hidden lg:block w-full'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b border-stroke-200 dark:bg-neutral-800 dark:border-neutral-700'>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Group name</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Created</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Expiration</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Download</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Views</th>
              <th className='text-left py-3 px-4 text-regular-14 dark:text-regular-14-neutral-300'>Action</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className='border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group'
              >
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-3'>
                    <FileIcon extension={getFirstFileExtension(transfer)} />
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{transfer.groupName}</p>
                      <p className='text-regular-12 text-neutral-300 dark:text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors duration-300'>{transfer.filesCount} files</p>
                    </div>
                  </div>
                </td>
                <td className='py-4 px-4'>
                  <p className='text-regular-14 text-neutral-400 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{formatDate(transfer.createdAt)}</p>
                </td>
                <td className='py-4 px-4'>
                  <p className='text-regular-14 text-neutral-400 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{formatDate(transfer.expirationDate)}</p>
                </td>
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{transfer.downloadCount}</span>
                    <span className='text-regular-12 text-neutral-300 dark:text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors duration-300'>downloads</span>
                  </div>
                </td>
                <td className='py-4 px-4'>
                  <span className='text-medium-14 text-neutral-500 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-300'>{transfer.viewCount}</span>
                </td>
                <td className='py-4 px-4'>
                  <button
                    className='flex items-center justify-center w-8 h-8 p-1 shadow-custom border border-stroke-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-600 hover:scale-105 transition-all duration-300 group-hover:shadow-middle'
                    onClick={() => onActionClick(transfer.id)}
                    aria-label={`Actions for ${transfer.groupName}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                      <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" className='dark:fill-neutral-200 group-hover:fill-neutral-700 dark:group-hover:fill-white transition-colors duration-300' />
                      <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" className='dark:fill-neutral-200 group-hover:fill-neutral-700 dark:group-hover:fill-white transition-colors duration-300' />
                      <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" className='dark:fill-neutral-200 group-hover:fill-neutral-700 dark:group-hover:fill-white transition-colors duration-300' />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet Compact Table - 640px to 1024px - با Header */}
      <div className='hidden sm:block lg:hidden w-full'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b border-stroke-200 dark:bg-neutral-800 dark:border-neutral-700'>
              <th className='text-left py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Group</th>
              <th className='text-left py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Dates</th>
              <th className='text-left py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Stats</th>
              <th className='text-right py-2.5 px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Act</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className='border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 group'
              >
                <td className='py-3 px-3'>
                  <div className='flex items-center gap-2'>
                    <div className='shrink-0'>
                      <FileIcon extension={getFirstFileExtension(transfer)} />
                    </div>
                    <div className='flex flex-col gap-0.5 min-w-0'>
                      <p className='text-xs font-medium text-neutral-500 dark:text-neutral-200 truncate'>{transfer.groupName}</p>
                      <p className='text-xs text-neutral-300 dark:text-neutral-400'>{transfer.filesCount} files</p>
                    </div>
                  </div>
                </td>
                <td className='py-3 px-3'>
                  <div className='flex flex-col gap-0.5'>
                    <p className='text-xs text-neutral-400 dark:text-neutral-300'>{formatDateShort(transfer.createdAt)}</p>
                    <p className='text-xs text-neutral-300 dark:text-neutral-400'>→ {formatDateShort(transfer.expirationDate)}</p>
                  </div>
                </td>
                <td className='py-3 px-3'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path d="M8 3.33333V8L10.6667 9.33333M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="currentColor" className="stroke-neutral-400 dark:stroke-neutral-300" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{transfer.downloadCount}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path d="M1.33333 8C1.33333 8 3.33333 3.33333 8 3.33333C12.6667 3.33333 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33333 12.6667 1.33333 8 1.33333 8Z" stroke="currentColor" className="stroke-neutral-400 dark:stroke-neutral-300" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" className="stroke-neutral-400 dark:stroke-neutral-300" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{transfer.viewCount}</span>
                    </div>
                  </div>
                </td>
                <td className='py-3 px-3 text-right'>
                  <button
                    className='inline-flex items-center justify-center w-7 h-7 shadow-custom border border-stroke-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded hover:bg-gray-50 dark:hover:bg-neutral-600 transition-all duration-300'
                    onClick={() => onActionClick(transfer.id)}
                    aria-label={`Actions for ${transfer.groupName}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="3" height="10" viewBox="0 0 4 12" fill="none">
                      <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" className='dark:fill-neutral-200' />
                      <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" className='dark:fill-neutral-200' />
                      <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" className='dark:fill-neutral-200' />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - <640px - با Header Style */}
      <div className='flex sm:hidden flex-col gap-0 w-full border border-stroke-300 dark:border-neutral-700 rounded-lg overflow-hidden'>
        {/* Mobile Header */}
        <div className='flex items-center justify-between py-2.5 px-3 bg-stroke-100 dark:bg-neutral-800 border-b border-stroke-200 dark:border-neutral-700'>
          <span className='text-xs font-semibold text-neutral-500 dark:text-neutral-300'>Transfers</span>
          <span className='text-xs text-neutral-400 dark:text-neutral-400'>{transfers.length} items</span>
        </div>

        {/* Mobile Cards */}
        <div className='flex flex-col'>
          {transfers.map((transfer, index) => (
            <div 
              key={transfer.id}
              className={`flex flex-col gap-3 p-3 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ${
                index !== transfers.length - 1 ? 'border-b border-stroke-200 dark:border-neutral-700' : ''
              }`}
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  <FileIcon extension={getFirstFileExtension(transfer)} />
                  <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                    <p className='text-sm font-medium text-neutral-500 dark:text-neutral-200 truncate'>{transfer.groupName}</p>
                    <p className='text-xs text-neutral-300 dark:text-neutral-400'>{transfer.filesCount} files</p>
                  </div>
                </div>
                <button
                  className='flex items-center justify-center w-7 h-7 shrink-0 shadow-custom border border-stroke-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded'
                  onClick={() => onActionClick(transfer.id)}
                  aria-label={`Actions for ${transfer.groupName}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="3" height="10" viewBox="0 0 4 12" fill="none">
                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" className='dark:fill-neutral-200' />
                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" className='dark:fill-neutral-200' />
                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" className='dark:fill-neutral-200' />
                  </svg>
                </button>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex flex-col gap-0.5'>
                  <p className='text-xs text-neutral-300 dark:text-neutral-400'>Created</p>
                  <p className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{formatDateShort(transfer.createdAt)}</p>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <p className='text-xs text-neutral-300 dark:text-neutral-400'>Expires</p>
                  <p className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{formatDateShort(transfer.expirationDate)}</p>
                </div>
                <div className='flex items-center gap-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3.33333V8L10.6667 9.33333M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="currentColor" className="stroke-neutral-400 dark:stroke-neutral-300" strokeWidth="1.2"/>
                  </svg>
                  <span className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{transfer.downloadCount}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M1.33333 8C1.33333 8 3.33333 3.33333 8 3.33333C12.6667 3.33333 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33333 12.6667 1.33333 8 1.33333 8Z" stroke="currentColor" className="stroke-neutral-400 dark:stroke-neutral-300" strokeWidth="1.2"/>
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" className="stroke-neutral-400 dark:stroke-neutral-300" strokeWidth="1.2"/>
                  </svg>
                  <span className='text-xs font-medium text-neutral-500 dark:text-neutral-200'>{transfer.viewCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {transfers.length === 0 && (
        <div className='flex justify-center items-center py-12'>
          <p className='text-sm text-gray-500 dark:text-neutral-400'>No transfers yet</p>
        </div>
      )}
    </div>
  );
};

export default TransfersTable;