// Formats a date as "Sep 14, 2026"
export const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

// Formats a date as "Sep 14"
export const formatDateShort = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });