const DAY_MS = 24 * 60 * 60 * 1000;

// How close to expiry a transfer has to be before it is worth mentioning
const EXPIRING_SOON_DAYS = 2;

// Most notices returned, since this feed is a prompt rather than an archive
const NOTICE_LIMIT = 20;

export const TRANSFER_NOTICE_TYPES = {
    DOWNLOADED: 'downloaded',
    DELIVERY_FAILED: 'delivery-failed',
    EXPIRING: 'expiring',
    PURGED: 'purged',
};

// Derives a sender's feed from transfer state, so no event needs recording separately
export const buildTransferNotices = (transfers) => {
    const now = Date.now();
    const notices = [];

    for (const transfer of transfers) {
        const id = transfer._id.toString();
        const name = transfer.groupName;

        if (transfer.firstDownloadedAt) {
            notices.push({
                id: `${TRANSFER_NOTICE_TYPES.DOWNLOADED}-${id}`,
                type: TRANSFER_NOTICE_TYPES.DOWNLOADED,
                transferId: id,
                title: 'Your transfer was downloaded',
                detail: name,
                at: transfer.firstDownloadedAt,
            });
        }

        const failed = (transfer.recipients || []).filter((r) => r.status === 'failed');

        if (failed.length) {
            notices.push({
                id: `${TRANSFER_NOTICE_TYPES.DELIVERY_FAILED}-${id}`,
                type: TRANSFER_NOTICE_TYPES.DELIVERY_FAILED,
                transferId: id,
                title: failed.length === 1
                    ? `Could not email ${failed[0].email}`
                    : `Could not email ${failed.length} recipients`,
                detail: name,
                at: transfer.createdAt,
            });
        }

        if (transfer.filesPurgedAt) {
            notices.push({
                id: `${TRANSFER_NOTICE_TYPES.PURGED}-${id}`,
                type: TRANSFER_NOTICE_TYPES.PURGED,
                transferId: id,
                title: 'Files removed after expiry',
                detail: name,
                at: transfer.filesPurgedAt,
            });
            continue;
        }

        // Only worth raising while there is still time to extend it
        const remaining = new Date(transfer.expirationDate).getTime() - now;

        if (remaining > 0 && remaining <= EXPIRING_SOON_DAYS * DAY_MS) {
            notices.push({
                id: `${TRANSFER_NOTICE_TYPES.EXPIRING}-${id}`,
                type: TRANSFER_NOTICE_TYPES.EXPIRING,
                transferId: id,
                title: 'Expiring soon',
                detail: name,
                at: new Date(new Date(transfer.expirationDate).getTime() - EXPIRING_SOON_DAYS * DAY_MS),
            });
        }
    }

    return notices
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .slice(0, NOTICE_LIMIT);
};