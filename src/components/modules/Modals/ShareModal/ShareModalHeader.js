import { CloseIcon } from '@/components/ui/icons';

const ShareModalHeader = ({ onClose, isLoading }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <h2 className="text-medium-18 dark:text-medium-18-white">Share folder "Design File"</h2>
            </div>
            <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export default ShareModalHeader;