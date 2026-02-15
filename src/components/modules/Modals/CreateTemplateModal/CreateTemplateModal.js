"use client";
import React from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { CloseIcon } from '@/components/ui/icons';

const CreateTemplateModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.createTemplate;

    const handleClose = () => {
        closeModal('createTemplate');
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='500px' maxWidth='90vw'>
            <article className="w-full flex flex-col gap-6">
                <header className='flex justify-between items-center gap-2 self-stretch'>
                    <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>Create Template</h1>
                    <button 
                        onClick={handleClose} 
                        className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0" 
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </header>

                <main className='flex flex-col items-center gap-4 py-8'>
                    <figure className='flex w-20 h-20 flex-col justify-center items-center gap-2 rounded-2xl border-2 border-dark-white-70 bg-[linear-gradient(180deg,#E1E1E5_0%,#AFAFB2_100%)] dark:bg-dark-neutral-gradient'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </figure>
                    
                    <section className='flex flex-col items-center gap-2 text-center px-4'>
                        <h2 className='text-lg font-semibold text-neutral-500 dark:text-white'>Coming Soon</h2>
                        <p className='text-sm text-neutral-400 dark:text-neutral-300 max-w-md'>
                            Template creation feature is under development. This will allow you to:
                        </p>
                        <ul className='text-sm text-neutral-400 dark:text-neutral-300 text-left mt-2 space-y-1'>
                            <li>• Create reusable PDF templates</li>
                            <li>• Add signature placeholders</li>
                            <li>• Define fillable fields</li>
                            <li>• Save templates for future use</li>
                        </ul>
                        <p className='text-xs text-neutral-400 dark:text-neutral-300 mt-4'>
                            For now, you can use the PDF Editor to create custom documents.
                        </p>
                    </section>
                </main>

                <footer className="flex justify-end">
                    <button
                        onClick={handleClose}
                        type="button"
                        className='flex items-center justify-center gap-2 h-10 py-3 px-6 rounded-lg border border-primary-500 shadow-middle bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity'
                    >
                        Got it
                    </button>
                </footer>
            </article>
        </BaseModal>
    );
};

export default CreateTemplateModal;