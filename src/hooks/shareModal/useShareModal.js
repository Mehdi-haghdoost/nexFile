import { useState, useEffect, useRef } from 'react';

export const useShareModal = () => {
  // State برای کنترل UI
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('main');
  const [isSearching, setIsSearching] = useState(false);

  // State برای داده‌ها
  const [shareLink, setShareLink] = useState('https://NexFile.com/folders/0B8MXxVL7sSStfjlBVnhQUk92SGVpSGl3WmFCQVMySE5EbGllOE9BU2hZeFk3SFhaQV9XWWc?resourcekey=0-UX80l5-84OSFv0QHOw4ejw&usp=sharing');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [shareNote, setShareNote] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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
  }, []);

  // Reset function
  const resetModalState = () => {
    setSearchTerm('');
    setInvitedUsers([]);
    setSearchResults([]);
    setView('main');
    setSelectedUser(null);
    setShareNote('');
    setShowDropdown(false);
  };

  return {
    // States
    isLoading,
    setIsLoading,
    view,
    setView,
    isSearching,
    shareLink,
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    invitedUsers,
    setInvitedUsers,
    searchResults,
    setSearchResults,
    shareNote,
    setShareNote,
    sharedUsers,
    setSharedUsers,
    selectedUser,
    setSelectedUser,
    searchContainerRef,
    
    // Actions
    resetModalState
  };
};