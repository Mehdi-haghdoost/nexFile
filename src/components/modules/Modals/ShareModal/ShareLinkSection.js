import { CopyIcon } from '@/components/ui/icons';

const ShareLinkSection = ({ shareLink, isLoading, handleCopyLink }) => {
    return (
        <div className='flex justify-center items-center min-h-[40px] sm:h-12 py-2 sm:py-3 px-3 sm:px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-800 dark:border-neutral-600'>
            <p className='truncate flex-1 text-xs sm:text-sm text-neutral-900 dark:text-white font-normal'>
                {shareLink}
            </p>
            <button
                type='button'
                onMouseDown={handleCopyLink}
                disabled={isLoading}
                className="disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 rounded transition-colors shrink-0"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
                ) : (
                    <CopyIcon />
                )}
            </button>
        </div>
    );
};

export default ShareLinkSection;