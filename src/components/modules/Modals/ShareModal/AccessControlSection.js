import { GlobeIcon, PermissionsDropdownIcon, PublicAccessDropdownIcon } from '@/components/ui/icons';

const AccessControlSection = ({ sharedUsers }) => {
    return (
        <div className='flex flex-col items-start gap-2 self-stretch'>
            <p className='text-xs text-neutral-300 dark:text-white'>Who has access</p>
            <div className='flex items-center min-h-[38px] sm:h-[42px] gap-2 sm:gap-3 self-stretch'>
                <img src="/images/nav_img.png" className='w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-full shrink-0' alt="nav_img.png" />
                <div className='flex flex-col flex-1 justify-center items-start min-w-0'>
                    <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate w-full'>Ridwan T. (you)</h2>
                    <span className='text-xs text-neutral-300 dark:text-neutral-300 truncate w-full'>ridwant@gmail.com</span>
                </div>
                <p className='text-xs text-neutral-100 dark:text-neutral-100 shrink-0'>Owner</p>
            </div>

            {/* نمایش کاربران اشتراک‌گذاری شده */}
            {sharedUsers.map(user => (
                <div key={`shared-${user.id}`} className='flex items-center min-h-[38px] sm:h-[42px] gap-2 sm:gap-3 self-stretch'>
                    <img src={user.avatar} className='w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-full shrink-0' alt={user.name} />
                    <div className='flex flex-col flex-1 justify-center items-start min-w-0'>
                        <h2 className='text-sm sm:text-base font-medium text-neutral-500 dark:text-white truncate w-full'>{user.name}</h2>
                        <span className='text-xs text-neutral-300 dark:text-neutral-300 truncate w-full'>{user.email}</span>
                    </div>
                    <p className='text-xs text-neutral-100 dark:text-neutral-100 capitalize shrink-0'>{user.permission}</p>
                </div>
            ))}

            <div className='flex flex-col items-start gap-2 self-stretch'>
                <div className='flex justify-between items-center self-stretch'>
                    <span className='text-xs text-neutral-300 dark:text-neutral-300'>Public access</span>
                    <div className='flex justify-center items-center gap-1 sm:gap-1.5'>
                        <h3 className='text-xs font-medium text-neutral-500 dark:text-white pr-1'>Can view</h3>
                        <PermissionsDropdownIcon />
                    </div>
                </div>
                <div className='flex justify-center items-center min-h-[48px] sm:h-[52px] py-2 sm:py-3 px-3 sm:px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-900 dark:border-neutral-600'>
                    <GlobeIcon className="shrink-0" />
                    <div className='flex flex-col flex-1 justify-center items-start gap-0.5 min-w-0'>
                        <p className='text-xs font-medium text-neutral-500 dark:text-white'>Anyone who has a link</p>
                        <p className='text-xs text-neutral-200 dark:text-neutral-200 truncate w-full'>Anyone with a link can see</p>
                    </div>
                    <PublicAccessDropdownIcon className="shrink-0" />
                </div>
            </div>
        </div>
    );
};

export default AccessControlSection;