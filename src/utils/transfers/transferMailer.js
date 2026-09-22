import nodemailer from "nodemailer";
import { buildTransferEmail } from "@/utils/transfers/transferEmailTemplate";

let transporter = null;

// Reuses one pooled SMTP transport across requests instead of reconnecting per email
const getTransporter = () => {
    if (transporter) return transporter;

    const port = Number(process.env.SMTP_PORT) || 587;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        pool: true,
        maxConnections: 3,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    return transporter;
};

// Sends one email and reports the outcome instead of throwing, so one bad address cannot fail the batch
const sendOne = async ({ to, replyTo, subject, html, text }) => {
    try {
        await getTransporter().sendMail({
            from: `"NexFile" <${process.env.SMTP_USER}>`,
            to,
            replyTo,
            subject,
            html,
            text,
        });
        return true;
    } catch (error) {
        console.error(`Transfer email to ${to} failed:`, error.message);
        return false;
    }
};

// Emails every recipient separately so no one sees the other addresses
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

    const outcomes = await Promise.all(
        emails.map(async (to) => ({
            email: to,
            ok: await sendOne({ to, replyTo: sender?.email, ...content }),
        }))
    );

    const now = new Date();

    return outcomes.map(({ email, ok }) => ({
        email,
        status: ok ? "sent" : "failed",
        sentAt: ok ? now : null,
    }));
};