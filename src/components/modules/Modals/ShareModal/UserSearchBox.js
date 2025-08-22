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
            <div className='flex items-center h-8 gap-2 px-3 py-2 rounded-lg border border-primary-500 bg-white shadow-[0_0_4px_0_rgba(76,60,198,0.16)] self-stretch'>
                <SearchIcon />
                <div className="w-[1px] h-4 bg-[#A1A1A3]/50"></div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='w-full h-full text-sm bg-transparent outline-none placeholder-regular-12-manrope'
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