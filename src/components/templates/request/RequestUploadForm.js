'use client';

import { useState } from 'react';

const formatBytes = (bytes) => {
    if (!bytes) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// The limit the route enforces, repeated here so a file is rejected before upload
const MAX_FILE_BYTES = 100 * 1024 * 1024;

const RequestUploadForm = ({ onSubmit, isSubmitting }) => {
    const [submitterName, setSubmitterName] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const chosen = event.target.files?.[0] || null;

        if (chosen && chosen.size > MAX_FILE_BYTES) {
            setError('That file is larger than 100MB');
            setFile(null);
            return;
        }

        setError('');
        setFile(chosen);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!submitterName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!file) {
            setError('Please choose a file');
            return;
        }

        setError('');
        await onSubmit({ submitterName: submitterName.trim(), file });
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
                <label htmlFor='submitter-name' className='text-xs font-medium text-neutral-400 dark:text-neutral-300'>
                    Your name
                </label>
                <input
                    id='submitter-name'
                    type='text'
                    dir='auto'
                    value={submitterName}
                    maxLength={100}
                    disabled={isSubmitting}
                    onChange={(event) => setSubmitterName(event.target.value)}
                    placeholder='So they know who sent it'
                    className='h-10 w-full rounded-lg border border-stroke-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500 disabled:opacity-50'
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label htmlFor='submitter-file' className='text-xs font-medium text-neutral-400 dark:text-neutral-300'>
                    File
                </label>
                <input
                    id='submitter-file'
                    type='file'
                    disabled={isSubmitting}
                    onChange={handleFileChange}
                    className='w-full text-sm text-neutral-400 dark:text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-500 dark:file:bg-primary-bg dark:file:text-white disabled:opacity-50'
                />

                {file && (
                    <p dir='auto' className='text-xs text-neutral-300 dark:text-neutral-400 truncate'>
                        {file.name} · {formatBytes(file.size)}
                    </p>
                )}
            </div>

            {error && <p className='text-xs text-error-400'>{error}</p>}

            <button
                type='submit'
                disabled={isSubmitting}
                className='mt-1 flex h-10 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-sm font-medium text-white shadow-light transition-all hover:shadow-md active:scale-95 disabled:opacity-50'
            >
                {isSubmitting && (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                )}
                {isSubmitting ? 'Sending...' : 'Send file'}
            </button>

            <p className='text-center text-[11px] text-neutral-300 dark:text-neutral-400'>
                Up to 100MB. You do not need an account.
            </p>
        </form>
    );
};

export default RequestUploadForm;