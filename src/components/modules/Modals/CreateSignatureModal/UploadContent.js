import React, { useState, useRef } from 'react';

const UploadContent = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
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
        <article className='flex flex-col items-start gap-6 self-stretch'>
            <header className='flex flex-col items-center gap-4 self-stretch'>
                <figure className='flex w-18 h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <section className='flex flex-col items-center gap-1'>
                    <h2 className='text-medium-16 text-neutral-500 dark:text-medium-16-white'>Upload a photo of your signature</h2>
                    <p className='text-regular-12 text-neutral-300 text-center w-[245px] dark:text-regular-12-neutral-300'>
                        Max file size: 1MB<br />
                        png, jpg, jpeg, bmp, gif
                    </p>
                </section>
            </header>

            {/* Upload Section */}
            <main
                className={`flex py-8 px-7 flex-col justify-center items-center gap-4 flex-1 self-stretch rounded-lg border-2 border-dashed dark:border-dark-white-70 transition-all dark:bg-neutral-900 ${isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-stroke-300 bg-white'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                role="region"
                aria-label="File upload area"
            >
                {uploadedFile ? (
                    <section className='flex flex-col items-center gap-4'>
                        <article className='flex items-center gap-3 p-3 rounded-lg border border-stroke-200 bg-white dark:bg-dark-gradient dark:border-dark-border'>
                            <figure className='w-8 h-8 bg-green-100 rounded flex items-center justify-center dark:bg-neutral-300'>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M13.5 4.5L6 12L2.5 8.5"
                                        stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        className='dark:stroke-white'
                                    />
                                </svg>
                            </figure>
                            <section className='flex-1 '>
                                <h3 className='text-medium-14 text-neutral-600 dark:text-medium-14-white'>{uploadedFile.name}</h3>
                                <p className='text-regular-12 text-neutral-400 dark:text-regular-12-neutral-300'>
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </section>
                            <button
                                onClick={removeFile}
                                type="button"
                                className='p-1 hover:bg-gray-100 rounded dark:hover:bg-neutral-500'
                                aria-label="Remove uploaded file"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
                            className='text-regular-12 text-primary-500 hover:text-primary-600 dark:text-regular-12-neutral-300'
                        >
                            Upload different file
                        </button>
                    </section>
                ) : (
                    <section className='flex flex-col items-center gap-4'>
                        <p className='text-regular-14 text-neutral-500 text-center dark:text-regular-14-white'>
                            Drag and drop your signature image here
                        </p>
                        <span className='text-regular-12 text-neutral-400 dark:text-regular-12-white' aria-hidden="true">or</span>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            className='flex items-center justify-center gap-2 h-10 py-2 px-4 rounded-lg border border-primary-500 dark:border-dark-border bg-primary-500 text-medium-14 text-white hover:bg-primary-600 dark:bg-dark-gradient dark:hover:bg-dark-gradient-hover'
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
};

export default UploadContent;