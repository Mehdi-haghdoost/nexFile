'use client';

import { useEffect, useRef, useState } from 'react';
import { PasswordIcon } from '@/components/ui/icons';

const RequestPasswordGate = ({ onUnlock, isUnlocking, error }) => {
    const [password, setPassword] = useState('');
    const inputRef = useRef(null);

    // Entering the password is the only thing to do on the page at this point
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password.trim()) onUnlock(password);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4'>
            <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]'>
                    <PasswordIcon />
                </div>
                <p className='text-sm font-medium text-neutral-500 dark:text-white'>
                    This request needs a password
                </p>
            </div>

            <input
                ref={inputRef}
                type='password'
                value={password}
                disabled={isUnlocking}
                placeholder='Enter password'
                onChange={(event) => setPassword(event.target.value)}
                className='w-full rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500 disabled:opacity-50'
            />

            {error && <p className='text-xs text-error-400'>{error}</p>}

            <button
                type='submit'
                disabled={isUnlocking || !password.trim()}
                className='flex h-9 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] px-4 text-sm font-medium text-white shadow-light transition-all hover:shadow-md active:scale-95 disabled:opacity-50'
            >
                {isUnlocking && (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                )}
                {isUnlocking ? 'Checking...' : 'Unlock'}
            </button>

            <p className='text-xs text-neutral-300 dark:text-neutral-400'>
                Whoever sent you this link will have shared the password separately.
            </p>
        </form>
    );
};

export default RequestPasswordGate;