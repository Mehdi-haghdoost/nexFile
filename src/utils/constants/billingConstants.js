export const BILLING_TABS = [
    { id: 'manage-plan', label: 'Manage plan' },
    { id: 'information', label: 'Information' }
];

// Amounts are in cents so tax and totals stay integer-safe.
export const PLANS = {
    Free: {
        id: 'Free',
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        seatLimit: 2,
        storageQuotaGB: 5
    },
    Starter: {
        id: 'Starter',
        name: 'Starter',
        priceMonthly: 1900,
        priceYearly: 19000,
        seatLimit: 5,
        storageQuotaGB: 50
    },
    Business: {
        id: 'Business',
        name: 'Business',
        priceMonthly: 5900,
        priceYearly: 59000,
        seatLimit: 25,
        storageQuotaGB: 100
    },
    Enterprise: {
        id: 'Enterprise',
        name: 'Enterprise',
        priceMonthly: 12900,
        priceYearly: 129000,
        seatLimit: 100,
        storageQuotaGB: 1024
    }
};

export const PLAN_IDS = Object.keys(PLANS);

export const DEFAULT_PLAN_ID = 'Free';

export const BILLING_CYCLES = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

export const BILLING_STATUS = {
    TRIALING: 'trialing',
    ACTIVE: 'active'
};

// Basis points avoid a float rate: 1000 = 10%.
export const TAX_RATE_BPS = 1000;

export const CURRENCY = 'USD';

export const TRIAL_DAYS = 14;