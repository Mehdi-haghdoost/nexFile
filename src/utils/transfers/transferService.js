import { TRANSFER_LINK_PATH } from '@/utils/constants/transferConstants';

// Escapes user input so it can be used safely inside a regex
export const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Returns active or expired, treating the exact expiry moment as expired like every route does
export const getTransferStatus = (expirationDate) => {
    if (!expirationDate) return 'active';
    return new Date(expirationDate).getTime() <= Date.now() ? 'expired' : 'active';
};

export const buildShareLink = (token, origin = '') => (
    token ? `${origin}${TRANSFER_LINK_PATH}/${token}` : ''
);

// Builds the list query from the tab, status and search filters
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

// Checks an asset sits in this user's transfer folder and its URL points at that asset
export const isOwnedTransferAsset = (file, userId) => {
    if (!file?.cloudinaryId || !file?.url || !userId) return false;

    const folderPrefix = `nexfile/transfers/${userId}/`;
    const deliveryPrefix = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`;

    let decodedUrl;
    try {
        decodedUrl = decodeURIComponent(file.url);
    } catch {
        return false;
    }

    return (
        file.cloudinaryId.startsWith(folderPrefix) &&
        file.url.startsWith(deliveryPrefix) &&
        decodedUrl.includes(file.cloudinaryId)
    );
};

// Shapes a transfer into the fields the sender's pages read
export const serializeTransfer = (transfer, origin = '') => ({
    id: transfer._id.toString(),
    groupName: transfer.groupName,
    type: transfer.type,
    filesCount: transfer.filesCount,
    totalSize: transfer.totalSize,
    createdAt: transfer.createdAt,
    expirationDate: transfer.expirationDate,
    endedAt: transfer.endedAt || null,
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