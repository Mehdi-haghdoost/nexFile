// "use client";
// import React, { useState } from 'react';
// import BaseModal from '@/components/layouts/Modal/BaseModal';
// import useModalStore from '@/store/ui/modalStore';
// import useSignatures from '@/hooks/signatures/useSignatures';
// import { useFiles } from '@/hooks/files/filesManagement/useFiles';
// import { CloseIcon } from '@/components/ui/icons';
// import { showSuccessToast, showErrorToast } from '@/lib/toast';
// import SignatureProcessingModal from '@/components/modules/Modals/SignatureProcessingModal/SignatureProcessingModal';

// const SignYourselfModal = () => {
//     const { modals, closeModal } = useModalStore();
//     const { isOpen } = modals.signYourself;
//     const { signatures, isLoading: signaturesLoading } = useSignatures();
//     const { files: allFiles, isLoading: filesLoading } = useFiles();

//     const [selectedPdf, setSelectedPdf] = useState(null);
//     const [selectedSignature, setSelectedSignature] = useState(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [processingProgress, setProcessingProgress] = useState(0);
//     const [processingStep, setProcessingStep] = useState('');

//     const pdfFiles = allFiles.filter(file => file.mimeType === 'application/pdf' && !file.isDeleted);

//     const handleClose = () => {
//         closeModal('signYourself');
//         setSelectedPdf(null);
//         setSelectedSignature(null);
//         setIsProcessing(false);
//         setProcessingProgress(0);
//     };

//     const handleApplySignature = async () => {
//         if (!selectedPdf || !selectedSignature) {
//             showErrorToast('Please select both PDF and signature');
//             return;
//         }

//         setIsProcessing(true);
//         setProcessingProgress(0);

//         try {
//             setProcessingStep('Loading PDF...');
//             setProcessingProgress(20);
//             await new Promise(resolve => setTimeout(resolve, 500));

//             setProcessingStep('Preparing signature...');
//             setProcessingProgress(40);
//             await new Promise(resolve => setTimeout(resolve, 500));

//             setProcessingStep('Applying signature...');
//             setProcessingProgress(60);

//             const response = await fetch('/api/signatures/apply', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     pdfId: selectedPdf.id,
//                     signatureId: selectedSignature._id,
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok || !data.success) {
//                 throw new Error(data.message || 'Failed to apply signature');
//             }

//             setProcessingStep('Uploading document...');
//             setProcessingProgress(80);
//             await new Promise(resolve => setTimeout(resolve, 500));

//             setProcessingStep('Finalizing...');
//             setProcessingProgress(100);
//             await new Promise(resolve => setTimeout(resolve, 500));

//             showSuccessToast('Signature applied! New file: ' + data.file.name);
//             handleClose();
//             window.location.reload();
//         } catch (error) {
//             console.error('Error applying signature:', error);
//             showErrorToast(error.message || 'Failed to apply signature');
//         } finally {
//             setIsProcessing(false);
//             setProcessingProgress(0);
//         }
//     };

//     const isLoading = filesLoading || signaturesLoading;

//     return (
//         <>
//             <BaseModal isOpen={isOpen} onClose={handleClose} width='700px' maxWidth='95vw'>
//                 <article className="w-full flex flex-col max-h-[80vh]">
//                     <header className="flex-shrink-0 flex justify-between items-center gap-2 mb-4 sm:mb-6">
//                         <h1 className='text-base sm:text-lg font-medium text-neutral-500 dark:text-white'>
//                             Sign Yourself
//                         </h1>
//                         <button
//                             onClick={handleClose}
//                             className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0"
//                             aria-label="Close modal"
//                         >
//                             <CloseIcon />
//                         </button>
//                     </header>

//                     <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 -mr-2">
//                         {isLoading ? (
//                             <div className='flex justify-center py-12'>
//                                 <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
//                             </div>
//                         ) : (
//                             <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
//                                 <section className='flex flex-col gap-3'>
//                                     <header className='flex items-center justify-between'>
//                                         <h2 className='text-sm sm:text-base font-medium text-neutral-600 dark:text-white'>
//                                             Select PDF
//                                         </h2>
//                                         <span className='text-xs text-neutral-400 dark:text-neutral-300'>
//                                             {pdfFiles.length} file{pdfFiles.length !== 1 ? 's' : ''}
//                                         </span>
//                                     </header>

//                                     <div className='flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2'>
//                                         {pdfFiles.length > 0 ? (
//                                             pdfFiles.map((pdf) => (
//                                                 <article
//                                                     key={pdf.id}
//                                                     onClick={() => setSelectedPdf(pdf)}
//                                                     className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedPdf?.id === pdf.id
//                                                             ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700'
//                                                             : 'border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
//                                                         }`}
//                                                 >
//                                                     <figure className='w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center shrink-0'>
//                                                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                                             <path d="M11.667 1.66669H5.00033C4.55831 1.66669 4.13438 1.84228 3.82182 2.15484C3.50926 2.4674 3.33366 2.89133 3.33366 3.33335V16.6667C3.33366 17.1087 3.50926 17.5326 3.82182 17.8452C4.13438 18.1578 4.55831 18.3334 5.00033 18.3334H15.0003C15.4423 18.3334 15.8663 18.1578 16.1788 17.8452C16.4914 17.5326 16.667 17.1087 16.667 16.6667V6.66669L11.667 1.66669Z"
//                                                                 stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                                             <path d="M11.667 1.66669V6.66669H16.667" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                                         </svg>
//                                                     </figure>
//                                                     <div className='flex-1 min-w-0'>
//                                                         <h3 className='text-sm font-medium text-neutral-600 dark:text-white truncate'>
//                                                             {pdf.name}
//                                                         </h3>
//                                                         <p className='text-xs text-neutral-400 dark:text-neutral-300'>
//                                                             {(pdf.size / 1024 / 1024).toFixed(2)} MB
//                                                         </p>
//                                                     </div>
//                                                     {selectedPdf?.id === pdf.id && (
//                                                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                                             <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="#4C3CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                                         </svg>
//                                                     )}
//                                                 </article>
//                                             ))
//                                         ) : (
//                                             <div className='flex flex-col items-center gap-3 py-8'>
//                                                 <p className='text-sm text-neutral-400 dark:text-neutral-300 text-center'>
//                                                     No PDF files found
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </section>

//                                 <section className='flex flex-col gap-3'>
//                                     <header className='flex items-center justify-between'>
//                                         <h2 className='text-sm sm:text-base font-medium text-neutral-600 dark:text-white'>
//                                             Select Signature
//                                         </h2>
//                                         <span className='text-xs text-neutral-400 dark:text-neutral-300'>
//                                             {signatures.length} signature{signatures.length !== 1 ? 's' : ''}
//                                         </span>
//                                     </header>

//                                     <div className='flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2'>
//                                         {signatures.length > 0 ? (
//                                             signatures.map((signature) => (
//                                                 <article
//                                                     key={signature._id}
//                                                     onClick={() => setSelectedSignature(signature)}
//                                                     className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSignature?._id === signature._id
//                                                             ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700'
//                                                             : 'border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
//                                                         }`}
//                                                 >
//                                                     <figure className='w-12 h-9 bg-gray-100 dark:bg-neutral-600 rounded border flex items-center justify-center shrink-0'>
//                                                         <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                                                             <path d="M2 13C5.333 11.5 7.5 9.5 7.5 7.5C7.5 5.5 6.5 5.5 5.5 5.5C4.5 5.5 3.5 6.25 3.53 7.5C3.56 8.82 4.74 9.36 5.25 10.5C6.25 12 6.75 12.5 7.5 11.5C8.17 10.5 8.67 9.67 9 9C9.75 11.5 11 12.5 12.5 12.5H14.5M14.5 12.5L12.5 10V1.5C12.5 0.948 12.948 0.5 13.5 0.5C14.052 0.5 14.5 0.948 14.5 1.5V10L14.5 12.5ZM12.5 3.5H14.5"
//                                                                 stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
//                                                                 className='dark:stroke-white'
//                                                             />
//                                                         </svg>
//                                                     </figure>
//                                                     <div className='flex-1 min-w-0'>
//                                                         <h3 className='text-sm font-medium text-neutral-600 dark:text-white truncate'>
//                                                             {signature.name}
//                                                         </h3>
//                                                         <p className='text-xs text-neutral-400 dark:text-neutral-300'>
//                                                             {signature.type === 'draw' ? 'Drawn' : signature.type === 'type' ? 'Typed' : 'Uploaded'}
//                                                         </p>
//                                                     </div>
//                                                     {selectedSignature?._id === signature._id && (
//                                                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                                             <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="#4C3CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                                         </svg>
//                                                     )}
//                                                 </article>
//                                             ))
//                                         ) : (
//                                             <div className='flex flex-col items-center gap-3 py-8'>
//                                                 <p className='text-sm text-neutral-400 dark:text-neutral-300 text-center'>
//                                                     No signatures found
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </section>
//                             </div>
//                         )}
//                     </main>

//                     <footer className="flex-shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
//                         <button
//                             onClick={handleClose}
//                             disabled={isProcessing}
//                             type="button"
//                             className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleApplySignature}
//                             disabled={!selectedPdf || !selectedSignature || isProcessing}
//                             type="button"
//                             className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-6 rounded-lg border border-primary-500 bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
//                         >
//                             Apply Signature
//                         </button>
//                     </footer>
//                 </article>
//             </BaseModal>

//             <SignatureProcessingModal
//                 isOpen={isProcessing}
//                 progress={processingProgress}
//                 currentStep={processingStep}
//             />
//         </>
//     );
// };

// export default SignYourselfModal;

"use client";
import React, { useState } from 'react';
import BaseModal from '@/components/layouts/Modal/BaseModal';
import useModalStore from '@/store/ui/modalStore';
import useSignatures from '@/hooks/signatures/useSignatures';
import { useFiles } from '@/hooks/files/filesManagement/useFiles';
import { CloseIcon } from '@/components/ui/icons';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import SignatureProcessingModal from '@/components/modules/Modals/SignatureProcessingModal/SignatureProcessingModal';

// Outer component - only renders inner when modal is open
const SignYourselfModal = () => {
    const { modals, closeModal } = useModalStore();
    const { isOpen } = modals.signYourself;

    // Prevent unnecessary API calls when modal is closed
    if (!isOpen) return null;

    return <SignYourselfModalInner closeModal={closeModal} />;
};

// Inner component - hooks only run when modal is open
const SignYourselfModalInner = ({ closeModal }) => {
    const { signatures, isLoading: signaturesLoading } = useSignatures();
    const { files: allFiles, isLoading: filesLoading } = useFiles();

    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingStep, setProcessingStep] = useState('');

    const pdfFiles = allFiles.filter(file => file.mimeType === 'application/pdf' && !file.isDeleted);
    const isLoading = filesLoading || signaturesLoading;

    const handleClose = () => {
        closeModal('signYourself');
        setSelectedPdf(null);
        setSelectedSignature(null);
        setIsProcessing(false);
        setProcessingProgress(0);
    };

    const handleApplySignature = async () => {
        if (!selectedPdf || !selectedSignature) {
            showErrorToast('Please select both PDF and signature');
            return;
        }

        setIsProcessing(true);
        setProcessingProgress(0);

        try {
            setProcessingStep('Loading PDF...');
            setProcessingProgress(20);
            await new Promise(resolve => setTimeout(resolve, 500));

            setProcessingStep('Preparing signature...');
            setProcessingProgress(40);
            await new Promise(resolve => setTimeout(resolve, 500));

            setProcessingStep('Applying signature...');
            setProcessingProgress(60);

            const response = await fetch('/api/signatures/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

            setProcessingStep('Uploading document...');
            setProcessingProgress(80);
            await new Promise(resolve => setTimeout(resolve, 500));

            setProcessingStep('Finalizing...');
            setProcessingProgress(100);
            await new Promise(resolve => setTimeout(resolve, 500));

            showSuccessToast('Signature applied! New file: ' + data.file.name);
            handleClose();
            window.location.reload();
        } catch (error) {
            console.error('Error applying signature:', error);
            showErrorToast(error.message || 'Failed to apply signature');
            setIsProcessing(false);
            setProcessingProgress(0);
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
                        {isLoading ? (
                            <div className='flex justify-center py-12'>
                                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                                {/* PDF list */}
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
                                        {pdfFiles.length > 0 ? (
                                            pdfFiles.map((pdf) => (
                                                <article
                                                    key={pdf.id}
                                                    onClick={() => setSelectedPdf(pdf)}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        selectedPdf?.id === pdf.id
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
                                                <p className='text-sm text-neutral-400 dark:text-neutral-300 text-center'>
                                                    No PDF files found
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Signature list */}
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
                                        {signatures.length > 0 ? (
                                            signatures.map((signature) => (
                                                <article
                                                    key={signature._id}
                                                    onClick={() => setSelectedSignature(signature)}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                        selectedSignature?._id === signature._id
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
                                                <p className='text-sm text-neutral-400 dark:text-neutral-300 text-center'>
                                                    No signatures found
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </main>

                    <footer className="flex-shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
                        <button
                            onClick={handleClose}
                            disabled={isProcessing}
                            type="button"
                            className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-4 rounded-lg border border-stroke-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApplySignature}
                            disabled={!selectedPdf || !selectedSignature || isProcessing}
                            type="button"
                            className='w-full sm:w-auto flex items-center justify-center gap-2 h-9 sm:h-10 py-2 px-6 rounded-lg border border-primary-500 bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            Apply Signature
                        </button>
                    </footer>
                </article>
            </BaseModal>

            <SignatureProcessingModal
                isOpen={isProcessing}
                progress={processingProgress}
                currentStep={processingStep}
            />
        </>
    );
};

export default SignYourselfModal;