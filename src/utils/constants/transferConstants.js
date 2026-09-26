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

// Wrong passwords allowed per client before a transfer locks them out
export const TRANSFER_MAX_PASSWORD_ATTEMPTS = 5;

// How long that lockout lasts, in minutes
export const TRANSFER_LOCKOUT_MINUTES = 15;

// Largest single file a transfer accepts, matching the Cloudinary free tier
export const TRANSFER_MAX_FILE_BYTES = 100 * 1024 * 1024;

// Most stored files the NexFile picker lists at once
export const TRANSFER_SOURCE_LIMIT = 100;

// Most people a single transfer can be emailed to
export const TRANSFER_MAX_RECIPIENTS = 10;

// Longest personal note allowed in a transfer email
export const TRANSFER_MAX_MESSAGE_LENGTH = 500;

// Lifetime of a signed download URL, long enough to start a download and no longer
export const TRANSFER_DOWNLOAD_URL_TTL_SECONDS = 5 * 60;

// Query parameter the download route uses to explain why it sent the recipient back
export const TRANSFER_DOWNLOAD_ISSUE_PARAM = 'issue';

// Why a download was refused, keyed by that parameter's value
export const TRANSFER_DOWNLOAD_ISSUES = {
    LOCKED: 'locked',
    EXPIRED: 'expired',
    UNAVAILABLE: 'unavailable',
};

// What the public page tells the recipient for each reason
export const TRANSFER_DOWNLOAD_ISSUE_MESSAGES = {
    [TRANSFER_DOWNLOAD_ISSUES.LOCKED]: 'Your access expired. Enter the password again to download.',
    [TRANSFER_DOWNLOAD_ISSUES.EXPIRED]: 'This transfer is no longer available.',
    [TRANSFER_DOWNLOAD_ISSUES.UNAVAILABLE]: 'That file could not be found in this transfer.',
};

// Plain-language reasons for a failed transfer email, keyed by the mail error code
export const TRANSFER_DELIVERY_FAILURE_HINTS = {
    EAUTH: 'NexFile could not sign in to its mail server',
    NO_CREDENTIALS: 'Email sending is not configured',
    ETIMEDOUT: 'The mail server could not be reached',
    ECONNECTION: 'The mail server could not be reached',
    ESOCKET: 'The mail server could not be reached',
    EDNS: 'The mail server could not be reached',
    ETLS: 'A secure connection to the mail server failed',
    EENVELOPE: 'The address was rejected',
};

// Shown when a failure has no known code, including deliveries recorded before codes were kept
export const TRANSFER_DELIVERY_FAILURE_FALLBACK = 'The email could not be delivered';

// Delay before a search input triggers a refetch
export const TRANSFER_SEARCH_DEBOUNCE_MS = 300;

// Public download pages live outside the private /transfer section
export const TRANSFER_LINK_PATH = '/t';

// Cookie proving a recipient entered the correct transfer password
export const TRANSFER_ACCESS_COOKIE = 'transferAccess';

// How long an unlocked transfer stays unlocked, in seconds
export const TRANSFER_ACCESS_TTL_SECONDS = 60 * 60;