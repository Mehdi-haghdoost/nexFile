import cloudinary from "@/lib/cloudinary";
import { TRANSFER_DOWNLOAD_URL_TTL_SECONDS } from "@/utils/constants/transferConstants";

// Builds a short-lived signed URL for a private asset, so a copied link stops working
export const buildSignedDownloadUrl = (file) => {
    // Files uploaded before private mode have no signed equivalent, so their stored URL still applies
    if (!file.isPrivate || !file.cloudinaryId) return file.url;

    return cloudinary.utils.private_download_url(file.cloudinaryId, file.extension, {
        resource_type: file.resourceType || "raw",
        type: "private",
        attachment: true,
        expires_at: Math.floor(Date.now() / 1000) + TRANSFER_DOWNLOAD_URL_TTL_SECONDS,
    });
};