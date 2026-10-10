import cloudinary from "@/lib/cloudinary";
import Transfer from "@/models/Transfer";
import {
    TRANSFER_PURGE_BATCH_SIZE,
    TRANSFER_PURGE_GRACE_DAYS,
} from "@/utils/constants/transferConstants";

const DAY_MS = 24 * 60 * 60 * 1000;

// Private assets live in their own namespace, so destroy has to be told which one
export const destroyTransferFile = async (file) => {
    const result = await cloudinary.uploader.destroy(file.cloudinaryId, {
        resource_type: file.resourceType || "raw",
        type: file.isPrivate ? "private" : "upload",
    });

    // Cloudinary answers with a status rather than throwing, and an asset already gone counts as removed
    if (result?.result !== "ok" && result?.result !== "not found") {
        throw new Error(result?.result || "unknown destroy result");
    }

    return result;
};

// Removes one transfer's stored files, keeping their names so the sender still sees what was sent
export const purgeTransferFiles = async (transfer) => {
    const stored = transfer.files.filter((file) => file.cloudinaryId);

    const results = await Promise.allSettled(stored.map(destroyTransferFile));

    const failed = new Set();

    results.forEach((result, index) => {
        if (result.status !== "rejected") return;

        const file = stored[index];
        console.error(
            `Cleanup destroy failed for ${file.cloudinaryId}:`,
            result.reason?.message || result.reason
        );
        failed.add(file);
    });

    // A file whose asset survived keeps its id, so the orphan stays findable and reachable by a retry
    transfer.files.forEach((file) => {
        if (!file.cloudinaryId || failed.has(file)) return;

        file.url = null;
        file.cloudinaryId = null;
    });

    // Left unset while anything survives, which is what brings the transfer back next run
    if (failed.size === 0) {
        transfer.filesPurgedAt = new Date();
    }

    await transfer.save();

    return { removed: stored.length - failed.size, failed: failed.size };
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