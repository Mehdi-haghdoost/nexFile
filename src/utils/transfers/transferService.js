import { TRANSFER_LINK_PATH } from '@/utils/constants/transferConstants';

// Escapes user input before it goes into a regex so a stray bracket cannot throw
const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Status is computed on read so an expiring transfer never needs a background job
export const getTransferStatus = (expirationDate) => {
    if (!expirationDate) return 'active';
    return new Date(expirationDate).getTime() < Date.now() ? 'expired' : 'active';
};

export const buildShareLink = (token, origin = '') => (
    token ? `${origin}${TRANSFER_LINK_PATH}/${token}` : ''
);

// Builds the mongo query for the list route from the tab, status and search filters
export const buildTransferQuery = ({ userId, userEmail, tab, status, search }) => {
    const query = { isDeleted: false };

    if (tab === 'received') {
        query['recipients.email'] = userEmail;
    } else {
        query.owner = userId;
    }

    const now = new Date();
    if (status === 'active') {
        query.expirationDate = { $gt: now };
    } else if (status === 'expired') {
        query.expirationDate = { $lte: now };
    }

    if (search) {
        query.groupName = { $regex: escapeRegex(search), $options: 'i' };
    }

    return query;
};

// Shapes a document into exactly what TransfersTable reads, nothing more
export const serializeTransfer = (transfer, origin = '') => ({
    id: transfer._id.toString(),
    groupName: transfer.groupName,
    type: transfer.type,
    filesCount: transfer.filesCount,
    totalSize: transfer.totalSize,
    createdAt: transfer.createdAt,
    expirationDate: transfer.expirationDate,
    downloadCount: transfer.downloadCount,
    viewCount: transfer.viewCount,
    status: getTransferStatus(transfer.expirationDate),
    link: buildShareLink(transfer.token, origin),
    isPasswordEnabled: transfer.isPasswordEnabled,
    files: (transfer.files || []).map((file) => ({
        name: file.name,
        extension: file.extension,
        size: file.size,
    })),
});