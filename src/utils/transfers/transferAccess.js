import crypto from "crypto";
import jwt from "jsonwebtoken";
import { TRANSFER_ACCESS_TTL_SECONDS } from "@/utils/constants/transferConstants";

const MASTER_SECRET =
    process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

// Derived key so a transfer access token can never verify as a session token
const ACCESS_KEY = crypto
    .createHash("sha256")
    .update(`${MASTER_SECRET}:transfer-access`)
    .digest();

// Issues a short-lived proof that the password for one transfer was entered
export const signTransferAccess = (transferId) =>
    jwt.sign({ transferId: String(transferId), type: "transfer_access" }, ACCESS_KEY, {
        expiresIn: TRANSFER_ACCESS_TTL_SECONDS,
    });

// Accepts the proof only for the transfer it was issued for
export const verifyTransferAccess = (token, transferId) => {
    if (!token) return false;

    try {
        const payload = jwt.verify(token, ACCESS_KEY);
        return payload.type === "transfer_access" && payload.transferId === String(transferId);
    } catch {
        return false;
    }
};

// Scopes the access cookie to one transfer's public API routes
export const getTransferAccessCookiePath = (token) => `/api/public/transfer/${token}`;

// Lists files for the public page, with download links only once access is granted
export const buildPublicFiles = (transfer, hasAccess) =>
    transfer.files.map((file, index) => ({
        name: file.name,
        extension: file.extension,
        size: file.size,
        downloadUrl: hasAccess
            ? `/api/public/transfer/${transfer.token}/download/${index}`
            : null,
    }));