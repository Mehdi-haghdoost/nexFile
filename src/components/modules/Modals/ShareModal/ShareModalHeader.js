import { CloseIcon } from '@/components/ui/icons';

const ShareModalHeader = ({ onClose, isLoading, fileName, fileType = 'folder' }) => {
    return (
        <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate">
                    Share {fileType} "{fileName}"
                </h2>
            </div>
            <button
                onClick={onClose}
                disabled={isLoading}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export default ShareModalHeader;