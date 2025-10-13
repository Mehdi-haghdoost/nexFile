import { UsersPlusIcon } from '@/components/ui/icons';
import React from 'react';
import { PROGRESS_COLORS } from '@/utils/constants//Dashboardconstants';
import { getLicenseStatusMessage } from '@/utils/Licenseutils';

const LicenseCard = ({ used, total, available, onInviteClick }) => {
    // Calculate progress bars
    const progressBars = Array.from({ length: total }, (_, index) => index < used);

    return (
        <article className='flex flex-col rounded-lg bg-white border border-stroke-300 min-w-0'>
            {/* Licenses Info */}
            <div className='flex flex-col gap-5 p-4'>
                {/* Licenses Details */}
                <div className='flex flex-col gap-1'>
                    <h3 className='text-medium-16'>Licenses</h3>
                    <p className='text-regular-12'>
                        Utilizing {used} out of {total} licenses on your Business Trial
                    </p>
                </div>
                
                {/* Licenses Progress Bar */}
                <div className='flex items-center gap-2'>
                    {progressBars.map((isUsed, index) => (
                        <div
                            key={index}
                            className={`h-[10px] flex-1 rounded-[8px] ${
                                isUsed ? PROGRESS_COLORS.active : PROGRESS_COLORS.inactive
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Licenses Footer */}
            <footer className='flex flex-wrap justify-between items-center py-3 px-4 gap-2 border-t border-stroke-300'>
                <h4 className='text-regular-14-neutral-500'>
                    {getLicenseStatusMessage(available)}
                </h4>
                <button
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