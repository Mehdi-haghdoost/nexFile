// import React, { useState } from 'react';
// import { NewTaskIcon, NoFindingsIcon, SaveIcon } from '@/components/ui/icons';

// const FilterButton = ({ icon, label, isActive, onClick }) => {
//   const baseClasses = 'flex py-1 pr-3 sm:pr-4 pl-2 sm:pl-3 justify-center items-center gap-1 sm:gap-1.5 self-stretch text-xs sm:text-sm font-medium dark:text-white cursor-pointer transition-[border,box-shadow,transform,color,opacity]';
//   const activeClasses = 'rounded-lg border border-stroke-200 bg-white shadow-middle dark:border-dark-border dark:bg-dark-gradient';
//   const inactiveClasses = 'rounded bg-transparent dark:bg-transparent hover:bg-stroke-100 dark:hover:bg-neutral-700';

//   return (
//     <button 
//       className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
//       onClick={onClick}
//     >
//       {icon}
//       <span className="whitespace-nowrap">{label}</span>
//     </button>
//   );
// };

// const NoFindingsPlaceholder = () => (
//   <div className="flex py-12 sm:py-[70px] px-4 sm:px-7 flex-col justify-center items-center gap-4 flex-1 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
//     <div className="flex w-16 h-16 sm:w-[72px] sm:h-[72px] flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient">
//       <NoFindingsIcon />
//     </div>
//     <div className="flex flex-col items-center gap-2 text-center px-4">
//       <h3 className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white">There were no findings</h3>
//       <p className="text-xs text-neutral-300 dark:text-neutral-300 max-w-[245px]">
//         If you sign a document or send it for others to sign, it will appear in this section
//       </p>
//     </div>
//   </div>
// );

// const SignaturesList = () => {
//   const [activeFilter, setActiveFilter] = useState('document');

//   const handleFilterChange = (filterType) => {
//     setActiveFilter(filterType);
//     console.log('Filter changed to:', filterType);
//     // Add your filtering logic here
//   };

//   return (
//     <section className="flex flex-col flex-1 items-start gap-3 sm:gap-5 self-stretch w-full">
//       <h3 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Signatures</h3>

//       <div className="flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:border-neutral-700 dark:bg-neutral-900 w-full sm:w-auto">
//         <FilterButton
//           icon={<NewTaskIcon />}
//           label="Document"
//           isActive={activeFilter === 'document'}
//           onClick={() => handleFilterChange('document')}
//         />
//         <FilterButton
//           icon={<SaveIcon />}
//           label="Template"
//           isActive={activeFilter === 'template'}
//           onClick={() => handleFilterChange('template')}
//         />
//       </div>

//       <NoFindingsPlaceholder />
//     </section>
//   );
// };

// export default SignaturesList;

import React, { useState } from 'react';
import { NewTaskIcon, NoFindingsIcon, SaveIcon } from '@/components/ui/icons';
import useSignatures from '@/hooks/signatures/useSignatures';
import useDeleteSignature from '@/hooks/signatures/useDeleteSignature';

const FilterButton = ({ icon, label, isActive, onClick }) => {
  const baseClasses = 'flex py-1 pr-3 sm:pr-4 pl-2 sm:pl-3 justify-center items-center gap-1 sm:gap-1.5 self-stretch text-xs sm:text-sm font-medium dark:text-white cursor-pointer transition-[border,box-shadow,transform,color,opacity]';
  const activeClasses = 'rounded-lg border border-stroke-200 bg-white shadow-middle dark:border-dark-border dark:bg-dark-gradient';
  const inactiveClasses = 'rounded bg-transparent dark:bg-transparent hover:bg-stroke-100 dark:hover:bg-neutral-700';

  return (
    <button 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

const NoFindingsPlaceholder = () => (
  <div className="flex py-12 sm:py-[70px] px-4 sm:px-7 flex-col justify-center items-center gap-4 flex-1 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
    <div className="flex w-16 h-16 sm:w-[72px] sm:h-[72px] flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient">
      <NoFindingsIcon />
    </div>
    <div className="flex flex-col items-center gap-2 text-center px-4">
      <h3 className="text-sm sm:text-base font-medium text-neutral-500 dark:text-white">There were no findings</h3>
      <p className="text-xs text-neutral-300 dark:text-neutral-300 max-w-[245px]">
        If you sign a document or send it for others to sign, it will appear in this section
      </p>
    </div>
  </div>
);

const SignatureCard = ({ signature, onDelete }) => {
  const getSignatureTypeLabel = (type) => {
    const labels = { draw: 'Draw', type: 'Type', upload: 'Upload' };
    return labels[type] || type;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);
    
    if (diffDays < 1) return 'today';
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <article className='flex items-center justify-between p-3 sm:p-4 rounded-lg border border-stroke-200 bg-white dark:bg-neutral-800 dark:border-neutral-700 hover:shadow-md transition-shadow'>
      <section className='flex items-center gap-3 flex-1 min-w-0'>
        <figure className='w-12 h-9 sm:w-14 sm:h-10 bg-gray-100 dark:bg-neutral-700 rounded border flex items-center justify-center shrink-0'>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 13C5.333 11.5 7.5 9.5 7.5 7.5C7.5 5.5 6.5 5.5 5.5 5.5C4.5 5.5 3.5 6.25 3.53 7.5C3.56 8.82 4.74 9.36 5.25 10.5C6.25 12 6.75 12.5 7.5 11.5C8.17 10.5 8.67 9.67 9 9C9.75 11.5 11 12.5 12.5 12.5H14.5M14.5 12.5L12.5 10V1.5C12.5 0.948 12.948 0.5 13.5 0.5C14.052 0.5 14.5 0.948 14.5 1.5V10L14.5 12.5ZM12.5 3.5H14.5"
              stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
              className='dark:stroke-white'
            />
          </svg>
        </figure>
        <section className='flex-1 min-w-0'>
          <header className='flex items-center gap-2 mb-1'>
            <h4 className='text-sm sm:text-base font-medium text-neutral-600 dark:text-white truncate'>
              {signature.name}
            </h4>
            <span className='text-xs text-neutral-400 bg-gray-100 dark:bg-neutral-600 dark:text-white px-2 py-0.5 rounded whitespace-nowrap'>
              {getSignatureTypeLabel(signature.type)}
            </span>
            {signature.isDefault && (
              <span className='text-xs text-white bg-primary-500 px-2 py-0.5 rounded whitespace-nowrap'>
                Default
              </span>
            )}
          </header>
          <time className='text-xs text-neutral-400 dark:text-neutral-300'>
            Created {getTimeAgo(signature.createdAt)}
          </time>
        </section>
      </section>
      <aside className='flex items-center gap-2 shrink-0'>
        <button
          onClick={() => onDelete(signature._id)}
          type="button"
          className='p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors'
          aria-label={`Delete ${signature.name}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12"
              stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
        </button>
      </aside>
    </article>
  );
};

const SignaturesList = () => {
  const [activeFilter, setActiveFilter] = useState('document');
  const { signatures, isLoading } = useSignatures();
  const { deleteSignature } = useDeleteSignature();

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };

  const handleDeleteSignature = async (signatureId) => {
    await deleteSignature(signatureId);
  };

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className='text-sm text-neutral-400 dark:text-white'>Loading...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 items-start gap-3 sm:gap-5 self-stretch w-full">
      <h3 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Signatures</h3>

      <div className="flex items-center justify-center gap-1 h-8 p-0.5 rounded-lg border border-stroke-300 bg-stroke-100 dark:border-neutral-700 dark:bg-neutral-900 w-full sm:w-auto">
        <FilterButton
          icon={<NewTaskIcon />}
          label="Document"
          isActive={activeFilter === 'document'}
          onClick={() => handleFilterChange('document')}
        />
        <FilterButton
          icon={<SaveIcon />}
          label="Template"
          isActive={activeFilter === 'template'}
          onClick={() => handleFilterChange('template')}
        />
      </div>

      {signatures.length > 0 ? (
        <div className='flex flex-col gap-3 w-full'>
          {signatures.map((signature) => (
            <SignatureCard
              key={signature._id}
              signature={signature}
              onDelete={handleDeleteSignature}
            />
          ))}
        </div>
      ) : (
        <NoFindingsPlaceholder />
      )}
    </section>
  );
};

export default SignaturesList;