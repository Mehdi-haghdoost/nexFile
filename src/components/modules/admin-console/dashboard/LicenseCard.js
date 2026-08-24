import React from 'react';
import { UsersPlusIcon } from '@/components/ui/icons';
import { PROGRESS_COLORS, MAX_LICENSE_SEGMENTS } from '@/utils/constants/Dashboardconstants';
import { getLicenseStatusMessage, calculateLicensePercentage } from '@/utils/Licenseutils';

const LicenseCard = ({ used = 0, total = 0, available = 0, planName = 'plan', onInviteClick }) => {
    // Larger plans get a single bar; one segment per seat would be unreadable
    const useSegments = total > 0 && total <= MAX_LICENSE_SEGMENTS;
    const percentage = calculateLicensePercentage(used, total);

    return (
        <article className='flex flex-col rounded-lg bg-white border border-stroke-300 min-w-0 dark:bg-neutral-900 dark:border-neutral-700'>
            <div className='flex flex-col gap-5 p-4'>
                <div className='flex flex-col gap-1'>
                    <h3 className='text-medium-16 dark:text-medium-16-white'>Licenses</h3>
                    <p className='text-regular-12 dark:text-regular-12-neutral-300'>
                        Utilizing {used} out of {total} licenses on your {planName}
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    {useSegments ? (
                        Array.from({ length: total }, (_, index) => (
                            <div
                                key={index}
                                className={`h-[10px] flex-1 rounded-[8px] dark:bg-neutral-500 ${
                                    index < used ? PROGRESS_COLORS.active : PROGRESS_COLORS.inactive
                                }`}
                            />
                        ))
                    ) : (
                        <div className='h-[10px] flex-1 rounded-[8px] bg-[#EDECF9] relative overflow-hidden dark:bg-neutral-500'>
                            {percentage > 0 && (
                                <div
                                    className={`absolute top-0 left-0 h-full ${PROGRESS_COLORS.active}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <footer className='flex flex-wrap justify-between items-center py-3 px-4 gap-2 border-t border-stroke-300 dark:border-neutral-700'>
                <h4 className='text-regular-14-neutral-500 dark:text-regular-14-white'>
                    {getLicenseStatusMessage(available)}
                </h4>
                <button
                    type='button'
                    onClick={onInviteClick}
                    className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-medium-14-white text-sm whitespace-nowrap hover:opacity-90 transition-opacity'
                >
                    <UsersPlusIcon />
                    Invite members
                </button>
            </footer>
        </article>
    );
};

export default LicenseCard;