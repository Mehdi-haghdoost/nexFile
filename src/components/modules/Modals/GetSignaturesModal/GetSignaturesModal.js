"use client";
import React from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import { CloseIcon } from '@/components/ui/icons';

const GetSignaturesModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.getSignatures;

    const handleClose = () => {
        closeModal('getSignatures');
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='500px' maxWidth='90vw'>
            <article className="w-full flex flex-col gap-6">
                <header className='flex justify-between items-center gap-2 self-stretch'>
                    <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>Get Signatures</h1>
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
                            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </figure>
                    
                    <section className='flex flex-col items-center gap-2 text-center px-4'>
                        <h2 className='text-lg font-semibold text-neutral-500 dark:text-white'>Coming Soon</h2>
                        <p className='text-sm text-neutral-400 dark:text-neutral-300 max-w-md'>
                            The ability to send documents to others for signatures is currently under development. 
                            This feature will allow you to:
                        </p>
                        <ul className='text-sm text-neutral-400 dark:text-neutral-300 text-left mt-2 space-y-1'>
                            <li>• Send documents via email for signing</li>
                            <li>• Track signature status in real-time</li>
                            <li>• Set multiple signers with signing order</li>
                            <li>• Receive notifications when completed</li>
                        </ul>
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

export default GetSignaturesModal;