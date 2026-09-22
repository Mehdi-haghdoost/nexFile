import { formatBytes } from '@/utils/transfers/formatBytes';
import { formatDate } from '@/utils/transfers/formatDates';

// Escapes text before it is placed inside email HTML
const escapeHtml = (value = '') =>
    String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[char]));

// Removes line breaks so a value cannot add lines to a mail header
const toHeaderText = (value = '') => String(value).replace(/[\r\n]+/g, ' ').trim();

// Builds the subject, HTML and plain-text bodies for a transfer notification
export const buildTransferEmail = ({
    senderName,
    groupName,
    filesCount,
    totalSize,
    expirationDate,
    link,
    message,
    isPasswordEnabled,
}) => {
    const name = toHeaderText(senderName) || 'Someone';
    const fileLabel = filesCount === 1 ? '1 file' : `${filesCount} files`;
    const details = `${fileLabel} · ${formatBytes(totalSize)} · available until ${formatDate(expirationDate)}`;

    // The password itself is never emailed, only the fact that one is needed
    const passwordNote = isPasswordEnabled
        ? 'This transfer is password protected. The sender will share the password with you separately.'
        : '';

    const subject = `${name} sent you ${fileLabel} via NexFile`;

    const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#F6F6F7;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #ECECEE;border-radius:12px;">
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 4px;font-size:13px;color:#737379;">NexFile transfer</p>
                <h1 dir="auto" style="margin:0 0 12px;font-size:18px;color:#2E2E37;">${escapeHtml(name)} sent you ${fileLabel}</h1>
                <p dir="auto" style="margin:0 0 4px;font-size:14px;font-weight:600;color:#2E2E37;">${escapeHtml(groupName)}</p>
                <p style="margin:0 0 20px;font-size:13px;color:#737379;">${escapeHtml(details)}</p>
                ${message ? `<div dir="auto" style="margin:0 0 20px;padding:12px 14px;background:#F6F6F7;border-radius:8px;font-size:14px;color:#2E2E37;white-space:pre-line;">${escapeHtml(message)}</div>` : ''}
                <a href="${escapeHtml(link)}" style="display:inline-block;padding:11px 22px;background:#4C3CC6;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Download files</a>
                ${passwordNote ? `<p style="margin:16px 0 0;font-size:12px;color:#737379;">${passwordNote}</p>` : ''}
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:11px;color:#9F9FA3;">You received this because ${escapeHtml(name)} shared files with you on NexFile.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const text = [
        `${name} sent you ${fileLabel} via NexFile.`,
        groupName,
        details,
        message,
        `Download: ${link}`,
        passwordNote,
    ].filter(Boolean).join('\n\n');

    return { subject, html, text };
};