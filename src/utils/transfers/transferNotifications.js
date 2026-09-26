import User from "@/models/User";
import Transfer from "@/models/Transfer";
import { sendTransferEmail } from "@/lib/emailService";
import { formatDate } from "@/utils/transfers/formatDates";

// Escapes text before it is placed inside email HTML
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[char]));

// Links in emails must use the public URL, which the download route cannot infer from its own origin
const getAppOrigin = () =>
    (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");

// Tells the sender their transfer was collected, once per transfer rather than per file
export const notifyFirstDownload = async (transfer) => {
    // Claimed atomically so simultaneous downloads cannot both send the email
    const claimed = await Transfer.findOneAndUpdate(
        { _id: transfer._id, firstDownloadedAt: null },
        { $set: { firstDownloadedAt: new Date() } }
    );

    if (!claimed) return;

    const owner = await User.findById(transfer.owner).select("name email");
    if (!owner?.email) return;

    const detailsUrl = `${getAppOrigin()}/transfer/${transfer._id}`;
    const safeName = escapeHtml(transfer.groupName);

    await sendTransferEmail({
        to: owner.email,
        subject: `Your transfer "${transfer.groupName}" was downloaded`,
        html: `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#F6F6F7;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #ECECEE;border-radius:12px;">
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 4px;font-size:13px;color:#737379;">NexFile transfer</p>
                <h1 style="margin:0 0 12px;font-size:18px;color:#2E2E37;">Your files were downloaded</h1>
                <p dir="auto" style="margin:0 0 4px;font-size:14px;font-weight:600;color:#2E2E37;">${safeName}</p>
                <p style="margin:0 0 20px;font-size:13px;color:#737379;">First downloaded on ${formatDate(new Date())}. The link stays active until ${formatDate(transfer.expirationDate)}.</p>
                <a href="${detailsUrl}" style="display:inline-block;padding:11px 22px;background:#4C3CC6;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">View transfer</a>
                <p style="margin:16px 0 0;font-size:12px;color:#737379;">You can end the transfer early from that page if you no longer want it available.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
        text: [
            "Your files were downloaded.",
            transfer.groupName,
            `First downloaded on ${formatDate(new Date())}. The link stays active until ${formatDate(transfer.expirationDate)}.`,
            `View transfer: ${detailsUrl}`,
        ].join("\n\n"),
    });
};