import React from 'react';
import LicenseCard from '@/components/modules/admin-console/dashboard/LicenseCard';
import StorageCard from '@/components/modules/admin-console/dashboard/StorageCard';

const TeamUsageSection = ({ licenseData, storageData, onInviteClick, onManageStorageClick }) => {
    return (
        <section className='flex flex-col gap-4 w-full max-w-full '>
            <h2 className='text-medium-18 dark:text-medium-18-white'>Team usage</h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
                <LicenseCard
                    used={licenseData.used}
                    total={licenseData.total}
                    available={licenseData.available}
                    onInviteClick={onInviteClick}
                />
                <StorageCard
                    usedBytes={storageData.usedBytes}
                    totalGB={storageData.totalGB}
                    onManageClick={onManageStorageClick}
                />
            </div>
        </section>
    );
};

export default TeamUsageSection;