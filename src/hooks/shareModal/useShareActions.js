export const useShareActions = (modalState) => {
  const {
    setSearchTerm,
    setShowDropdown,
    setSearchResults,
    setInvitedUsers,
    invitedUsers,
    sharedUsers,
    setView,
    setSelectedUser,
    selectedUser,
    shareNote,
    setShareNote,
    setSharedUsers,
    shareLink,
    setIsLoading
  } = modalState;

  // هندل کردن تغییر متن جستجو
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // هندل کردن انتخاب user
  const handleSelectUser = (e, user) => {
    e.stopPropagation();
    const isAlreadyInvited = invitedUsers.find(invited => invited.id === user.id);
    const isAlreadyShared = sharedUsers.find(shared => shared.id === user.id);
    
    if (!isAlreadyInvited && !isAlreadyShared) {
      setInvitedUsers(prevUsers => [...prevUsers, { ...user, permission: 'view' }]);
    }
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  // حذف کاربر دعوت شده
  const handleRemoveUser = (e, userId) => {
    e.stopPropagation();
    setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
  };

  // رفتن به صفحه review با کاربر انتخاب شده
  const handleProceedToReview = (user) => {
    setSelectedUser(user);
    setView('review');
  };

  // هندل کردن کپی لینک
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await navigator.clipboard.writeText(shareLink);
      alert('Link copied successfully!');
    } catch (error) {
      console.error('Error copying link:', error);
      alert('Error copying link');
    } finally {
      setIsLoading(false);
    }
  };

  // ارسال دعوت نامه اشتراک گذاری
  const handleSendShare = async (data) => {
    if (!selectedUser) return;

    setIsLoading(true);

    try {
      // شبیه سازی تاخیر در شبکه
      await new Promise(resolve => setTimeout(resolve, 1500));

      // چک کردن که کاربر قبلاً اشتراک‌گذاری نشده باشد
      const isAlreadyShared = sharedUsers.find(shared => shared.id === selectedUser.id);
      if (!isAlreadyShared) {
        // شبیه سازی موفق بودن عملیات
        console.log(`Sharing folder with :`, {
          folderId: data?.folderId,
          user: selectedUser,
          permission: selectedUser.permission,
          note: shareNote,
        });

        // اضافه کردن کاربر به لیست shared users
        setSharedUsers(prev => [...prev, selectedUser]);

        alert('Folder shared successfully!');
      } else {
        alert('User already has access to this folder!');
      }

      // حذف کاربر از invited users
      setInvitedUsers(prev => prev.filter(user => user.id !== selectedUser.id));

      setView('main');
      setSelectedUser(null);
      setShareNote('');
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to share folder');
    } finally {
      setIsLoading(false);
    }
  };

  // هندل کردن تغییر permission در صفحه review
  const handlePermissionChange = (e) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, permission: e.target.value });
      // همزمان در invitedUsers هم آپدیت کن
      setInvitedUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? { ...user, permission: e.target.value }
            : user
        )
      );
    }
  };

  return {
    handleSearchChange,
    handleSelectUser,
    handleRemoveUser,
    handleProceedToReview,
    handleCopyLink,
    handleSendShare,
    handlePermissionChange
  };
};