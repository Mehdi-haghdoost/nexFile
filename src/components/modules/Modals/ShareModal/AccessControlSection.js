import { GlobeIcon, PermissionsDropdownIcon, PublicAccessDropdownIcon } from '@/components/ui/icons';

const AccessControlSection = ({ sharedUsers }) => {
    return (
        <div className='flex flex-col items-start gap-2 self-stretch'>
            <p className='text-regular-12-neutral-300'>Who has access</p>
            <div className='flex items-center h-[42px] gap-3 self-stretch'>
                <img src="/images/nav_img.png" className='w-[38px] h-[38px] rounded-[38px]' alt="nav_img.png" />
                <div className='flex flex-col flex-1 justify-center items-start '>
                    <h2 className='text-medium-16 dark:text-medium-16-white'>Ridwan T. (you)</h2>
                    <span className='text-regular-12 dark:text-regular-12-neutral-300'>ridwant@gmail.com</span>
                </div>
                <p className='text-regular-12-neutral-100'>Owner</p>
            </div>

            {/* نمایش کاربران اشتراک‌گذاری شده */}
            {sharedUsers.map(user => (
                <div key={`shared-${user.id}`} className='flex items-center h-[42px] gap-3 self-stretch'>
                    <img src={user.avatar} className='w-[38px] h-[38px] rounded-[38px]' alt={user.name} />
                    <div className='flex flex-col flex-1 justify-center items-start '>
                        <h2 className='text-medium-16 '>{user.name}</h2>
                        <span className='text-regular-12'>{user.email}</span>
                    </div>
                    <p className='text-regular-12-neutral-100 capitalize'>{user.permission}</p>
                </div>
            ))}

            <div className='flex flex-col items-start gap-2 self-stretch'>
                <div className='flex justify-between items-center self-stretch'>
                    <span className='text-regular-12 dark:text-regular-12-neutral-300'>Public access</span>
                    <div className='flex justify-center items-center gap1.5'>
                        <h3 className='text-medium-12 dark:text-medium-12-white pr-1'>Can view</h3>
                        <PermissionsDropdownIcon />
                    </div>
                </div>
                <div className='flex justify-center items-center h-[52px] py-3 px-4 gap-2 self-stretch rounded-lg border border-[#E1E0E5] bg-white dark:bg-neutral-900 dark:border-neutral-600'>
                    <GlobeIcon />
                    <div className='flex flex-col flex-1 justify-center items-start gap-0.5'>
                        <p className='text-medium-12 dark:text-medium-12-white'>Anyone who has a link</p>
                        <p className='text-regular-12-neutral-200 dark:text-regular-12-neutral-200'>Anyone with a link can see</p>
                    </div>
                    <PublicAccessDropdownIcon />
                </div>
            </div>
        </div>
    );
};

export default AccessControlSection;