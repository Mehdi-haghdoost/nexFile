// Sent and received are two different ownership queries, not a client-side filter
export const TRANSFER_TABS = [
    { id: 'sent', label: 'Sent' },
    { id: 'received', label: 'Received' },
];

// Status is derived from expirationDate rather than stored on the record
export const TRANSFER_STATUS_TABS = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'expired', label: 'Expired' },
];

export const TRANSFER_DEFAULT_EXPIRY_DAYS = 14;

// Whitelisted so a crafted request cannot set an arbitrary or absurd expiry
export const TRANSFER_EXPIRY_OPTIONS = [
    { days: 1, label: '1 day' },
    { days: 7, label: '7 days' },
    { days: 14, label: '14 days' },
    { days: 30, label: '30 days' },
];

export const TRANSFER_ALLOWED_EXPIRY_DAYS = TRANSFER_EXPIRY_OPTIONS.map((option) => option.days);

/**
 * Deliberately lower than the account password rules in utils/auth/validators.
 * A share password is a one-off secret read over the phone or in a chat, not a
 * credential guarding an account, and demanding symbols here only pushes people
 * into reusing something they already have.
 */
export const TRANSFER_MIN_PASSWORD_LENGTH = 6;

// Keeps the list from refetching on every keystroke in the search box
export const TRANSFER_SEARCH_DEBOUNCE_MS = 300;

// Public download links live outside /transfer so that segment stays private
// and remains free for an authenticated /transfer/[id] detail page
export const TRANSFER_LINK_PATH = '/t';