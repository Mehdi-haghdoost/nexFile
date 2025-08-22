import React, { useRef, useState } from 'react'

const useUserSearch = (invitedUsers, sharedUsers) => {

    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const searchContainerRef = useRef(null);

    // جستجوی کاربران از API
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        const debounceTimer = setTimeout(() => {
            fetch(`/api/users/search?q=${searchTerm}`)
                .then(res => res.json())
                .then(users => {
                    // ✅ فیلتر کردن کاربران که قبلاً دعوت شده‌اند یا اشتراک‌گذاری شده‌اند
                    const newResults = users.filter(user =>
                        !invitedUsers.some(invited => invited.id === user.id) &&
                        !sharedUsers.some(shared => shared.id === user.id)
                    );
                    setSearchResults(newResults);
                    setShowDropdown(true);
                })
                .catch(error => {
                    console.log('API search failed:', error);
                    setSearchResults([]);
                })
                .finally(() => setIsSearching(false));

        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, invitedUsers, sharedUsers]);

    // مخفی کردن dropdown وقتی خارج از آن کلیک میشود
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])


    const resetSearch = () => {
        setSearchTerm('');
        setShowDropdown(false);
        setSearchResults([]);
    }


    return {
        searchTerm,
        setSearchTerm,
        isSearching,
        searchResults,
        showDropdown,
        setShowDropdown,
        searchContainerRef,
        resetSearch,
    }
}

export default useUserSearch