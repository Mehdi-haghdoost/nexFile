import { CURRENCY } from '@/utils/constants/billingConstants';

/** Cents to a display string, e.g. 5900 -> "$59.00". */
export const formatCurrency = (cents = 0, currency = CURRENCY) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format((cents || 0) / 100);
};

/** Basis points to a percentage label, e.g. 1000 -> "10%". */
export const formatTaxRate = (bps = 0) => `${bps / 100}%`;

export const formatBillingDate = (value) => {
    if (!value) return null;
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/** Whole days left, floored at zero. */
export const daysUntil = (value) => {
    if (!value) return 0;
    const diff = new Date(value).getTime() - Date.now();
    return Math.max(Math.ceil(diff / (24 * 60 * 60 * 1000)), 0);
};