import FileIcon from '@/components/ui/FileIcon';

const TransfersTable = ({ transfers, onActionClick }) => {
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // گرفتن extension فایل اول از transfer
  const getFirstFileExtension = (transfer) => {
    if (transfer.files && transfer.files.length > 0) {
      return transfer.files[0].extension || 'file';
    }
    return 'file';
  };

  return (
    <div className='flex flex-col gap-4 self-stretch'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b border-stroke-200'>
              <th className='text-left py-3 px-4 text-medium-14 text-gray-700'>Group name</th>
              <th className='text-left py-3 px-4 text-medium-14 text-gray-700'>Created</th>
              <th className='text-left py-3 px-4 text-medium-14 text-gray-700'>Expiration</th>
              <th className='text-left py-3 px-4 text-medium-14 text-gray-700'>Download</th>
              <th className='text-left py-3 px-4 text-medium-14 text-gray-700'>Views</th>
              <th className='text-left py-3 px-4 text-medium-14 text-gray-700'>Action</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr 
                key={transfer.id} 
                className='border-b border-stroke-100 hover:bg-gray-50 transition-colors'
              >
                {/* Group Name */}
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-3'>
                    <FileIcon extension={getFirstFileExtension(transfer)} />
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-medium-14 text-gray-900'>{transfer.groupName}</p>
                      <p className='text-regular-12 text-gray-500'>{transfer.filesCount} files</p>
                    </div>
                  </div>
                </td>

                {/* Created */}
                <td className='py-4 px-4'>
                  <p className='text-regular-14 text-gray-700'>{formatDate(transfer.createdAt)}</p>
                </td>

                {/* Expiration */}
                <td className='py-4 px-4'>
                  <p className='text-regular-14 text-gray-700'>{formatDate(transfer.expirationDate)}</p>
                </td>

                {/* Download */}
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-medium-14 text-gray-900'>{transfer.downloadCount}</span>
                    <span className='text-regular-12 text-gray-500'>downloads</span>
                  </div>
                </td>

                {/* Views */}
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-medium-14 text-gray-900'>{transfer.viewCount}</span>
                    <span className='text-regular-12 text-gray-500'>views</span>
                  </div>
                </td>

                {/* Action */}
                <td className='py-4 px-4'>
                  <button
                    className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
                    onClick={() => onActionClick(transfer.id)}
                    aria-label={`Actions for ${transfer.groupName}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                      <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                      <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                      <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State for Table */}
      {transfers.length === 0 && (
        <div className='flex justify-center items-center py-12'>
          <p className='text-regular-14 text-gray-500'>No transfers yet</p>
        </div>
      )}
    </div>
  );
};

export default TransfersTable;