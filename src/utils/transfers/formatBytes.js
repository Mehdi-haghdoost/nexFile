// Mirrors the formatter in useTransferFiles, but works from stored byte counts
// so the public page can label sizes without importing a client hook
export const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// Describes how long is left, narrowing the unit as the deadline approaches
export const formatTimeRemaining = (expirationDate) => {
    if (!expirationDate) return 'no expiry';

    const remaining = new Date(expirationDate).getTime() - Date.now();

    if (remaining <= 0) return 'expired';

    const minutes = Math.floor(remaining / 60000);
    if (minutes < 60) return minutes <= 1 ? 'less than a minute' : `${minutes} minutes`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? '1 hour' : `${hours} hours`;

    const days = Math.floor(hours / 24);
    return days === 1 ? '1 day' : `${days} days`;
};