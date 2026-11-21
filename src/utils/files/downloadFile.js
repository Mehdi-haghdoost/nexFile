import { api } from '@/lib/fetchWithAuth';

// Downloads a file through the app, which checks access and serves it as an attachment from any origin
export const downloadFile = async (file) => {
    const response = await api.get(`/api/files/${file.id}/download`);

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to download file');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = file.originalName || file.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoked on the next tick, after the browser has started saving the file
    setTimeout(() => URL.revokeObjectURL(url), 0);
};