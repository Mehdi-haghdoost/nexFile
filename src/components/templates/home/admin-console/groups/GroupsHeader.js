import { ChevronDownIcon, SearchIcon, UsersPlusIcon } from "@/components/ui/icons";

const GroupsHeader = () => {
    return (
        <header className="flex justify-between items-center self-stretch w-full">
            {/* Group Filter Dropdown */}
            <div className="flex justify-between items-center py-1 px-3 h-8 w-[190px] rounded-lg border border-stroke-300 bg-white shadow-light dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel">
                <div className="flex items-center gap-1">
                    <p className="text-regular-14 dark:text-regular-14-neutral-300">Group type:</p>
                    <h3 className="text-medium-14 dark:text-medium-14-white">All group</h3>
                </div>
                <ChevronDownIcon grayStroke />
            </div>

            {/* Search and Button Container */}
            <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1.5 h-8 py-[13px] pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light dark:bg-neutral-900 dark:border-neutral-700'>
                    <SearchIcon />
                    <input
                        className='flex-1 text-regular-12-manrope dark:text-regular-12-200 outline-0 dark:bg-neutral-900'
                        type="search"
                        placeholder="Search groups..."
                        aria-label="Search groups"
                    />
                </div>
                <button
                    className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-medium-14-white text-sm whitespace-nowrap hover:opacity-90 transition-opacity'
                    aria-label="Create new group"
                >
                    <UsersPlusIcon />
                    Create new group
                </button>
            </div>
        </header>
    );
};

export default GroupsHeader;