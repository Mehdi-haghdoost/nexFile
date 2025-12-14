import { SearchIcon } from '@/components/ui/icons';
import UserSearchDropdown from './UserSearchDropdown';

const UserSearchBox = ({ 
    searchTerm, 
    handleSearchChange, 
    isLoading, 
    showDropdown, 
    searchResults, 
    isSearching, 
    handleSelectUser, 
    searchContainerRef 
}) => {
    return (
        <div className="relative w-full" ref={searchContainerRef}>
            <div className='flex items-center h-8 gap-2 px-2 sm:px-3 py-2 rounded-lg border border-primary-500 bg-white shadow-[0_0_4px_0_rgba(76,60,198,0.16)] self-stretch dark:border-primary-500 dark:bg-neutral-900'>
                <SearchIcon className="w-4 h-4 shrink-0" />
                <div className="w-[1px] h-4 bg-[#A1A1A3]/50"></div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='w-full h-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-xs sm:placeholder:text-sm dark:text-white rounded-lg p-1 sm:p-2'
                    disabled={isLoading}
                    placeholder='Search people... (try: ruben, sarah, mike)'
                />
            </div>

            <UserSearchDropdown
                showDropdown={showDropdown}
                searchResults={searchResults}
                isSearching={isSearching}
                searchTerm={searchTerm}
                handleSelectUser={handleSelectUser}
            />
        </div>
    );
};

export default UserSearchBox;