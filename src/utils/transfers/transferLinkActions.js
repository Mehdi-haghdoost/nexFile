import { copyTextToClipboard } from '@/utils/clipboard';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

// Copies a transfer's share link and reports the result
export const copyTransferLink = async (transfer) => {
    if (!transfer?.link) {
        showErrorToast('This transfer has no share link');
        return false;
    }

    const copied = await copyTextToClipboard(transfer.link);

    if (copied) {
        showSuccessToast('Link copied to clipboard');
    } else {
        showErrorToast('Could not copy the link');
    }

    return copied;
};

// Opens the recipient's view of a transfer in a new tab
export const openTransferLink = (transfer) => {
    if (!transfer?.link) {
        showErrorToast('This transfer has no share link');
        return;
    }

    window.open(transfer.link, '_blank', 'noopener,noreferrer');
};