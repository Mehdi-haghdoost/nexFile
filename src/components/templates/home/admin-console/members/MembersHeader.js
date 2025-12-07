import MembersTabs from './MembersTabs';
import { SearchIcon, UsersPlusIcon } from '@/components/ui/icons';

const MembersHeader = () => {
    return (
        <header className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4 self-stretch w-full'>
            <MembersTabs />

            {/* Search and Button Container */}
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto'>
                <div className='flex items-center gap-1.5 h-9 sm:h-8 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light dark:bg-neutral-900 dark:border-neutral-700 w-full sm:w-auto sm:min-w-[200px]'>
                    <SearchIcon className="flex-shrink-0" />
                    <input
                        className='flex-1 text-xs sm:text-sm text-neutral-300 dark:text-neutral-200 outline-0 dark:bg-neutral-900 min-w-0'
                        type="search"
                        placeholder="Search members..."
                        aria-label="Search members"
                    />
                </div>
                <button
                    className='flex justify-center items-center gap-1.5 py-2 sm:py-[13px] px-3 h-9 sm:h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-xs sm:text-sm font-medium text-white whitespace-nowrap hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto'
                    aria-label="Invite new members"
                >
                    <UsersPlusIcon className="flex-shrink-0" />
                    Invite members
                </button>
            </div>
        </header>
    );
};

export default MembersHeader;