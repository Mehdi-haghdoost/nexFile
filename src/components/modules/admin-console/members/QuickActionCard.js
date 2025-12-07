import { LicensesIcon, SettingIcon } from '@/components/ui/icons';

const ICON_MAP = {
    LicensesIcon: LicensesIcon,
    SettingIcon: SettingIcon
};

const QuickActionCard = ({ icon, label }) => {
    const IconComponent = ICON_MAP[icon];
    
    return (
        <article className='flex flex-col items-start gap-2 p-3 w-full sm:w-[156px] md:w-[156.833px] rounded-lg border border-stroke-500 bg-white dark:bg-neutral-900 dark:border-neutral-600 dark:shadow-dark-panel hover:border-stroke-700 hover:shadow-lg active:scale-95 transition-all cursor-pointer'>
            {IconComponent && <IconComponent className="flex-shrink-0" />}
            <h3 className='text-xs sm:text-sm text-neutral-500 dark:text-white'>{label}</h3>
        </article>
    );
};

export default QuickActionCard;