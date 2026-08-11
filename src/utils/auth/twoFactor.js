import crypto from "crypto";
import * as OTPAuth from "otpauth";

const APP_NAME = "nexFile";

// TOTP secrets are encrypted at rest, so a database dump alone is not enough
// to generate valid codes.
const MASTER_SECRET =
  process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

const PERIOD = 30;
const DIGITS = 6;
// Accepts the previous and next step, covering clock drift between devices.
const VALIDATION_WINDOW = 1;

const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_LENGTH = 10;
// Excludes I, O, 0, 1 to avoid transcription mistakes.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;
// Abandoned setups expire so a stale secret cannot be confirmed later.
export const PENDING_SETUP_TTL_MINUTES = 15;

/* -------------------------------------------------------------------------- */
/* Secret encryption                                                           */
/* -------------------------------------------------------------------------- */

const getEncryptionKey = () =>
  crypto.createHash("sha256").update(MASTER_SECRET).digest();

export const encryptSecret = (plainSecret) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(plainSecret, "utf8"),
    cipher.final(),
  ]);

  return [
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
};

export const decryptSecret = (payload) => {
  if (!payload) return null;

  try {
    const [ivPart, tagPart, dataPart] = payload.split(":");
    if (!ivPart || !tagPart || !dataPart) return null;

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      Buffer.from(ivPart, "base64")
    );
    decipher.setAuthTag(Buffer.from(tagPart, "base64"));

    return Buffer.concat([
      decipher.update(Buffer.from(dataPart, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/* TOTP                                                                        */
/* -------------------------------------------------------------------------- */

export const generateTotpSecret = () =>
  new OTPAuth.Secret({ size: 20 }).base32;

const buildTotp = (base32Secret, email) =>
  new OTPAuth.TOTP({
    issuer: APP_NAME,
    label: email,
    algorithm: "SHA1",
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  });

/** otpauth:// URI that authenticator apps scan. */
export const buildOtpAuthUri = (base32Secret, email) =>
  buildTotp(base32Secret, email).toString();

/**
 * Verify a TOTP code.
 * @returns {{ valid: boolean, counter: number|null }} counter is used by the
 *   caller to reject replay of a code that was already accepted.
 */
export const verifyTotpCode = (base32Secret, email, code) => {
  const normalized = String(code || "").replace(/\s/g, "");

  if (!/^\d{6}$/.test(normalized)) {
    return { valid: false, counter: null };
  }

  const delta = buildTotp(base32Secret, email).validate({
    token: normalized,
    window: VALIDATION_WINDOW,
  });

  if (delta === null) {
    return { valid: false, counter: null };
  }

  const counter = Math.floor(Date.now() / 1000 / PERIOD) + delta;
  return { valid: true, counter };
};

/* -------------------------------------------------------------------------- */
/* Backup codes                                                                */
/* -------------------------------------------------------------------------- */

const randomCode = () => {
  const bytes = crypto.randomBytes(BACKUP_CODE_LENGTH);
  let raw = "";

  for (let i = 0; i < BACKUP_CODE_LENGTH; i += 1) {
    raw += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }

  // Grouped for readability: ABCDE-FGHJK
  return `${raw.slice(0, 5)}-${raw.slice(5)}`;
};

export const normalizeBackupCode = (code) =>
  String(code || "").toUpperCase().replace(/[\s-]/g, "");

/**
 * HMAC rather than a plain hash: without the server secret a leaked database
 * cannot be brute-forced offline. Codes are high-entropy, so bcrypt's cost is
 * unnecessary here and would slow down the login path.
 */
export const hashBackupCode = (code) =>
  crypto
    .createHmac("sha256", MASTER_SECRET)
    .update(normalizeBackupCode(code))
    .digest("hex");

/**
 * @returns {{ plainCodes: string[], hashedCodes: object[] }} plainCodes are
 *   shown to the user exactly once and never stored.
 */
export const generateBackupCodes = () => {
  const plainCodes = Array.from({ length: BACKUP_CODE_COUNT }, randomCode);

  return {
    plainCodes,
    hashedCodes: plainCodes.map((code) => ({
      codeHash: hashBackupCode(code),
      usedAt: null,
    })),
  };
};

/* -------------------------------------------------------------------------- */
/* Lockout helpers                                                             */
/* -------------------------------------------------------------------------- */

export const isLockedOut = (user) =>
  Boolean(user?.twoFactorLockedUntil && user.twoFactorLockedUntil > new Date());

export const lockoutSecondsLeft = (user) => {
  if (!isLockedOut(user)) return 0;
  return Math.ceil((user.twoFactorLockedUntil.getTime() - Date.now()) / 1000);
};

/** Records a failed attempt and locks the account once the limit is hit. */
export const registerFailedAttempt = async (user) => {
  const attempts = (user.twoFactorFailedAttempts || 0) + 1;

  user.twoFactorFailedAttempts = attempts;

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    user.twoFactorLockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
    user.twoFactorFailedAttempts = 0;
  }

  await user.save();
};

export const clearFailedAttempts = async (user) => {
  if (!user.twoFactorFailedAttempts && !user.twoFactorLockedUntil) return;

  user.twoFactorFailedAttempts = 0;
  user.twoFactorLockedUntil = null;
  await user.save();
};