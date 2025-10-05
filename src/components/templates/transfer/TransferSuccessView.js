import { CopyLinkIcon } from '@/components/ui/icons';

const TransferSuccessView = ({ shareLink, onBack, onManage, onSendEmail }) => {  // ✅ اضافه کردن onSendEmail
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className='flex flex-col gap-6 animate-in fade-in-0 slide-in-from-right-5 duration-300'>
      {/* Success Message */}
      <div className='flex flex-col items-center gap-3 self-stretch'>
        <div className="flex w-12 h-12 justify-center items-center gap-2.5 rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className='text-medium-18 text-center'>Your files are prepared for sending</h3>
      </div>

      {/* Share Link Section */}
      <div className='flex flex-col gap-3 self-stretch'>
        <label className='text-medium-14 text-gray-900'>
          Send your transfer via email or a shareable link
        </label>
        <div className='flex items-center gap-2 p-3 rounded-lg border border-stroke-200 bg-gray-50'>
          <input
            type="text"
            value={shareLink}
            readOnly
            className='flex-1 bg-transparent outline-none text-regular-14 text-gray-700'
          />
          <button
            onClick={handleCopyLink}
            className='flex justify-center items-center w-8 h-8 rounded hover:bg-gray-200 transition-colors'
          >
            <CopyLinkIcon />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col gap-3 self-stretch mt-2'>
        <button
          onClick={onManage}
          className='flex justify-center items-center h-10 py-3 px-6 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'
        >
          Manage transfer
        </button>

        <div className='flex gap-3'>
          <button
            onClick={handleCopyLink}
            className='flex-1 flex justify-center items-center gap-2 h-10 py-3 px-4 rounded-lg border border-stroke-300 bg-white shadow-light text-medium-14 transition-all duration-200 hover:shadow-md active:scale-95'
          >
            <CopyLinkIcon />
            Copy link
          </button>

          <button
            onClick={onSendEmail}  // ✅ استفاده از prop به جای handleSendEmail محلی
            className='flex-1 flex justify-center items-center h-10 py-3 px-4 rounded-lg border border-[#5749BF] bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] shadow-light text-medium-14-white transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'
          >
            Send email
          </button>
        </div>
      </div>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className='text-regular-14 text-primary-500 hover:underline self-center mt-2'
        >
          Back to upload
        </button>
      )}
    </div>
  );
};

export default TransferSuccessView;