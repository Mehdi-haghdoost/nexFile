import React from 'react';
import { SignatureGlyphIcon, CheckIcon } from '@/components/ui/icons';

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
                    <SignatureGlyphIcon />
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
                    // The real artwork, so a blank or wrong signature shows before it is stamped
                    <img src={signature.cloudinaryUrl} alt="" className='max-w-full max-h-full object-contain' />
                ) : (
                    <SignatureGlyphIcon />
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
            {selectedId === signature._id && (
                <span className='w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0'>
                    <CheckIcon size={14} />
                </span>
            )}
        </button>
    ));
};

export default SignaturePickerList;