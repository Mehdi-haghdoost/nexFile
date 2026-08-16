import nodemailer from "nodemailer";

const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  // Number(), not the raw string: some transports mis-handle "587".
  port: SMTP_PORT,
  // 465 is implicit TLS; 587 upgrades through STARTTLS.
  secure: SMTP_PORT === 465,
  requireTLS: SMTP_PORT !== 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Without these a blocked port hangs the request for minutes.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

/** Checks credentials and connectivity without sending anything. */
export const verifyEmailTransport = async () => {
  try {
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { success: false, code: error.code, error: error.message };
  }
};

// Shared shell so every transactional email looks the same.
const wrapTemplate = (title, bodyHtml) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .container {
        background-color: #f9f9f9;
        border-radius: 10px;
        padding: 30px;
        margin: 20px 0;
      }
      .logo {
        text-align: center;
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        padding: 12px 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #666;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <h1 style="color: #667eea;">NexFile</h1>
      </div>

      <h2>${title}</h2>

      ${bodyHtml}

      <div class="footer">
        <p>© ${new Date().getFullYear()} NexFile. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const send = async (mailOptions) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("Email not sent: SMTP_USER or SMTP_PASS is missing");
    return { success: false, code: "NO_CREDENTIALS", error: "SMTP is not configured" };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // The code separates bad credentials (EAUTH) from a blocked port
    // (ETIMEDOUT), which need very different fixes.
    console.error("Email send error:", error.code, error.message);
    return { success: false, code: error.code, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetUrl) =>
  send({
    from: `"NexFile" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password - NexFile",
    html: wrapTemplate(
      "Reset Your Password",
      `
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `
    ),
  });

export const sendTwoFactorRecoveryEmail = async (email, recoveryUrl, expiryMinutes) =>
  send({
    from: `"NexFile" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Turn off two-step verification - NexFile",
    html: wrapTemplate(
      "Lost access to your authenticator?",
      `
        <p>Hi there,</p>
        <p>Someone signed in with your password and asked to turn off two-step verification on your account. Click the button below to confirm:</p>
        <div style="text-align: center;">
          <a href="${recoveryUrl}" class="button">Turn off two-step verification</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${recoveryUrl}</p>
        <p><strong>This link will expire in ${expiryMinutes} minutes and can be used once.</strong></p>
        <p>Afterwards you can sign in with your password alone, and we recommend setting two-step verification up again straight away.</p>
        <p>If this wasn't you, someone may know your password. Ignore this email and change your password as soon as you can.</p>
      `
    ),
  });