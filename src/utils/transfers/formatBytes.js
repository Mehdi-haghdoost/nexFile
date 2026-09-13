// Mirrors the formatter in useTransferFiles, but works from stored byte counts
// so the public page can label sizes without importing a client hook
export const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// Days remaining before a transfer expires, floored at zero
export const getDaysRemaining = (expirationDate) => {
    if (!expirationDate) return 0;

    const diff = new Date(expirationDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};