import { sendTransferEmail } from "@/lib/emailService";
import { buildTransferEmail } from "@/utils/transfers/transferEmailTemplate";

// Failures of the mail server itself, which would repeat identically for every remaining address
const TRANSPORT_FAILURE_CODES = new Set([
    "EDNS",
    "ETIMEDOUT",
    "ECONNECTION",
    "ESOCKET",
    "ETLS",
    "EAUTH",
    "NO_CREDENTIALS",
]);

// Emails each address on its own so no one sees the others, through the app's shared transport
export const deliverTransferEmails = async ({ transfer, emails, sender, link }) => {
    const content = buildTransferEmail({
        senderName: sender?.name,
        groupName: transfer.groupName,
        filesCount: transfer.filesCount,
        totalSize: transfer.totalSize,
        expirationDate: transfer.expirationDate,
        link,
        message: transfer.message,
        isPasswordEnabled: transfer.isPasswordEnabled,
    });

    const results = [];
    let transportFailure = null;

    // Sequential because the shared transport is not pooled, and Gmail refuses too many simultaneous connections
    for (const to of emails) {
        // Once the server itself is unreachable, the rest fail at once instead of each waiting out the same timeout
        if (transportFailure) {
            results.push({ email: to, status: "failed", sentAt: null, failureCode: transportFailure });
            continue;
        }

        const outcome = await sendTransferEmail({ to, replyTo: sender?.email, ...content });
        const failureCode = outcome.success ? null : outcome.code || "UNKNOWN";

        if (failureCode && TRANSPORT_FAILURE_CODES.has(failureCode)) {
            transportFailure = failureCode;
        }

        results.push({
            email: to,
            status: outcome.success ? "sent" : "failed",
            sentAt: outcome.success ? new Date() : null,
            failureCode,
        });
    }

    return results;
};