import { BackArrowIcon, CloseIcon } from '@/components/ui/icons';

const ReviewHeader = ({ setView, handleClose, fileName, fileType = 'folder' }) => {
    return (
        <div className="flex items-center justify-between gap-2 self-stretch mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <button 
                    onClick={() => setView('main')} 
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
                >
                    <BackArrowIcon />
                </button>
                <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white truncate">
                    Share {fileType} "{fileName}"
                </h2>
            </div>
            <button 
                onClick={handleClose} 
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export default ReviewHeader;