'use client';
import { useEffect } from 'react';
import useBillingStore from '@/store/features/billing/billingStore';

/** Loads billing data into the store on mount and exposes it to components. */
export const useBilling = () => {
  const billing = useBillingStore((state) => state.billing);
  const isAdmin = useBillingStore((state) => state.isAdmin);
  const isLoading = useBillingStore((state) => state.isLoading);
  const error = useBillingStore((state) => state.error);
  const fetchBilling = useBillingStore((state) => state.fetchBilling);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  return {
    billing,
    isAdmin,
    isLoading,
    error,
    refresh: () => fetchBilling({ force: true }),
  };
};

export default useBilling;