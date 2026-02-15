"use client";
import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import useSignatures from '@/hooks/signatures/useSignatures';
import { useFiles } from '@/hooks/files/filesManagement/useFiles';
import { CloseIcon } from '@/components/ui/icons';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const GetSignaturesModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.getSignatures;
    const { signatures, isLoading: signaturesLoading } = useSignatures();
    const { files: allFiles, isLoading: filesLoading } = useFiles();

    const [step, setStep] = useState(1);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter only PDF files
    const pdfFiles = allFiles.filter(file => file.mimeType === 'application/pdf' && !file.isDeleted);

    const handleClose = () => {
        closeModal('getSignatures');
        setStep(1);
        setSelectedPdf(null);
        setSelectedSignature(null);
        setIsProcessing(false);
    };

    const handlePdfSelect = (pdf) => {
        setSelectedPdf(pdf);
        setStep(2);
    };

    const handleSignatureSelect = (signature) => {
        setSelectedSignature(signature);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedSignature(null);
    };

    // const handleApplySignature = async () => {

    //     if (!selectedPdf || !selectedSignature) {
    //         showErrorToast('Please select both PDF and signature');
    //         return;
    //     }

    //     setIsProcessing(true);

    //     try {
    //         // Simulate API call
    //         await new Promise(resolve => setTimeout(resolve, 1500));

    //         showSuccessToast('Signature applied successfully');
    //         handleClose();
    //     } catch (error) {
    //         console.error('Error applying signature:', error);
    //         showErrorToast('Failed to apply signature');
    //     } finally {
    //         setIsProcessing(false);
    //     }
    // };

    const handleApplySignature = async () => {
        if (!selectedPdf || !selectedSignature) {
            showErrorToast('Please select both PDF and signature');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/signatures/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    pdfId: selectedPdf.id,
                    signatureId: selectedSignature._id,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to apply signature');
            }

            showSuccessToast('Signature applied successfully! Check your files.');
            handleClose();

            // Refresh files list
            if (window.location.pathname === '/home') {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error applying signature:', error);
            showErrorToast(error.message || 'Failed to apply signature');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} width='600px' maxWidth='90vw'>
            <article className="w-full flex flex-col max-h-[80vh]">
                {/* Header */}
                <header className="flex-shrink-0 flex justify-between items-center gap-2 mb-4 sm:mb-6">
                    <div className='flex items-center gap-2'>
                        {step === 2 && (
                            <button
                                onClick={handleBack}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                                aria-label="Go back"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 dark:text-white" />
                                </svg>
                            </button>
                        )}
                        <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
                            {step === 1 ? 'Select PDF' : 'Select Signature'}
                        </h1>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0"
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* Progress Indicator */}
                <div className='flex items-center gap-2 mb-4 sm:mb-6'>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-500'
                        }`}>
                        1
                    </div>
                    <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-700'
                        }`} />
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-500'
                        }`}>
                        2
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                    {step === 1 && (
                        <section className='flex flex-col gap-3'>
                            {filesLoading ? (
                                <div className='flex justify-center py-8'>
                                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : pdfFiles.length > 0 ? (
                                pdfFiles.map((pdf) => (
                                    <article
                                        key={pdf.id}
                                        onClick={() => handlePdfSelect(pdf)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPdf?.id === pdf.id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700'
                                                : 'border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        <figure className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center shrink-0'>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M11.667 1.66669H5.00033C4.55831 1.66669 4.13438 1.84228 3.82182 2.15484C3.50926 2.4674 3.33366 2.89133 3.33366 3.33335V16.6667C3.33366 17.1087 3.50926 17.5326 3.82182 17.8452C4.13438 18.1578 4.55831 18.3334 5.00033 18.3334H15.0003C15.4423 18.3334 15.8663 18.1578 16.1788 17.8452C16.4914 17.5326 16.667 17.1087 16.667 16.6667V6.66669L11.667 1.66669Z"
                                                    stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11.667 1.66669V6.66669H16.667" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </figure>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-sm font-medium text-neutral-600 dark:text-white truncate'>
                                                {pdf.name}
                                            </h3>
                                            <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                                                {(pdf.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        {selectedPdf?.id === pdf.id && (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="#4C3CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <div className='flex flex-col items-center gap-3 py-8'>
                                    <figure className='w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
                                                stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M13 2V9H20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </figure>
                                    <div className='text-center'>
                                        <h3 className='text-sm font-medium text-neutral-500 dark:text-white mb-1'>No PDF files found</h3>
                                        <p className='text-xs text-neutral-400 dark:text-neutral-300'>Upload a PDF file to get started</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {step === 2 && (
                        <section className='flex flex-col gap-3'>
                            {signaturesLoading ? (
                                <div className='flex justify-center py-8'>
                                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : signatures.length > 0 ? (
                                signatures.map((signature) => (
                                    <article
                                        key={signature._id}
                                        onClick={() => handleSignatureSelect(signature)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSignature?._id === signature._id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700'
                                                : 'border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        <figure className='w-12 h-9 bg-gray-100 dark:bg-neutral-600 rounded border flex items-center justify-center shrink-0'>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M2 13C5.333 11.5 7.5 9.5 7.5 7.5C7.5 5.5 6.5 5.5 5.5 5.5C4.5 5.5 3.5 6.25 3.53 7.5C3.56 8.82 4.74 9.36 5.25 10.5C6.25 12 6.75 12.5 7.5 11.5C8.17 10.5 8.67 9.67 9 9C9.75 11.5 11 12.5 12.5 12.5H14.5M14.5 12.5L12.5 10V1.5C12.5 0.948 12.948 0.5 13.5 0.5C14.052 0.5 14.5 0.948 14.5 1.5V10L14.5 12.5ZM12.5 3.5H14.5"
                                                    stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                                    className='dark:stroke-white'
                                                />
                                            </svg>
                                        </figure>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-sm font-medium text-neutral-600 dark:text-white truncate'>
                                                {signature.name}
                                            </h3>
                                            <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                                                {signature.type === 'draw' ? 'Drawn' : signature.type === 'type' ? 'Typed' : 'Uploaded'}
                                            </p>
                                        </div>
                                        {selectedSignature?._id === signature._id && (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="#4C3CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <div className='flex flex-col items-center gap-3 py-8'>
                                    <figure className='w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 20C7.333 17 10 14 10 11C10 7 8 7 6 7C4 7 2.354 8.758 2.4 11C2.45 13.548 4.658 14.477 5.5 16C7 18 8 19 10 17C11.167 15.5 11.917 14.167 12.5 13C14 17.318 16.333 19 19 19H22M22 19L18 15V2C18 0.897 18.897 0 20 0C21.103 0 22 0.897 22 2V15L22 19ZM18 5H22"
                                                stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </figure>
                                    <div className='text-center'>
                                        <h3 className='text-sm font-medium text-neutral-500 dark:text-white mb-1'>No signatures found</h3>
                                        <p className='text-xs text-neutral-400 dark:text-neutral-300'>Create a signature first</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </main>

                {/* Footer */}
                {step === 2 && (
                    <footer className="flex-shrink-0 flex justify-end gap-3 pt-4 sm:pt-6">
                        <button
                            onClick={handleBack}
                            disabled={isProcessing}
                            type="button"
                            className='flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                        >
                            Back
                        </button>
                        <button
                            onClick={handleApplySignature}
                            disabled={!selectedSignature || isProcessing}
                            type="button"
                            className='flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-6 rounded-lg border border-primary-500 bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                'Apply Signature'
                            )}
                        </button>
                    </footer>
                )}
            </article>
        </BaseModal>
    );
};

export default GetSignaturesModal;