'use client';
import { SearchIcon, UsersPlusIcon } from "@/components/ui/icons";
import useModalStore from '@/store/ui/modalStore';
import { GROUP_TYPE_FILTERS } from '@/utils/constants/groupsConstants';

const GroupsHeader = ({ searchQuery, onSearchChange, typeFilter, onTypeFilterChange, onGroupCreated }) => {
    const { openModal } = useModalStore();

    return (
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4 self-stretch w-full">
            {/* Group type filter */}
            <div className="flex items-center gap-1 py-1.5 sm:py-1 px-3 h-9 sm:h-8 w-full sm:w-[190px] rounded-lg border border-stroke-300 bg-white shadow-light dark:bg-dark-gradient dark:border-dark-border dark:shadow-dark-panel">
                <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 whitespace-nowrap">Group type:</p>
                <select
                    value={typeFilter}
                    onChange={(e) => onTypeFilterChange(e.target.value)}
                    className="flex-1 min-w-0 text-xs sm:text-sm font-medium text-neutral-500 dark:text-white bg-transparent outline-none cursor-pointer bg-white dark:bg-neutral-700 text-neutral-500 dark:text-white"
                >
                    {GROUP_TYPE_FILTERS.map((f) => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                </select>
            </div>

            {/* Search and create button */}
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto'>
                <div className='flex items-center gap-1.5 h-9 sm:h-8 py-2 sm:py-[13px] pr-3 sm:pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light dark:bg-neutral-900 dark:border-neutral-700 w-full sm:w-auto sm:min-w-[200px]'>
                    <SearchIcon className="flex-shrink-0" />
                 <input
    className='flex-1 text-xs sm:text-sm text-neutral-300 dark:text-neutral-200 bg-transparent dark:bg-neutral-900 min-w-0 border-0 focus:outline-none focus:ring-0 focus:border-transparent'
    type="search"
    placeholder="Search groups..."
    aria-label="Search groups"
    value={searchQuery}
    onChange={(e) => onSearchChange(e.target.value)}
/>
                </div>
                <button
                    onClick={() => openModal('createGroup', { onCreated: onGroupCreated })}
                    className='flex justify-center items-center gap-1.5 py-2 sm:py-[13px] px-3 h-9 sm:h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-xs sm:text-sm font-medium text-white whitespace-nowrap hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto'
                    aria-label="Create new group"
                >
                    <UsersPlusIcon className="flex-shrink-0" />
                    Create new group
                </button>
            </div>
        </header>
    );
};

export default GroupsHeader;