import crypto from "crypto";
import TransferAccessAttempt from "@/models/TransferAccessAttempt";
import {
    TRANSFER_LOCKOUT_MINUTES,
    TRANSFER_MAX_PASSWORD_ATTEMPTS,
} from "@/utils/constants/transferConstants";

const MASTER_SECRET =
    process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

// Reads the client address from proxy headers, falling back to a shared bucket
const getClientAddress = (request) => {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();

    return request.headers.get("x-real-ip") || "unknown";
};

// Keyed by an HMAC so the stored counter carries no readable address
export const getClientHash = (request) =>
    crypto.createHmac("sha256", MASTER_SECRET).update(getClientAddress(request)).digest("hex");

// Reports whether this client is currently locked out of a transfer
export const checkTransferLockout = async (transferId, clientHash) => {
    const record = await TransferAccessAttempt.findOne({ transfer: transferId, clientHash });

    if (!record?.lockedUntil || record.lockedUntil <= new Date()) {
        return { isLocked: false, minutesLeft: 0 };
    }

    return {
        isLocked: true,
        minutesLeft: Math.ceil((record.lockedUntil.getTime() - Date.now()) / 60000),
    };
};

// Counts a wrong password and locks the client out once the limit is reached
export const registerFailedAttempt = async (transferId, clientHash) => {
    const now = new Date();

    const record = await TransferAccessAttempt.findOneAndUpdate(
        { transfer: transferId, clientHash },
        { $inc: { failedAttempts: 1 }, $set: { lastAttemptAt: now } },
        { new: true, upsert: true }
    );

    if (record.failedAttempts < TRANSFER_MAX_PASSWORD_ATTEMPTS) {
        return { isLocked: false, attemptsLeft: TRANSFER_MAX_PASSWORD_ATTEMPTS - record.failedAttempts };
    }

    // The counter resets with the lock, so the next wrong password starts a fresh run
    record.failedAttempts = 0;
    record.lockedUntil = new Date(now.getTime() + TRANSFER_LOCKOUT_MINUTES * 60000);
    await record.save();

    return { isLocked: true, minutesLeft: TRANSFER_LOCKOUT_MINUTES };
};

// Clears the counter once the right password is entered
export const clearFailedAttempts = async (transferId, clientHash) => {
    await TransferAccessAttempt.deleteOne({ transfer: transferId, clientHash });
};