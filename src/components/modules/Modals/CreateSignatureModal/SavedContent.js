import React, { useState } from 'react';

const SavedContent = () => {
    const [savedSignatures] = useState([
        { id: 1, name: 'John Doe', type: 'Draw', createdAt: '2 days ago' },
        { id: 2, name: 'J. Doe', type: 'Type', createdAt: '1 week ago' },
        { id: 3, name: 'Signature 1', type: 'Upload', createdAt: '2 weeks ago' }
    ]);

    const handleSelectSignature = (signature) => {
        console.log('Selected signature:', signature);
        // اینجا منطق انتخاب امضا
    };

    const handleDeleteSignature = (signatureId) => {
        if (confirm('Are you sure you want to delete this signature?')) {
            console.log('Delete signature:', signatureId);
            // اینجا منطق حذف امضا
        }
    };

    return (
        <article className='flex flex-col items-start gap-6 self-stretch'>
            <header className='flex flex-col items-center gap-4 self-stretch'>
                <figure className='flex w-18 h-18 p-1 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="21,8 16,8 16,3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </figure>
                <section className='flex flex-col items-center gap-1'>
                    <h2 className='text-medium-16 text-neutral-500 dark:text-medium-16-white'>Saved Signatures</h2>
                    <p className='text-regular-12 text-neutral-300 text-center dark:text-regular-12-neutral-300-white'>
                        Choose from your previously created signatures
                    </p>
                </section>
            </header>

            <main className='flex flex-col items-start gap-4 self-stretch'>
                <header className='flex items-center justify-between self-stretch'>
                    <h3 className='text-medium-16 text-neutral-600 dark:text-medium-16-white'>Your Signatures</h3>
                    <aside className='text-regular-12 text-neutral-400 dark:text-regular-12-neutral-300-white'>
                        {savedSignatures.length} signature{savedSignatures.length !== 1 ? 's' : ''}
                    </aside>
                </header>

                {savedSignatures.length > 0 ? (
                    <section className='flex flex-col gap-3 self-stretch' role="list">
                        {savedSignatures.map((signature) => (
                          <article 
    key={signature.id} 
    className='flex items-center justify-between p-3 rounded-lg border border-stroke-200 bg-white dark:bg-neutral-700 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-gradient-hover transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:shadow-custom'
    role="listitem"
>
                                <section
                                    className='flex items-center gap-3 flex-1 cursor-pointer'
                                    onClick={() => handleSelectSignature(signature)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleSelectSignature(signature);
                                        }
                                    }}
                                    aria-label={`Select signature ${signature.name}`}
                                >
                                    <figure className='w-12 h-8 bg-gray-100 rounded border flex items-center justify-center dark:bg-neutral-500'>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                            <path d="M2 13C5.333 11.5 7.5 9.5 7.5 7.5C7.5 5.5 6.5 5.5 5.5 5.5C4.5 5.5 3.5 6.25 3.53 7.5C3.56 8.82 4.74 9.36 5.25 10.5C6.25 12 6.75 12.5 7.5 11.5C8.17 10.5 8.67 9.67 9 9C9.75 11.5 11 12.5 12.5 12.5H14.5M14.5 12.5L12.5 10V1.5C12.5 0.948 12.948 0.5 13.5 0.5C14.052 0.5 14.5 0.948 14.5 1.5V10L14.5 12.5ZM12.5 3.5H14.5"
                                                stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                className='dark:stroke-white'
                                            />
                                        </svg>
                                    </figure>
                                    <section className='flex-1'>
                                        <header className='flex items-center gap-2'>
                                            <h4 className='text-medium-14 text-neutral-600 dark:text-medium-14-white'>{signature.name}</h4>
                                            <span className='text-regular-10 text-neutral-400 bg-gray-100 dark:bg-neutral-500 dark:text-white px-2 py-0.5 rounded'>
                                                {signature.type}
                                            </span>
                                        </header>
                                        <time className='text-regular-12 text-neutral-400 dark:text-regular-12-neutral-300-white'>
                                            Created {signature.createdAt}
                                        </time>
                                    </section>
                                </section>
                                <aside className='flex items-center gap-2'>
                                    <button
                                        onClick={() => handleSelectSignature(signature)}
                                        type="button"
                                        className='p-2 hover:bg-gray-100 dark:hover:bg-transparent rounded text-regular-12 text-primary-500 dark:text-regular-12-neutral-300-white'
                                        aria-label={`Select ${signature.name}`}
                                    >
                                        Select
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSignature(signature.id)}
                                        type="button"
                                        className='p-1 hover:bg-gray-100 dark:hover:bg-neutral-500 rounded'
                                        aria-label={`Delete ${signature.name}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                            <path d="M12 4L4 12M4 4L12 12"
                                                stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"
                                                className='dark:stroke-white'
                                            />
                                        </svg>
                                    </button>
                                </aside>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className='flex flex-col items-center gap-3 py-8'>
                        <figure className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </figure>
                        <section className='flex flex-col items-center gap-1'>
                            <h4 className='text-medium-14 text-neutral-500'>No saved signatures</h4>
                            <p className='text-regular-12 text-neutral-400'>
                                Create your first signature using the other tabs
                            </p>
                        </section>
                    </section>
                )}
            </main>
        </article>
    );
};

export default SavedContent;