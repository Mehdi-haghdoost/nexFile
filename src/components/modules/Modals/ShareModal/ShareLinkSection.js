import { CopyIcon } from '@/components/ui/icons';

const ShareLinkSection = ({ shareLink, isLoading, handleCopyLink }) => {
    return (
        <div className='flex justify-center items-center h-12 py-3 px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white'>
            <p className='truncate flex-1 text-regular-14-manrope'>
                {shareLink}
            </p>
            <button
                type='button'
                onMouseDown={handleCopyLink}
                disabled={isLoading}
                className="disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 p-1 rounded"
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