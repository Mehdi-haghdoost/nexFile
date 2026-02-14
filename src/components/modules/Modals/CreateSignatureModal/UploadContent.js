// import React, { useState, useRef } from 'react';

// const UploadContent = () => {
//     const [uploadedFile, setUploadedFile] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef(null);

//     const handleFileUpload = (file) => {
//         if (file && file.type.startsWith('image/')) {
//             setUploadedFile(file);
//         } else {
//             alert('Please upload a valid image file');
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const files = Array.from(e.dataTransfer.files);
//         if (files.length > 0) {
//             handleFileUpload(files[0]);
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleFileSelect = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             handleFileUpload(file);
//         }
//     };

//     const removeFile = () => {
//         setUploadedFile(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     return (
//         <article className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
//             <header className='flex flex-col items-center gap-3 sm:gap-4 self-stretch'>
//                 <figure className='flex w-16 h-16 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-6 sm:h-6">
//                         <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                 </figure>
//                 <section className='flex flex-col items-center gap-1'>
//                     <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>Upload a photo of your signature</h2>
//                     <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center px-4'>
//                         Max file size: 1MB<br />
//                         png, jpg, jpeg, bmp, gif
//                     </p>
//                 </section>
//             </header>

//             {/* Upload Section */}
//             <main
//                 className={`flex py-6 sm:py-8 px-4 sm:px-7 flex-col justify-center items-center gap-3 sm:gap-4 flex-1 self-stretch rounded-lg border-2 border-dashed transition-all dark:bg-neutral-900 ${
//                     isDragging
//                         ? 'border-primary-500 bg-primary-50 dark:border-primary-500'
//                         : 'border-stroke-300 bg-white dark:border-dark-white-70'
//                 }`}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 role="region"
//                 aria-label="File upload area"
//             >
//                 {uploadedFile ? (
//                     <section className='flex flex-col items-center gap-3 sm:gap-4 w-full'>
//                         <article className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-stroke-200 bg-white dark:bg-dark-gradient dark:border-dark-border w-full max-w-sm'>
//                             <figure className='w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded flex items-center justify-center dark:bg-neutral-300 shrink-0'>
//                                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sm:w-4 sm:h-4">
//                                     <path d="M13.5 4.5L6 12L2.5 8.5"
//                                         stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//                                         className='dark:stroke-white'
//                                     />
//                                 </svg>
//                             </figure>
//                             <section className='flex-1 min-w-0'>
//                                 <h3 className='text-xs sm:text-sm font-medium text-neutral-600 dark:text-white truncate'>{uploadedFile.name}</h3>
//                                 <p className='text-xs text-neutral-400 dark:text-neutral-300'>
//                                     {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                                 </p>
//                             </section>
//                             <button
//                                 onClick={removeFile}
//                                 type="button"
//                                 className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-500 rounded shrink-0'
//                                 aria-label="Remove uploaded file"
//                             >
//                                 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sm:w-4 sm:h-4">
//                                     <path d="M12 4L4 12M4 4L12 12"
//                                         stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"
//                                         className='dark:stroke-white'
//                                     />
//                                 </svg>
//                             </button>
//                         </article>
//                         <button
//                             onClick={() => fileInputRef.current?.click()}
//                             type="button"
//                             className='text-xs sm:text-sm text-primary-500 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-white transition-colors'
//                         >
//                             Upload different file
//                         </button>
//                     </section>
//                 ) : (
//                     <section className='flex flex-col items-center gap-3 sm:gap-4'>
//                         <p className='text-xs sm:text-sm text-neutral-500 dark:text-white text-center px-4'>
//                             Drag and drop your signature image here
//                         </p>
//                         <span className='text-xs text-neutral-400 dark:text-neutral-300' aria-hidden="true">or</span>
//                         <button
//                             onClick={() => fileInputRef.current?.click()}
//                             type="button"
//                             className='flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-primary-500 dark:border-dark-border bg-primary-500 text-xs sm:text-sm font-medium text-white hover:bg-primary-600 dark:bg-dark-gradient dark:hover:bg-dark-gradient-hover transition-colors'
//                         >
//                             Choose File
//                         </button>
//                     </section>
//                 )}
//             </main>

//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="sr-only"
//                 aria-label="File input for signature upload"
//             />
//         </article>
//     );
// };

// export default UploadContent;

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

const UploadContent = forwardRef((props, ref) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getUploadData: () => {
            return uploadedFile;
        }
    }));

    const handleFileUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 1024 * 1024) {
                alert('File size must be less than 1MB');
                return;
            }
            setUploadedFile(file);
        } else {
            alert('Please upload a valid image file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <article className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
            <header className='flex flex-col items-center gap-3 sm:gap-4 self-stretch'>
                <figure className='flex w-16 h-16 sm:w-18 sm:h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-6 sm:h-6">
                        <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <section className='flex flex-col items-center gap-1'>
                    <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white'>Upload a photo of your signature</h2>
                    <p className='text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 text-center px-4'>
                        Max file size: 1MB<br />
                        png, jpg, jpeg, bmp, gif
                    </p>
                </section>
            </header>

            <main
                className={`flex py-6 sm:py-8 px-4 sm:px-7 flex-col justify-center items-center gap-3 sm:gap-4 flex-1 self-stretch rounded-lg border-2 border-dashed transition-all dark:bg-neutral-900 ${
                    isDragging
                        ? 'border-primary-500 bg-primary-50 dark:border-primary-500'
                        : 'border-stroke-300 bg-white dark:border-dark-white-70'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                role="region"
                aria-label="File upload area"
            >
                {uploadedFile ? (
                    <section className='flex flex-col items-center gap-3 sm:gap-4 w-full'>
                        <article className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-stroke-200 bg-white dark:bg-dark-gradient dark:border-dark-border w-full max-w-sm'>
                            <figure className='w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded flex items-center justify-center dark:bg-neutral-300 shrink-0'>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sm:w-4 sm:h-4">
                                    <path d="M13.5 4.5L6 12L2.5 8.5"
                                        stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        className='dark:stroke-white'
                                    />
                                </svg>
                            </figure>
                            <section className='flex-1 min-w-0'>
                                <h3 className='text-xs sm:text-sm font-medium text-neutral-600 dark:text-white truncate'>{uploadedFile.name}</h3>
                                <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </section>
                            <button
                                onClick={removeFile}
                                type="button"
                                className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-500 rounded shrink-0'
                                aria-label="Remove uploaded file"
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sm:w-4 sm:h-4">
                                    <path d="M12 4L4 12M4 4L12 12"
                                        stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"
                                        className='dark:stroke-white'
                                    />
                                </svg>
                            </button>
                        </article>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            className='text-xs sm:text-sm text-primary-500 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-white transition-colors'
                        >
                            Upload different file
                        </button>
                    </section>
                ) : (
                    <section className='flex flex-col items-center gap-3 sm:gap-4'>
                        <p className='text-xs sm:text-sm text-neutral-500 dark:text-white text-center px-4'>
                            Drag and drop your signature image here
                        </p>
                        <span className='text-xs text-neutral-400 dark:text-neutral-300' aria-hidden="true">or</span>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            className='flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-primary-500 dark:border-dark-border bg-primary-500 text-xs sm:text-sm font-medium text-white hover:bg-primary-600 dark:bg-dark-gradient dark:hover:bg-dark-gradient-hover transition-colors'
                        >
                            Choose File
                        </button>
                    </section>
                )}
            </main>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="sr-only"
                aria-label="File input for signature upload"
            />
        </article>
    );
});

UploadContent.displayName = 'UploadContent';

export default UploadContent;