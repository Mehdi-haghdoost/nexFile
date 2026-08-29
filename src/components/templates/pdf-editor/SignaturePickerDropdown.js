'use client';
import React, { useRef, useEffect, useState } from 'react';
import useSignatures from '@/hooks/signatures/useSignatures';
import useModalStore from '@/store/ui/modalStore';
import usePdfEditorStore from '@/store/features/pdf-editor/pdfEditorStore';
import { ChevronDownIcon, SignatureGlyphIcon } from '@/components/ui/icons';
import SignaturePreview from './shared/SignaturePreview';

const SignaturePickerDropdown = () => {
    const { signatures, isLoading } = useSignatures();
    const { openModal } = useModalStore();
    const { selectedSignature, setSelectedSignature } = usePdfEditorStore();

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Snapshot so a placed box survives edits to the saved signature.
    const handleSelect = (signature) => {
        setSelectedSignature({ type: signature.type, data: signature.data });
        setIsOpen(false);
    };

    const handleCreateNew = () => {
        setIsOpen(false);
        openModal('createSignature');
    };

    return (
        <div className='relative flex-shrink-0' ref={containerRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className='flex h-8 items-center gap-2 px-3 rounded-lg border border-stroke-300 dark:border-neutral-800 bg-white dark:bg-dark-overlay shadow-light hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
            >
                {selectedSignature ? (
                    <SignaturePreview
                        type={selectedSignature.type}
                        data={selectedSignature.data}
                        className='h-5 max-w-[80px] text-sm'
                    />
                ) : (
                    <span className='flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 dark:text-white'>
                        <SignatureGlyphIcon />
                        Choose signature
                    </span>
                )}
                <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {isOpen && (
                <div className='absolute top-full mt-1 left-0 w-64 bg-white dark:bg-neutral-900 border border-stroke-300 dark:border-dark-border rounded-lg shadow-lg z-50 p-2'>
                    <div className='max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-1'>
                        {isLoading && (
                            <p className='text-xs text-neutral-300 dark:text-neutral-300 text-center py-3'>Loading...</p>
                        )}

                        {!isLoading && signatures.length === 0 && (
                            <p className='text-xs text-neutral-300 dark:text-neutral-300 text-center py-3'>No saved signatures yet</p>
                        )}

                        {!isLoading && signatures.map((signature) => (
                            <button
                                key={signature._id}
                                onClick={() => handleSelect(signature)}
                                className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left'
                            >
                                <span className='flex items-center justify-center w-12 h-8 rounded border border-stroke-200 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-800 shrink-0 overflow-hidden'>
                                    <SignaturePreview type={signature.type} data={signature.data} className='max-h-6 max-w-10 text-xs' />
                                </span>
                                <span className='text-xs sm:text-sm text-neutral-500 dark:text-white truncate'>{signature.name}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCreateNew}
                        className='flex items-center justify-center gap-1.5 w-full mt-2 pt-2 border-t border-stroke-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors'
                    >
                        + Create new signature
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignaturePickerDropdown;