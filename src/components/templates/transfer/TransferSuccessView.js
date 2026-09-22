import { CopyLinkIcon } from '@/components/ui/icons';
import { copyTextToClipboard } from '@/utils/clipboard';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

const TransferSuccessView = ({ shareLink, delivery, onBack, onManage }) => {
  const sent = delivery?.sent || [];
  const failed = delivery?.failed || [];
  const wasEmailed = Boolean(delivery);

  const heading = !wasEmailed
    ? 'Your files are ready to share'
    : sent.length
      ? 'Your transfer has been sent'
      : 'Your transfer is ready, but no emails went out';

  // copyTextToClipboard returns false instead of throwing, so check before claiming success
  const handleCopyLink = async () => {
    const copied = await copyTextToClipboard(shareLink);

    if (copied) {
      showSuccessToast('Link copied to clipboard');
    } else {
      showErrorToast('Could not copy the link');
    }
  };

  return (
    <div className='flex flex-col gap-4 sm:gap-6 animate-in fade-in-0 slide-in-from-right-5 duration-300'>
      {/* Success message */}
      <div className='flex flex-col items-center gap-2 sm:gap-3 self-stretch'>
        <div className="flex w-10 h-10 sm:w-12 sm:h-12 justify-center items-center gap-2.5 rounded-full bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className='text-base sm:text-lg font-medium text-center text-neutral-500 dark:text-white px-4'>
          {heading}
        </h3>
      </div>

      {/* Exactly who was and was not reached, so no failure hides behind a generic sent */}
      {wasEmailed && (
        <div className='flex flex-col gap-1.5 rounded-lg border border-stroke-200 dark:border-dark-border bg-gray-50 dark:bg-neutral-800 p-3'>
          {sent.length > 0 && (
            <p className='text-xs text-neutral-500 dark:text-neutral-200'>
              Emailed to {sent.length === 1 ? sent[0] : `${sent.length} people`}
            </p>
          )}
          {failed.length > 0 && (
            <p className='text-xs text-error-400'>
              Could not reach {failed.join(', ')}. Share the link with them directly.
            </p>
          )}
        </div>
      )}

      {/* Share link */}
      <div className='flex flex-col gap-2 sm:gap-3 self-stretch'>
        <label className='text-xs sm:text-sm text-gray-900 dark:text-neutral-300'>
          Anyone with this link can open the transfer
        </label>
        <div className='flex items-center gap-2 p-2 sm:p-3 rounded-lg border border-stroke-200 bg-gray-50 dark:bg-dark-gradient dark:border-dark-border'>
          <input
            type="text"
            value={shareLink}
            readOnly
            className='flex-1 bg-transparent outline-none text-xs sm:text-sm text-gray-700 dark:text-neutral-300 min-w-0'
          />
          <button onClick={handleCopyLink} className='btn-icon-elegant shrink-0' aria-label='Copy link'>
            <CopyLinkIcon />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 self-stretch mt-1 sm:mt-2'>
        <button onClick={onManage} className='btn-base flex-1 px-4 sm:px-6 h-9 sm:h-10'>
          <span className='relative z-10 text-xs sm:text-sm font-medium text-neutral-600 dark:text-white'>
            Manage transfer
          </span>
        </button>

        <button onClick={handleCopyLink} className='btn-base flex-1 gap-1.5 sm:gap-2 h-9 sm:h-10'>
          <CopyLinkIcon />
          <span className='relative z-10 text-xs sm:text-sm font-medium text-neutral-600 dark:text-white'>
            Copy link
          </span>
        </button>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className='text-xs sm:text-sm text-primary-500 hover:underline self-center mt-1 sm:mt-2 transition-colors'
        >
          Back to upload
        </button>
      )}
    </div>
  );
};

export default TransferSuccessView;