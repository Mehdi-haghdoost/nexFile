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

const SignYourselfModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.signYourself;

    // The inner component holds the hooks, so nothing is fetched while the modal is closed
    if (!isOpen) return null;

    return <SignYourselfModalInner closeModal={closeModal} />;
};

const SignYourselfModalInner = ({ closeModal }) => {
    const { signatures, isLoading: signaturesLoading } = useSignatures();
    const { files: pdfFiles, isLoading: filesLoading } = useAllFiles({ mimeType: 'application/pdf' });
    const { applySignature, isApplying, progress, step } = useApplySignature();

    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedSignature, setSelectedSignature] = useState(null);

    const handleClose = () => {
        closeModal('signYourself');
        setSelectedPdf(null);
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
            <BaseModal isOpen={true} onClose={handleClose} width='700px' maxWidth='95vw'>
                <article className="w-full flex flex-col max-h-[80vh]">
                    <header className="flex-shrink-0 flex justify-between items-center gap-2 mb-4 sm:mb-6">
                        <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
                            Sign Yourself
                        </h1>
                        <button
                            onClick={handleClose}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0"
                            aria-label="Close modal"
                        >
                            <CloseIcon />
                        </button>
                    </header>

                    <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                            <section className='flex flex-col gap-3'>
                                <header className='flex items-center justify-between'>
                                    <h2 className='text-sm sm:text-base font-medium text-neutral-600 dark:text-white'>
                                        Select PDF
                                    </h2>
                                    <span className='text-xs text-neutral-400 dark:text-neutral-300'>
                                        {pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''}
                                    </span>
                                </header>

                                <div className='flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2'>
                                    <PdfPickerList
                                        files={pdfFiles}
                                        isLoading={filesLoading}
                                        selectedId={selectedPdf?.id}
                                        onSelect={setSelectedPdf}
                                    />
                                </div>
                            </section>

                            <section className='flex flex-col gap-3'>
                                <header className='flex items-center justify-between'>
                                    <h2 className='text-sm sm:text-base font-medium text-neutral-600 dark:text-white'>
                                        Select Signature
                                    </h2>
                                    <span className='text-xs text-neutral-400 dark:text-neutral-300'>
                                        {signatures.length} signature{signatures.length !== 1 ? 's' : ''}
                                    </span>
                                </header>

                                <div className='flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2'>
                                    <SignaturePickerList
                                        signatures={signatures}
                                        isLoading={signaturesLoading}
                                        selectedId={selectedSignature?._id}
                                        onSelect={setSelectedSignature}
                                    />
                                </div>
                            </section>
                        </div>
                    </main>

                    <footer className="flex-shrink-0 flex flex-col gap-3 pt-4 sm:pt-6">
                        {selectedPdf && (
                            <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                                The signed copy is saved beside the original, in {selectedPdf.folderName || 'Home'}.
                            </p>
                        )}
                        <div className='flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3'>
                            <button
                                onClick={handleClose}
                                disabled={isApplying}
                                type="button"
                                className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={!selectedPdf || !selectedSignature || isApplying}
                                type="button"
                                className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-6 rounded-lg border border-primary-500 bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
                            >
                                Apply Signature
                            </button>
                        </div>
                    </footer>
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

export default SignYourselfModal;