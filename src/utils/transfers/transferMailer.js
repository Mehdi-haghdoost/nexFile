import { sendTransferEmail } from "@/lib/emailService";
import { buildTransferEmail } from "@/utils/transfers/transferEmailTemplate";

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

    // Sequential because the shared transport is not pooled, and Gmail refuses too many simultaneous connections
    for (const to of emails) {
        const outcome = await sendTransferEmail({ to, replyTo: sender?.email, ...content });

        results.push({
            email: to,
            status: outcome.success ? "sent" : "failed",
            sentAt: outcome.success ? new Date() : null,
            failureCode: outcome.success ? null : outcome.code || "UNKNOWN",
        });
    }

    return results;
};