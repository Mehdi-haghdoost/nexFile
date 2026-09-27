import cloudinary from "@/lib/cloudinary";
import Transfer from "@/models/Transfer";
import {
    TRANSFER_PURGE_BATCH_SIZE,
    TRANSFER_PURGE_GRACE_DAYS,
} from "@/utils/constants/transferConstants";

const DAY_MS = 24 * 60 * 60 * 1000;

// Private assets live in their own namespace, so destroy has to be told which one
export const destroyTransferFile = (file) =>
    cloudinary.uploader.destroy(file.cloudinaryId, {
        resource_type: file.resourceType || "raw",
        type: file.isPrivate ? "private" : "upload",
    });

// Removes one transfer's stored files, keeping their names so the sender still sees what was sent
export const purgeTransferFiles = async (transfer) => {
    const stored = transfer.files.filter((file) => file.cloudinaryId);

    const results = await Promise.allSettled(stored.map(destroyTransferFile));

    const failures = results.filter((result) => result.status === "rejected");
    failures.forEach((result) => console.error("Cleanup destroy failed:", result.reason));

    // A leftover asset is a smaller problem than a record that never stops being retried
    transfer.files.forEach((file) => {
        file.url = null;
        file.cloudinaryId = null;
    });

    transfer.filesPurgedAt = new Date();
    await transfer.save();

    return { removed: stored.length - failures.length, failed: failures.length };
};

// Finds transfers whose grace period has passed, whether they expired or were deleted
export const findPurgeCandidates = async () => {
    const cutoff = new Date(Date.now() - TRANSFER_PURGE_GRACE_DAYS * DAY_MS);

    return Transfer.find({
        filesPurgedAt: null,
        "files.cloudinaryId": { $ne: null },
        $or: [
            { isDeleted: false, expirationDate: { $lte: cutoff } },
            { isDeleted: true, deletedAt: { $lte: cutoff } },
        ],
    }).limit(TRANSFER_PURGE_BATCH_SIZE);
};

// Cleans up one batch and reports what it did, so a scheduled run can be checked
export const runTransferCleanup = async () => {
    const candidates = await findPurgeCandidates();

    let removedFiles = 0;
    let failedFiles = 0;

    for (const transfer of candidates) {
        const result = await purgeTransferFiles(transfer);
        removedFiles += result.removed;
        failedFiles += result.failed;
    }

    return {
        transfersPurged: candidates.length,
        removedFiles,
        failedFiles,
        hasMore: candidates.length === TRANSFER_PURGE_BATCH_SIZE,
    };
};