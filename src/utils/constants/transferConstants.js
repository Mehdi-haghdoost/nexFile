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

// Keeps the list from refetching on every keystroke in the search box
export const TRANSFER_SEARCH_DEBOUNCE_MS = 300;

// Path the share token is appended to when building a public link
export const TRANSFER_LINK_PATH = '/transfer';