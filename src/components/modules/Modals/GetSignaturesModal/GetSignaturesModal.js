"use client";
import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import useSignatures from '@/hooks/signatures/useSignatures';
import useAllFiles from '@/hooks/files/filesManagement/useAllFiles';
import useApplySignature from '@/hooks/signatures/useApplySignature';
import { CloseIcon } from '@/components/ui/icons';
import SignatureProcessingModal from '@/components/modules/Modals/SignatureProcessingModal/SignatureProcessingModal';
import PdfPickerList from '@/components/modules/Modals/SignatureModalParts/PdfPickerList';
import SignaturePickerList from '@/components/modules/Modals/SignatureModalParts/SignaturePickerList';

const GetSignaturesModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.getSignatures;

    // The inner component holds the hooks, so nothing is fetched while the modal is closed
    if (!isOpen) return null;

    return <GetSignaturesModalInner closeModal={closeModal} />;
};

const GetSignaturesModalInner = ({ closeModal }) => {
    const { signatures, isLoading: signaturesLoading } = useSignatures();
    const { files: pdfFiles, isLoading: filesLoading } = useAllFiles({ mimeType: 'application/pdf' });
    const { applySignature, isApplying, progress, step } = useApplySignature();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedSignature, setSelectedSignature] = useState(null);

    const handleClose = () => {
        closeModal('getSignatures');
        setCurrentStep(1);
        setSelectedPdf(null);
        setSelectedSignature(null);
    };

    const handlePdfSelect = (pdf) => {
        setSelectedPdf(pdf);
        setCurrentStep(2);
    };

    const handleBack = () => {
        setCurrentStep(1);
        setSelectedSignature(null);
    };

    const handleApply = async () => {
        const result = await applySignature({
            pdfId: selectedPdf?.id,
            signatureId: selectedSignature?._id,
        });

        if (result.success) {
            handleClose();
            window.location.reload();
        }
    };

    return (
        <>
            <BaseModal isOpen={true} onClose={handleClose} width='600px' maxWidth='90vw'>
                <article className="w-full flex flex-col max-h-[80vh]">
                    <header className="flex-shrink-0 flex justify-between items-center gap-2 mb-4 sm:mb-6">
                        <div className='flex items-center gap-2'>
                            {currentStep === 2 && (
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
                                {currentStep === 1 ? 'Select PDF' : 'Select Signature'}
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

                    <div className='flex items-center gap-2 mb-4 sm:mb-6'>
                        <div className='flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-primary-500 text-white'>
                            1
                        </div>
                        <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-700'}`} />
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-500'}`}>
                            2
                        </div>
                    </div>

                    <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                        <section className='flex flex-col gap-3'>
                            {currentStep === 1 ? (
                                <PdfPickerList
                                    files={pdfFiles}
                                    isLoading={filesLoading}
                                    selectedId={selectedPdf?.id}
                                    onSelect={handlePdfSelect}
                                />
                            ) : (
                                <SignaturePickerList
                                    signatures={signatures}
                                    isLoading={signaturesLoading}
                                    selectedId={selectedSignature?._id}
                                    onSelect={setSelectedSignature}
                                />
                            )}
                        </section>
                    </main>

                    {currentStep === 2 && (
                        <footer className="flex-shrink-0 flex flex-col gap-3 pt-4 sm:pt-6">
                            <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                                The signed copy is saved beside the original, in {selectedPdf?.folderName || 'Home'}.
                            </p>
                            <div className='flex justify-end gap-3'>
                                <button
                                    onClick={handleBack}
                                    disabled={isApplying}
                                    type="button"
                                    className='flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={!selectedSignature || isApplying}
                                    type="button"
                                    className='flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-6 rounded-lg border border-primary-500 bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
                                >
                                    Apply Signature
                                </button>
                            </div>
                        </footer>
                    )}
                </article>
            </BaseModal>

            <SignatureProcessingModal
                isOpen={isApplying}
                progress={progress}
                currentStep={step}
            />
        </>
    );
};

export default GetSignaturesModal;