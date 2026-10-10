import React from 'react';

const SignatureIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 13C5.333 11.5 7.5 9.5 7.5 7.5C7.5 5.5 6.5 5.5 5.5 5.5C4.5 5.5 3.5 6.25 3.53 7.5C3.56 8.82 4.74 9.36 5.25 10.5C6.25 12 6.75 12.5 7.5 11.5C8.17 10.5 8.67 9.67 9 9C9.75 11.5 11 12.5 12.5 12.5H14.5M14.5 12.5L12.5 10V1.5C12.5 0.948 12.948 0.5 13.5 0.5C14.052 0.5 14.5 0.948 14.5 1.5V10L14.5 12.5ZM12.5 3.5H14.5"
            stroke="#6B7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className='dark:stroke-white' />
    </svg>
);

const SelectedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <path d="M16.667 5L7.50033 14.1667L3.33366 10" stroke="#4C3CC6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TYPE_LABELS = { draw: 'Drawn', type: 'Typed', upload: 'Uploaded' };

const SignaturePickerList = ({ signatures, isLoading, selectedId, onSelect }) => {
    if (isLoading) {
        return (
            <div className='flex justify-center py-8'>
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (signatures.length === 0) {
        return (
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
        );
    }

    return signatures.map((signature) => (
        <button
            key={signature._id}
            type="button"
            onClick={() => onSelect(signature)}
            className={`flex w-full items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedId === signature._id
                    ? 'border-primary-500 bg-primary-50 dark:bg-neutral-700'
                    : 'border-stroke-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
        >
            <figure className='w-12 h-9 bg-gray-100 dark:bg-neutral-600 rounded border flex items-center justify-center shrink-0'>
                {signature.cloudinaryUrl ? (
                    // The real artwork, so a blank or wrong signature is visible before it is stamped
                    <img src={signature.cloudinaryUrl} alt="" className='max-w-full max-h-full object-contain' />
                ) : (
                    <SignatureIcon />
                )}
            </figure>
            <div className='flex-1 min-w-0'>
                <h3 dir='auto' className='text-sm font-medium text-neutral-600 dark:text-white truncate'>
                    {signature.name}
                </h3>
                <p className='text-xs text-neutral-400 dark:text-neutral-300'>
                    {TYPE_LABELS[signature.type] || signature.type}
                    {signature.isDefault ? ' · Default' : ''}
                </p>
            </div>
            {selectedId === signature._id && <SelectedIcon />}
        </button>
    ));
};

export default SignaturePickerList;