// "use client";
// import React, { useEffect, useState } from 'react'
// import BaseModal from '@/components/layouts/Modal/BaseModal';
// import useModalStore from '@/store/ui/modalStore';

// const CreateFolderModal = () => {
//   const { isModalOpen, closeModal } = useModalStore();
//   const [folderName, setFolderName] = useState('');
//   const [folderDescription, setFolderDescription] = useState('');
//   const [folderType, setFolderType] = useState('regular');
//   const [isLoading, setIsLoading] = useState(false);

//   const isOpen = isModalOpen('createFolder');

//   //  اینجا From مربوط به مدال رو Reset میکنیم
//   useEffect(() => {
//     if (!isOpen) {
//       setFolderName('')
//       setFolderDescription('')
//       setFolderType('regular')
//       setIsLoading(false);
//     }
//   }, [isOpen])

//   const handleClose = () => {
//     closeModal('createFolder');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!folderName.trim()) {
//       alert('نام پوشه الزامی است')
//       return;
//     }

//     setIsLoading(true);

//     // بعدا میام اینجا لاجیک مربوط به پوشه رو پیاده سازی میکنم

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       console.log('Creating Folder :', {
//         name: folderName.trim(),
//         description: folderDescription.trim(),
//         type: folderType,
//         createdAt: new Date().toISOString()
//       });

//       // نمایش پیام موفقیت
//       alert(`پوشه "${folderName}" با موفقیت ایجاد شد!`);
//       closeModal('createFolder');

//     } catch (error) {
//       console.error('❌ Error creating folder:', error);
//       alert('خطا در ایجاد پوشه! لطفاً دوباره تلاش کنید.');
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <BaseModal isOpen={isOpen} onClose={handleClose} width="600px">
//       <div className="w-full dark:bg-neutral-900">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-primary-bg">
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//                 <path d="M8.99988 14.7501H3.74988C3.35205 14.7501 2.97052 14.5921 2.68922 14.3108C2.40791 14.0295 2.24988 13.6479 2.24988 13.2501V5.00012C2.24988 4.6023 2.40791 4.22077 2.68922 3.93946C2.97052 3.65816 3.35205 3.50012 3.74988 3.50012H6.74988L8.99988 5.75012H14.2499C14.6477 5.75012 15.0292 5.90816 15.3105 6.18946C15.5918 6.47077 15.7499 6.8523 15.7499 7.25012V9.87512M11.9999 14.7501H16.4999M14.2499 12.5001V17.0001" stroke="#4C3CC6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white" />
//               </svg>
//             </div>
//             <h2 className="text-medium-18 text-medium-18-white">Create folder</h2>
//           </div>
//           <button
//             onClick={handleClose}
//             disabled={isLoading}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
//               <path d="M5 5L15 15M5 15L15 5" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-300" />
//             </svg>
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Folder Name */}
//           <div>
//             <label htmlFor="folderName" className="block text-sm font-medium text-regular-12-light dark:text-regular-12-neutral-300 mb-2">
//               Folder name
//               <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="folderName"
//               value={folderName}
//               onChange={(e) => setFolderName(e.target.value)}
//               disabled={isLoading}
//               className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
//               placeholder="Input name"
//               autoFocus
//               maxLength={100}
//             />
//             <p className="text-xs text-neutral-400 mt-1">100 character limit</p>
//           </div>

//           {/* Folder Type Selection */}
//           <div>
//             <label className="block text-regular-12-light dark:text-regular-12-neutral-300 mb-2">Who has access</label>
//             <div className="space-y-3">
//               <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${folderType === 'regular'
//                   ? 'border-primary-border bg-primary-bg'
//                   : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800'
//                 }`}>
//                 <div className='w-full'>
//                   <div className="text-medium-12 dark:text-medium-12-white pb-1">Everyone</div>
//                   <div className="text-regular-12 dark:text-regular-12-neutral-200">Share with everyone on your team</div>
//                 </div>
//                 <input
//                   type="radio"
//                   name="folderType"
//                   value="regular"
//                   checked={folderType === 'regular'}
//                   onChange={(e) => setFolderType(e.target.value)}
//                   disabled={isLoading}
//                   className="mt-1 text-blue-600 focus:ring-blue-500"
//                 />
//               </label>
//               <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${folderType === 'specific'
//                   ? 'border-primary-border bg-primary-bg'
//                   : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800'
//                 }`}>
//                 <div className='w-full'>
//                   <div className="text-medium-12 dark:text-medium-12-white pb-1">Specific people</div>
//                   <div className="text-regular-12 dark:text-regular-12-neutral-200">Choose who to share this folder with</div>
//                 </div>
//                 <input
//                   type="radio"
//                   name="folderType"
//                   value="specific"
//                   checked={folderType === 'specific'}
//                   onChange={(e) => setFolderType(e.target.value)}
//                   disabled={isLoading}
//                   className="mt-1 text-blue-600 focus:ring-blue-500"
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={handleClose}
//               disabled={isLoading}
//               className="px-6 py-2.5 text-medium-14 dark:text-medium-14-white bg-white border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-gradient dark:shadow-dark-panel"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading || !folderName.trim()}
//               className="px-6 py-2.5 text-medium-14 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//             >
//               {isLoading && (
//                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               )}
//               {isLoading ? 'Creating...' : 'Create'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </BaseModal>
//   );
// };

// export default CreateFolderModal;

"use client";
import React, { useEffect, useState } from 'react'
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';

const CreateFolderModal = () => {
  const { isModalOpen, closeModal } = useModalStore();
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [folderType, setFolderType] = useState('regular');
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = isModalOpen('createFolder');

  //  اینجا From مربوط به مدال رو Reset میکنیم
  useEffect(() => {
    if (!isOpen) {
      setFolderName('')
      setFolderDescription('')
      setFolderType('regular')
      setIsLoading(false);
    }
  }, [isOpen])

  const handleClose = () => {
    closeModal('createFolder');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      alert('نام پوشه الزامی است')
      return;
    }

    setIsLoading(true);

    // بعدا میام اینجا لاجیک مربوط به پوشه رو پیاده سازی میکنم

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Creating Folder :', {
        name: folderName.trim(),
        description: folderDescription.trim(),
        type: folderType,
        createdAt: new Date().toISOString()
      });

      // نمایش پیام موفقیت
      alert(`پوشه "${folderName}" با موفقیت ایجاد شد!`);
      closeModal('createFolder');

    } catch (error) {
      console.error('❌ Error creating folder:', error);
      alert('خطا در ایجاد پوشه! لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} width="600px">
      <div className="w-full dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-primary-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none" className="sm:w-[18px] sm:h-[18px]">
                <path d="M8.99988 14.7501H3.74988C3.35205 14.7501 2.97052 14.5921 2.68922 14.3108C2.40791 14.0295 2.24988 13.6479 2.24988 13.2501V5.00012C2.24988 4.6023 2.40791 4.22077 2.68922 3.93946C2.97052 3.65816 3.35205 3.50012 3.74988 3.50012H6.74988L8.99988 5.75012H14.2499C14.6477 5.75012 15.0292 5.90816 15.3105 6.18946C15.5918 6.47077 15.7499 6.8523 15.7499 7.25012V9.87512M11.9999 14.7501H16.4999M14.2499 12.5001V17.0001" stroke="#4C3CC6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">Create folder</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" className="sm:w-5 sm:h-5">
              <path d="M5 5L15 15M5 15L15 5" stroke="#737379" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-neutral-300" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Folder Name */}
          <div>
            <label htmlFor="folderName" className="block text-xs sm:text-sm font-medium text-neutral-300 dark:text-neutral-300 mb-1.5 sm:mb-2">
              Folder name
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-50 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
              placeholder="Input name"
              autoFocus
              maxLength={100}
            />
            <p className="text-xs text-neutral-400 dark:text-neutral-400 mt-1">100 character limit</p>
          </div>

          {/* Folder Type Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 dark:text-neutral-300 mb-1.5 sm:mb-2">Who has access</label>
            <div className="space-y-2 sm:space-y-3">
              <label className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 border rounded-lg cursor-pointer transition-colors ${folderType === 'regular'
                  ? 'border-primary-border bg-primary-bg'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                }`}>
                <div className='w-full'>
                  <div className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white pb-0.5 sm:pb-1">Everyone</div>
                  <div className="text-xs text-neutral-300 dark:text-neutral-200">Share with everyone on your team</div>
                </div>
                <input
                  type="radio"
                  name="folderType"
                  value="regular"
                  checked={folderType === 'regular'}
                  onChange={(e) => setFolderType(e.target.value)}
                  disabled={isLoading}
                  className="mt-0.5 sm:mt-1 text-blue-600 focus:ring-blue-500 shrink-0"
                />
              </label>
              <label className={`flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 border rounded-lg cursor-pointer transition-colors ${folderType === 'specific'
                  ? 'border-primary-border bg-primary-bg'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                }`}>
                <div className='w-full'>
                  <div className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white pb-0.5 sm:pb-1">Specific people</div>
                  <div className="text-xs text-neutral-300 dark:text-neutral-200">Choose who to share this folder with</div>
                </div>
                <input
                  type="radio"
                  name="folderType"
                  value="specific"
                  checked={folderType === 'specific'}
                  onChange={(e) => setFolderType(e.target.value)}
                  disabled={isLoading}
                  className="mt-0.5 sm:mt-1 text-blue-600 focus:ring-blue-500 shrink-0"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-neutral-500 dark:text-white bg-white border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-dark-gradient dark:shadow-dark-panel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !folderName.trim()}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default CreateFolderModal;