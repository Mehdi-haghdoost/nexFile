import { LicensesIcon, SettingIcon } from '@/components/ui/icons';

const ICON_MAP = {
    LicensesIcon: LicensesIcon,
    SettingIcon: SettingIcon
};

const QuickActionCard = ({ icon, label }) => {
    const IconComponent = ICON_MAP[icon];
    
    return (
        <article className='flex flex-col items-start gap-2 p-3 w-[156.833px] rounded-lg border border-stroke-500 bg-white dark:bg-neutral-900 dark:border-neutral-600 dark:shadow-dark-panel hover:border-stroke-700 transition-colors cursor-pointer'>
            {IconComponent && <IconComponent />}
            <h3 className='text-regular-14-neutral-500 dark:text-regular-14-white'>{label}</h3>
        </article>
    );
};

export default QuickActionCard;