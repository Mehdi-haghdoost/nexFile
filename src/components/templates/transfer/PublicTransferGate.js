import { PasswordIcon } from '@/components/ui/icons';

const PublicTransferGate = ({ password, onPasswordChange, onUnlock, isUnlocking, isLockedOut, error }) => {
    const isDisabled = isUnlocking || isLockedOut;

    return (
        <div className='flex flex-col gap-3 rounded-lg border border-stroke-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4'>
            <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]'>
                    <PasswordIcon />
                </div>
                <p className='text-sm font-medium text-neutral-500 dark:text-white'>
                    This transfer is password protected
                </p>
            </div>

            <input
                type='password'
                value={password}
                disabled={isLockedOut}
                autoFocus
                placeholder='Enter password'
                onChange={(event) => onPasswordChange(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && onUnlock()}
                className='w-full rounded-lg border border-stroke-300 dark:border-dark-border bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-500 dark:text-white outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
            />

            {error && <p className='text-xs text-error-400'>{error}</p>}

            <button
                type='button'
                onClick={onUnlock}
                disabled={isDisabled || !password.trim()}
                className='flex h-9 items-center justify-center gap-2 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] px-4 text-sm font-medium text-white shadow-light transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {isUnlocking && (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                )}
                {isUnlocking ? 'Unlocking...' : 'Unlock'}
            </button>
        </div>
    );
};

export default PublicTransferGate;