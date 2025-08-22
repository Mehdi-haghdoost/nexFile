import { useState } from 'react'

export const useInvitedUsers = () => {
    const [invitedUsers, setInvitedUsers] = useState([]);

    //  اضافه کردن لیست دعوت شده ها
    const addUser = (user) => {
        const isAlreadyInvited = invitedUsers.find(invited => invited.id === user.id);

        if (!isAlreadyInvited) {
            setInvitedUsers(prevUsers => [...prevUsers, { ...user, Permissions: 'view' }]);
            return true;
        }

        return true;
    }

    // حذف کاربر از لیست دعوت شده‌ها
    const removeUser = (userId) => {
        setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
    };

    // آپدیت permission کاربر
    const updateUserPermission = (userId, permission) => {
        setInvitedUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, permission }
                    : user
            )
        );
    };

    // پیدا کردن کاربر خاص
    const findUser = (userId) => {
        return invitedUsers.find(user => user.id === userId);
    };

    // چک کردن وجود کاربر
    const hasUser = (userId) => {
        return invitedUsers.some(user => user.id === userId);
    };

    // ریست کردن لیست
    const resetUsers = () => {
        setInvitedUsers([]);
    };

    // دریافت تعداد کاربران دعوت شده
    const getUserCount = () => {
        return invitedUsers.length;
    };

    return {
        users: invitedUsers,
        addUser,
        removeUser,
        updateUserPermission,
        findUser,
        hasUser,
        resetUsers,
        getUserCount
    };
}