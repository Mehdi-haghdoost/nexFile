const DAY_MS = 24 * 60 * 60 * 1000;

// How long a deleted item sits before it is worth mentioning it is still there
const TRASH_REMINDER_DAYS = 7;

// Most notices returned, since this feed is a prompt rather than an archive
const NOTICE_LIMIT = 20;

export const FILE_NOTICE_TYPES = {
    SHARED: 'shared',
    TRASHED: 'trashed',
    RECENT_FOLDER: 'recent-folder',
};

// Derives a feed from what the account already holds, so no event needs recording
export const buildFileNotices = ({ sharedItems = [], deletedItems = [], recentFolders = [] }) => {
    const notices = [];
    const now = Date.now();

    // Something shared with you is the one thing here you did not do yourself
    sharedItems
        .filter((item) => !item.isOwner)
        .forEach((item) => {
            notices.push({
                id: `${FILE_NOTICE_TYPES.SHARED}-${item.id}`,
                type: FILE_NOTICE_TYPES.SHARED,
                title: `${item.sharedBy?.name || 'Someone'} shared ${item.type === 'folder' ? 'a folder' : 'a file'} with you`,
                detail: item.name,
                at: item.sharedAt,
                href: item.type === 'folder' ? `/folder/${item.id}` : '/home',
            });
        });

    // Worth raising once something has sat in the trash long enough to be forgotten
    const staleCutoff = now - TRASH_REMINDER_DAYS * DAY_MS;

    deletedItems
        .filter((item) => item.deletedAt && new Date(item.deletedAt).getTime() <= staleCutoff)
        .forEach((item) => {
            notices.push({
                id: `${FILE_NOTICE_TYPES.TRASHED}-${item.id}`,
                type: FILE_NOTICE_TYPES.TRASHED,
                title: 'Still in the trash',
                detail: item.name,
                at: item.deletedAt,
                href: null,
            });
        });

    recentFolders.slice(0, 3).forEach((folder) => {
        notices.push({
            id: `${FILE_NOTICE_TYPES.RECENT_FOLDER}-${folder.id}`,
            type: FILE_NOTICE_TYPES.RECENT_FOLDER,
            title: 'Recently worked in',
            detail: folder.name,
            at: folder.lastActivity,
            href: `/folder/${folder.id}`,
        });
    });

    return notices
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .slice(0, NOTICE_LIMIT);
};