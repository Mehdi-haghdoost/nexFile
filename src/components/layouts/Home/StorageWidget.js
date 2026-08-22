'use client';
import { useEffect } from 'react';
import styles from './sidebar.module.css';
import useBillingStore from '@/store/features/billing/billingStore';
import { formatBytes } from '@/utils/Storageutils';
import {
  StorageDividerIcon,
  StorageProgressBar,
  UpgradeBoltIcon,
  STORAGE_PROGRESS_WIDTH,
} from '@/components/ui/icons';

const StorageWidget = ({ onUpgradeClick }) => {
  const billing = useBillingStore((state) => state.billing);
  const fetchBilling = useBillingStore((state) => state.fetchBilling);

  // Only fetch when the store is empty; the billing panel may have loaded it
  useEffect(() => {
    if (!billing) fetchBilling();
  }, [billing, fetchBilling]);

  const usage = billing?.usage;
  const percentage = usage?.storageQuotaBytes
    ? Math.min((usage.storageUsedBytes / usage.storageQuotaBytes) * 100, 100)
    : 0;

  return (
    <div className="relative">
      <div className="absolute -top-1 left-0 right-0">
        <StorageDividerIcon />
      </div>

      <div className='flex flex-col justify-center items-center gap-3 self-stretch p-4 rounded-lg border border-stroke-500 bg-white shadow-custom dark:rounded-lg dark:border dark:border-white/0 dark:bg-[#1E1E23] dark:shadow-dark-storage'>
        <div className='flex justify-between items-center self-stretch'>
          <h3 className='text-semibold-14 text-center dark:text-medium-14-white'>Available Storage</h3>
          <h3 className='text-semibold-14 text-center dark:text-semibold-14-white'>{Math.round(percentage)}%</h3>
        </div>

        <div className='flex flex-col items-start gap-2 self-stretch'>
          <StorageProgressBar filledWidth={(percentage / 100) * STORAGE_PROGRESS_WIDTH} />

          <div className='flex justify-center items-start gap-0.5 self-stretch'>
            <div className='flex items-center gap-0.25 flex-1'>
              <h3 className='text-medium-12 text-center dark:text-medium-12-white'>
                {formatBytes(usage?.storageUsedBytes || 0)} used
              </h3>
              <h3 className='text-regular-12-neutral-400 text-center dark:text-regular-12-neutral-200'>
                of {usage?.storageQuotaGB ?? 0}GB
              </h3>
            </div>
            <h3 className='text-regular-12-neutral-500 dark:text-regular-12-white'>See details</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onUpgradeClick}
          className={`${styles.navbar_btn} border dark:!border-transparent dark:!bg-gradient-to-b dark:!from-[#4C3CC6] dark:!to-[#7E60F8]`}
        >
          <UpgradeBoltIcon />
          <span className='text-medium-14-white text-center'>Upgrade Plan</span>
        </button>
      </div>
    </div>
  );
};

export default StorageWidget;