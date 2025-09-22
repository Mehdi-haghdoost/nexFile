'use client';

import React, { useState, useRef } from 'react';
import useModalStore from '@/store/modalStore';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon, CopyIcon, SearchIcon } from '@/components/ui/icons';

const ShareFileRequest = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen, data } = modals.shareFileRequest;

    const [searchQuery, setSearchQuery] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const linkInputRef = useRef(null);

    const generatedLink = data?.link || 'https://www.keepcloud.com/scl/fi/5xq3ikqa4a5mnyqv5s9nj/Title.paper?rlkey=fldio5i1c2j5emsf4v7tu05tb&st=5ocum43f&dl=0';
    const requestTitle = data?.title || 'File Request';

    const handleClose = () => {
        setSearchQuery('');
        setNote('');
        setCopySuccess(false);
        closeModal('shareFileRequest');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
            if (linkInputRef.current) {
                linkInputRef.current.select();
                linkInputRef.current.setSelectionRange(0, 99999);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            console.warn('Please enter email or name');
            return;
        }

        setIsLoading(true);
        try {
            const shareData = {
                link: generatedLink,
                recipients: searchQuery.split(',').map(email => email.trim()),
                note: note.trim(),
                requestTitle: requestTitle
            };

            console.log('Sharing file request:', shareData);

            // شبیه‌سازی API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            handleClose();
        } catch (error) {
            console.error('Failed to share file request:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='500px'>
            <div className='w-full'>
                <article className='flex flex-col gap-6 p-6 bg-white rounded-lg border border-neutral-50'>
                    <form className='flex flex-col items-start gap-6 self-stretch' onSubmit={handleSubmit}>
                        {/* Header */}
                       <header className='flex justify-between items-center self-stretch'>
                           <h1 className='text-medium-18'>Share file request</h1>
                           <button 
                             type="button"
                             onClick={handleClose} 
                             className="p-1 hover:bg-gray-100 rounded"
                             aria-label="Close modal"
                           >
                             <CloseIcon />
                           </button>
                         </header>

                        {/* Input Container */}
                        <div className='flex flex-col items-start gap-4 self-stretch'>
                            {/* Search Input */}
                            <section className='w-full'>
                                <label htmlFor="search-input" className="sr-only">Search name or email address</label>
                                <div className='flex items-center justify-center gap-2 h-8 p-3 self-stretch rounded-lg border border-stroke-500 bg-white'>
                                    <SearchIcon />
                                    <input
                                        id="search-input"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search name or email address"
                                        className="flex-1 text-[#9F9FA3] font-['Manrope'] text-xs not-italic font-normal leading-[1.5] tracking-[-0.24px] outline-0"
                                        required
                                    />
                                </div>
                            </section>

                            {/* Text field */}
                            <section className='flex flex-col items-start gap-1 h-[100px] self-stretch '>
                                <label
                                    htmlFor="note-textarea"
                                    className="block text-regular-14 text-gray-700  text-[#737379] font-['Inter'] text-xs not-italic font-normal leading-[1.5] tracking-[-0.24px]"
                                >
                                    Add a note
                                </label>
                                <textarea
                                    id="note-textarea"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a personal message (optional)"
                                    rows={3}
                                    className="flex flex-1 gap-2 px-4 py-3 w-full border border-stroke-500 bg-white rounded-lg focus:outline-none resize-none placeholder-[#9F9FA3] placeholder-font-['Inter'] placeholder-text-sm placeholder-not-italic placeholder-font-normal placeholder-leading-[1.5] placeholder-tracking-[-0.28px]"
                                />
                            </section>

                            {/* Link Display */}
                            <section className='flex flex-col items-start gap-2 self-stretch'>
                                <label htmlFor="link-input" className='text-regular-12 '>
                                    Link
                                </label>
                                <div className='flex items-center justify-center h-[48px] w-full py-3 px-4 gap-2 rounded-lg bg-white border border-stroke-500'>
                                    <input
                                        id="link-input"
                                        ref={linkInputRef}
                                        type="text"
                                        value={generatedLink}
                                        readOnly
                                        className="overflow-hidden text-[#2E2E37] truncate font-['Manrope'] text-sm not-italic font-normal leading-[1.5] tracking-[-0.28px] flex flex-col line-clamp-1 flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className='px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'
                                        aria-label="Copy link to clipboard"
                                    >
                                        {copySuccess ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <CopyIcon />
                                        )}
                                    </button>
                                </div>
                            </section>
                        </div>
                    </form>

                    {/* Form Footer*/}
                    <footer className='flex items-center justify-end gap-3 pt-2 self-stretch'>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className='flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 text-center disabled:opacity-50'
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading || !searchQuery.trim()}
                            className='flex justify-center items-center gap-2 h-8 py-[13px] px-6 rounded-lg border border-stroke-300 shadow-light text-medium-14 text-center disabled:opacity-50 bg-white text-medium-14'
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </footer>
                </article>
            </div>
        </BaseModal>
    );
};

export default ShareFileRequest;