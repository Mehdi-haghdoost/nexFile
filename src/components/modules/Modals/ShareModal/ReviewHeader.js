import { BackArrowIcon, CloseIcon } from '@/components/ui/icons';

const ReviewHeader = ({ setView, handleClose }) => {
    return (
        <div className="flex items-center justify-between gap-2 self-stretch mb-6">
            <div className="flex items-center gap-3">
                <button onClick={() => setView('main')} className="p-1 rounded-full hover:bg-gray-100">
                    <BackArrowIcon />
                </button>
                <h2 className="text-medium-18 ">Share folder "Design File"</h2>
            </div>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
                <CloseIcon />
            </button>
        </div>
    );
};

export default ReviewHeader;