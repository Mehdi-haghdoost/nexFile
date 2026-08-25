'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import { CloseIcon, FileIcon, SearchIcon } from '@/components/ui/icons';
import useModalStore from '@/store/ui/modalStore';
import useFilesStore from '@/store/features/files/filesStore';

const isPdf = (file) =>
    file.extension === 'pdf' || file.mimeType === 'application/pdf';

const EditPdfModal = () => {
    const router = useRouter();
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.editPdf;

    const { allFiles, isLoading, fetchFiles } = useFilesStore();

    const [selectedFile, setSelectedFile] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        setSelectedFile(null);
        setQuery('');
        fetchFiles();
    }, [isOpen, fetchFiles]);

    const pdfFiles = useMemo(() => {
        const term = query.trim().toLowerCase();

        return allFiles
            .filter(isPdf)
            .filter((file) => {
                if (!term) return true;
                const name = file.originalName || file.name || '';
                return name.toLowerCase().includes(term);
            });
    }, [allFiles, query]);

    const handleClose = () => {
        closeModal('editPdf');
    };

    const handleChoose = () => {
        if (!selectedFile) return;

        closeModal('editPdf');
        router.push(`/pdf-editor/${selectedFile.id}`);
    };

    const renderFileList = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-300">Loading files...</p>
                </div>
            );
        }

        if (pdfFiles.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-300">
                        {query ? 'No PDF matches that search' : 'No PDF files yet'}
                    </p>
                </div>
            );
        }

        return (
            <ul className='flex flex-col items-start gap-1 self-stretch p-0.5 sm:p-1'>
                {pdfFiles.map((file) => (
                    <li key={file.id} className='w-full'>
                        <button
                            onClick={() => setSelectedFile(file)}
                            className={`flex w-full items-center gap-2 p-2 rounded-lg transition-colors text-left ${
                                selectedFile?.id === file.id
                                    ? 'bg-primary-500/10 dark:bg-dark-overlay border border-primary-500'
                                    : 'border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-700'
                            }`}
                        >
                            <FileIcon className="w-4 h-4 shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-neutral-200 truncate">
                                {file.originalName || file.name}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='520px'>
            <div className='w-full'>
                <div className='flex flex-col items-start gap-4 sm:gap-6 self-stretch'>
                    <div className='flex items-center justify-between gap-2 self-stretch'>
                        <h3 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate'>
                            Select a PDF for editing
                        </h3>
                        <button
                            onClick={handleClose}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <div className='flex flex-col items-start gap-3 sm:gap-4 self-stretch'>
                        <div className='flex items-center justify-center gap-2 p-2 sm:p-3 h-8 sm:h-9 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-900 dark:border-neutral-700'>
                            <SearchIcon className="w-4 h-4 shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search PDF files..."
                                className='flex-1 text-xs sm:text-sm text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-200 dark:placeholder:text-neutral-400 outline-0 bg-transparent'
                            />
                        </div>

                        <div className='w-full max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar mb-6 sm:mb-8'>
                            {renderFileList()}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 self-stretch'>
                    <button
                        onClick={handleClose}
                        className='w-full sm:w-auto flex items-center justify-center gap-2 py-2 sm:py-[13px] px-4 sm:px-6 h-9 sm:h-8 rounded-lg border border-[#ECECEE] dark:border-dark-border bg-white dark:bg-dark-gradient shadow-light dark:shadow-dark-panel text-xs sm:text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleChoose}
                        disabled={!selectedFile}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 py-2 sm:py-[13px] px-4 sm:px-6 h-9 sm:h-8 rounded-lg border text-xs sm:text-sm font-medium shadow-light transition-all ${
                            selectedFile
                                ? 'bg-primary-500 text-white hover:bg-primary-600 cursor-pointer border-primary-500'
                                : 'bg-stroke-100 text-neutral-100 dark:text-neutral-400 cursor-not-allowed border-[#ECECEE] dark:border-dark-border dark:bg-neutral-700'
                        }`}
                    >
                        Choose
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default EditPdfModal;