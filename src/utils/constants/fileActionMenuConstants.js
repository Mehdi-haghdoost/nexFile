import { getItemPermissions } from '@/utils/sharing/itemPermissions';

export const getFileActionMenuItems = (item, handlers) => {
    // Check if item exists and has required properties
    if (!item) return [];

    const isFolder = !item.mimeType; // Folders don't have mimeType
    const isStarred = item.isStarred || false;

    // Sharing, sending, moving, copying, deleting and starring stay with the owner; renaming needs edit access
    const { isOwner, canEdit } = getItemPermissions(item);

    const items = [
        // Quick Actions; Send appears for files only
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M9 12.5V9.5M9 6.5H9.0075M16.5 9.5C16.5 13.6421 13.1421 17 9 17C4.85786 17 1.5 13.6421 1.5 9.5C1.5 5.35786 4.85786 2 9 2C13.1421 2 16.5 5.35786 16.5 9.5Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: isFolder ? 'Folder info' : 'File info',
            section: 'quick',
            hasArrow: true,
            action: handlers.handleInfo
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M8.99902 4.99988H4.49902C4.1012 4.99988 3.71967 5.15791 3.43836 5.43922C3.15706 5.72052 2.99902 6.10205 2.99902 6.49988V13.9999C2.99902 14.3977 3.15706 14.7792 3.43836 15.0605C3.71967 15.3418 4.1012 15.4999 4.49902 15.4999H11.999C12.3968 15.4999 12.7784 15.3418 13.0597 15.0605C13.341 14.7792 13.499 14.3977 13.499 13.9999V9.49988M8.24902 10.2499L14.999 3.49988M14.999 3.49988H11.249M14.999 3.49988V7.24988" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Open in',
            section: 'quick',
            hasArrow: true,
            action: handlers.handleOpenIn
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M15.5935 9.95553C15.7766 9.79859 15.8682 9.72013 15.9017 9.62675C15.9311 9.5448 15.9311 9.45515 15.9017 9.3732C15.8682 9.27982 15.7766 9.20136 15.5935 9.04442L9.24047 3.59895C8.9253 3.32881 8.76772 3.19373 8.6343 3.19042C8.51835 3.18755 8.40759 3.23849 8.33432 3.3284C8.25 3.43185 8.25 3.6394 8.25 4.05451V7.27595C6.64899 7.55604 5.1837 8.36729 4.09478 9.58537C2.90762 10.9134 2.25093 12.6319 2.25 14.4132V14.8722C3.03701 13.9241 4.01963 13.1574 5.13057 12.6244C6.11002 12.1545 7.16881 11.8762 8.25 11.8029V14.9454C8.25 15.3605 8.25 15.5681 8.33432 15.6716C8.40759 15.7615 8.51835 15.8124 8.6343 15.8095C8.76772 15.8062 8.9253 15.6711 9.24047 15.401L15.5935 9.95553Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Share',
            section: 'quick',
            hidden: !isOwner,
            action: handlers.handleShare
        },
        // Sends a file as a transfer; folders cannot be sent, so they never get this item
        ...(isFolder ? [] : [{
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 20 20" fill="none">
                    <path d="M18.3333 1.66663L9.16663 10.8333M18.3333 1.66663L12.5 18.3333L9.16663 10.8333M18.3333 1.66663L1.66663 7.49996L9.16663 10.8333" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Send',
            section: 'quick',
            hidden: !isOwner,
            action: handlers.handleSend
        }]),
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M6.75 13.25H5.25C3.17893 13.25 1.5 11.5711 1.5 9.5C1.5 7.42893 3.17893 5.75 5.25 5.75H6.75M11.25 13.25H12.75C14.8211 13.25 16.5 11.5711 16.5 9.5C16.5 7.42893 14.8211 5.75 12.75 5.75H11.25M5.25 9.5L12.75 9.5" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Copy link',
            section: 'quick',
            action: handlers.handleCopyLink
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M6 16.2501V15.5001C6 15.1023 6.15804 14.7208 6.43934 14.4395C6.72064 14.1582 7.10217 14.0001 7.5 14.0001H10.5C10.8978 14.0001 11.2794 14.1582 11.5607 14.4395C11.842 14.7208 12 15.1023 12 15.5001V16.2501M12.75 8.00012H14.25C14.6478 8.00012 15.0294 8.15816 15.3107 8.43946C15.592 8.72077 15.75 9.1023 15.75 9.50012V10.2501M2.25 10.2501V9.50012C2.25 9.1023 2.40804 8.72077 2.68934 8.43946C2.97064 8.15816 3.35218 8.00012 3.75 8.00012H5.25M7.5 10.2501C7.5 10.6479 7.65804 11.0295 7.93934 11.3108C8.22064 11.5921 8.60217 11.7501 9 11.7501C9.39782 11.7501 9.77935 11.5921 10.0607 11.3108C10.342 11.0295 10.5 10.6479 10.5 10.2501C10.5 9.8523 10.342 9.47077 10.0607 9.18946C9.77935 8.90816 9.39782 8.75012 9 8.75012C8.60217 8.75012 8.22064 8.90816 7.93934 9.18946C7.65804 9.47077 7.5 9.8523 7.5 10.2501ZM11.25 4.25012C11.25 4.64795 11.408 5.02948 11.6893 5.31078C11.9706 5.59209 12.3522 5.75012 12.75 5.75012C13.1478 5.75012 13.5294 5.59209 13.8107 5.31078C14.092 5.02948 14.25 4.64795 14.25 4.25012C14.25 3.8523 14.092 3.47077 13.8107 3.18946C13.5294 2.90816 13.1478 2.75012 12.75 2.75012C12.3522 2.75012 11.9706 2.90816 11.6893 3.18946C11.408 3.47077 11.25 3.8523 11.25 4.25012ZM3.75 4.25012C3.75 4.64795 3.90804 5.02948 4.18934 5.31078C4.47064 5.59209 4.85218 5.75012 5.25 5.75012C5.64782 5.75012 6.02936 5.59209 6.31066 5.31078C6.59196 5.02948 6.75 4.64795 6.75 4.25012C6.75 3.8523 6.59196 3.47077 6.31066 3.18946C6.02936 2.90816 5.64782 2.75012 5.25 2.75012C4.85218 2.75012 4.47064 2.90816 4.18934 3.18946C3.90804 3.47077 3.75 3.8523 3.75 4.25012Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Manage permissions',
            section: 'quick',
            hidden: !isOwner,
            action: handlers.handleManagePermissions
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M15.75 11.7501V12.6501C15.75 13.9102 15.75 14.5403 15.5048 15.0216C15.289 15.445 14.9448 15.7892 14.5215 16.0049C14.0402 16.2501 13.4101 16.2501 12.15 16.2501H5.85C4.58988 16.2501 3.95982 16.2501 3.47852 16.0049C3.05516 15.7892 2.71095 15.445 2.49524 15.0216C2.25 14.5403 2.25 13.9102 2.25 12.6501V11.7501M12.75 8.00012L9 11.7501M9 11.7501L5.25 8.00012M9 11.7501V2.75012" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: isFolder ? 'Download folder' : 'Download file',
            section: 'quick',
            action: handlers.handleDownload
        },

        { divider: true, section: 'manage' },

        // File Management
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M9.75 5.75012H3.9C3.05992 5.75012 2.63988 5.75012 2.31901 5.91361C2.03677 6.05742 1.8073 6.28689 1.66349 6.56914C1.5 6.89 1.5 7.31004 1.5 8.15012V10.8501C1.5 11.6902 1.5 12.1102 1.66349 12.4311C1.8073 12.7134 2.03677 12.9428 2.31901 13.0866C2.63988 13.2501 3.05992 13.2501 3.9 13.2501H9.75M12.75 5.75012H14.1C14.9401 5.75012 15.3601 5.75012 15.681 5.91361C15.9632 6.05742 16.1927 6.28689 16.3365 6.56914C16.5 6.89 16.5 7.31004 16.5 8.15012V10.8501C16.5 11.6902 16.5 12.1102 16.3365 12.4311C16.1927 12.7134 15.9632 12.9428 15.681 13.0866C15.3601 13.2501 14.9401 13.2501 14.1 13.2501H12.75M12.75 16.2501L12.75 2.75012M14.625 2.75013L10.875 2.75012M14.625 16.2501L10.875 16.2501" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Rename',
            section: 'manage',
            hidden: !canEdit,
            action: handlers.handleRename
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M12 12.5V14.6C12 15.4401 12 15.8601 11.8365 16.181C11.6927 16.4632 11.4632 16.6927 11.181 16.8365C10.8601 17 10.4401 17 9.6 17H3.9C3.05992 17 2.63988 17 2.31901 16.8365C2.03677 16.6927 1.8073 16.4632 1.66349 16.181C1.5 15.8601 1.5 15.4401 1.5 14.6V8.9C1.5 8.05992 1.5 7.63988 1.66349 7.31901C1.8073 7.03677 2.03677 6.8073 2.31901 6.66349C2.63988 6.5 3.05992 6.5 3.9 6.5H6M8.4 12.5H14.1C14.9401 12.5 15.3601 12.5 15.681 12.3365C15.9632 12.1927 16.1927 11.9632 16.3365 11.681C16.5 11.3601 16.5 10.9401 16.5 10.1V4.4C16.5 3.55992 16.5 3.13988 16.3365 2.81901C16.1927 2.53677 15.9632 2.3073 15.681 2.16349C15.3601 2 14.9401 2 14.1 2H8.4C7.55992 2 7.13988 2 6.81901 2.16349C6.53677 2.3073 6.3073 2.53677 6.16349 2.81901C6 3.13988 6 3.55992 6 4.4V10.1C6 10.9401 6 11.3601 6.16349 11.681C6.3073 11.9632 6.53677 12.1927 6.81901 12.3365C7.13988 12.5 7.55992 12.5 8.4 12.5Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: isFolder ? 'Copy folder' : 'Copy file',
            section: 'manage',
            hidden: !isOwner,
            action: isFolder ? handlers.handleCopyFolder : handlers.handleCopyFile
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M3.75 7.25L1.5 9.5M1.5 9.5L3.75 11.75M1.5 9.5H16.5M6.75 4.25L9 2M9 2L11.25 4.25M9 2V17M11.25 14.75L9 17M9 17L6.75 14.75M14.25 7.25L16.5 9.5M16.5 9.5L14.25 11.75" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: 'Move',
            section: 'manage',
            hidden: !isOwner,
            action: handlers.handleMove
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M2.99902 5.75012H14.999M7.49902 8.75012V13.2501M10.499 8.75012V13.2501M3.74902 5.75012L4.49902 14.7501C4.49902 15.1479 4.65706 15.5295 4.93836 15.8108C5.21967 16.0921 5.6012 16.2501 5.99902 16.2501H11.999C12.3968 16.2501 12.7784 16.0921 13.0597 15.8108C13.341 15.5295 13.499 15.1479 13.499 14.7501L14.249 5.75012M6.74902 5.75012V3.50012C6.74902 3.30121 6.82804 3.11044 6.96869 2.96979C7.10935 2.82914 7.30011 2.75012 7.49902 2.75012H10.499C10.6979 2.75012 10.8887 2.82914 11.0294 2.96979C11.17 3.11044 11.249 3.30121 11.249 3.50012V5.75012" stroke="#BC1828" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'Delete',
            section: 'manage',
            hidden: !isOwner,
            textColor: 'text-red-500',
            action: handlers.handleDelete
        },

        { divider: true, section: 'other' },

        // Other Actions
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M8.46199 3.09005C8.63485 2.73984 8.72128 2.56474 8.83862 2.5088C8.94071 2.46012 9.05931 2.46012 9.1614 2.5088C9.27874 2.56474 9.36517 2.73984 9.53804 3.09005L11.178 6.41252C11.2291 6.51591 11.2546 6.56761 11.2919 6.60774C11.3249 6.64328 11.3645 6.67207 11.4085 6.69253C11.4582 6.71563 11.5152 6.72397 11.6293 6.74064L15.2977 7.27684C15.684 7.3333 15.8772 7.36154 15.9666 7.45589C16.0444 7.53798 16.0809 7.65078 16.0661 7.76289C16.0491 7.89174 15.9093 8.02795 15.6296 8.30035L12.9761 10.8849C12.8934 10.9654 12.852 11.0057 12.8253 11.0537C12.8017 11.0961 12.7865 11.1427 12.7807 11.1909C12.7741 11.2454 12.7838 11.3023 12.8034 11.4161L13.4295 15.0666C13.4955 15.4517 13.5285 15.6442 13.4665 15.7584C13.4125 15.8578 13.3165 15.9275 13.2053 15.9482C13.0775 15.9719 12.9046 15.8809 12.5588 15.6991L9.27928 13.9744C9.1771 13.9207 9.12601 13.8938 9.07218 13.8833C9.02452 13.8739 8.9755 13.8739 8.92784 13.8833C8.87402 13.8938 8.82293 13.9207 8.72074 13.9744L5.44119 15.6991C5.09544 15.8809 4.92256 15.9719 4.79473 15.9482C4.68351 15.9275 4.58754 15.8578 4.53355 15.7584C4.4715 15.6442 4.50452 15.4517 4.57056 15.0666L5.19666 11.4161C5.21618 11.3023 5.22594 11.2454 5.21934 11.1909C5.21349 11.1427 5.19833 11.0961 5.1747 11.0537C5.14802 11.0057 5.10666 10.9654 5.02394 10.8849L2.37042 8.30035C2.09075 8.02795 1.95091 7.89174 1.93389 7.76289C1.91909 7.65078 1.95567 7.53798 2.03344 7.45589C2.12283 7.36154 2.31598 7.3333 2.70228 7.27684L6.37073 6.74064C6.48482 6.72397 6.54186 6.71563 6.59154 6.69253C6.63552 6.67207 6.67512 6.64328 6.70814 6.60774C6.74543 6.56761 6.77095 6.51591 6.82198 6.41252L8.46199 3.09005Z" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#9F9FA3]" />
                </svg>
            ),
            title: isStarred ? 'Unstar' : 'Star',
            section: 'other',
            hidden: !isOwner,
            action: handlers.handleToggleStar
        },
    ];

    return items.filter((menuItem) => !menuItem.hidden);
};