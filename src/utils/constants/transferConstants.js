// Sent and received are separate ownership queries on the server
export const TRANSFER_TABS = [
    { id: 'sent', label: 'Sent' },
    { id: 'received', label: 'Received' },
];

// Status is derived from expirationDate at read time
export const TRANSFER_STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expired', label: 'Expired' },
];

export const TRANSFER_DEFAULT_EXPIRY_DAYS = 14;

// Whitelisted expiry choices the create and extend routes accept
export const TRANSFER_EXPIRY_OPTIONS = [
    { days: 1, label: '1 day' },
    { days: 7, label: '7 days' },
    { days: 14, label: '14 days' },
    { days: 30, label: '30 days' },
];

export const TRANSFER_ALLOWED_EXPIRY_DAYS = TRANSFER_EXPIRY_OPTIONS.map((option) => option.days);

// Share passwords are one-off secrets, so the bar is lower than for account passwords
export const TRANSFER_MIN_PASSWORD_LENGTH = 6;

// Largest single file a transfer accepts, matching the Cloudinary free tier
export const TRANSFER_MAX_FILE_BYTES = 100 * 1024 * 1024;

// Most stored files the NexFile picker lists at once
export const TRANSFER_SOURCE_LIMIT = 100;

// Most people a single transfer can be emailed to
export const TRANSFER_MAX_RECIPIENTS = 10;

// Longest personal note allowed in a transfer email
export const TRANSFER_MAX_MESSAGE_LENGTH = 500;

// Delay before a search input triggers a refetch
export const TRANSFER_SEARCH_DEBOUNCE_MS = 300;

// Public download pages live outside the private /transfer section
export const TRANSFER_LINK_PATH = '/t';

// Cookie proving a recipient entered the correct transfer password
export const TRANSFER_ACCESS_COOKIE = 'transferAccess';

// How long an unlocked transfer stays unlocked, in seconds
export const TRANSFER_ACCESS_TTL_SECONDS = 60 * 60;