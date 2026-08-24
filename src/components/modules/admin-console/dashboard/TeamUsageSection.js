import React from 'react';
import LicenseCard from '@/components/modules/admin-console/dashboard/LicenseCard';
import StorageCard from '@/components/modules/admin-console/dashboard/StorageCard';

const TeamUsageSection = ({ usage, planName, isLoading, onInviteClick, onManageStorageClick }) => {
    return (
        <section className='flex flex-col gap-4 w-full max-w-full'>
            <h2 className='text-medium-18 dark:text-medium-18-white'>Team usage</h2>

            {isLoading ? (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
                    {[0, 1].map((index) => (
                        <div
                            key={index}
                            className='h-[168px] rounded-lg border border-stroke-300 bg-gray-100 animate-pulse dark:border-neutral-700 dark:bg-neutral-800'
                        />
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
                    <LicenseCard
                        used={usage?.seatsUsed}
                        total={usage?.seatLimit}
                        available={Math.max((usage?.seatLimit || 0) - (usage?.seatsUsed || 0), 0)}
                        planName={planName}
                        onInviteClick={onInviteClick}
                    />
                    <StorageCard
                        usedBytes={usage?.storageUsedBytes}
                        totalGB={usage?.storageQuotaGB}
                        onManageClick={onManageStorageClick}
                    />
                </div>
            )}
        </section>
    );
};

export default TeamUsageSection;