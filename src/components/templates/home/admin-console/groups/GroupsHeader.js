import { ChevronDownIcon, SearchIcon, UsersPlusIcon } from "@/components/ui/icons";

const GroupsHeader = () => {
    return (
        <header className="flex justify-between items-center self-stretch">
            {/* Group Filter Dropdown */}
            <div className="flex justify-between items-center py-1 px-3 h-8 w-[190px] rounded-lg border border-stroke-300 bg-white shadow-light">
                <div className="flex items-center gap-1">
                    <p className="text-regular-14">Group type:</p>
                    <h3 className="text-medium-14">All group</h3>
                </div>
                <ChevronDownIcon />
            </div>

            {/* Search and Button Container */}
            <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1.5 h-8 py-[13px] pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light'>
                    <SearchIcon />
                    <input
                        className='flex-1 text-regular-12-manrope outline-0'
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