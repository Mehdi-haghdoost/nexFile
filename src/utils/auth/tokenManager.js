import jwt from "jsonwebtoken";
import RefreshToken from "@/models/RefreshToken";

// Single source of truth for lifetimes, in SECONDS.
// Both JWT expiresIn and cookie maxAge derive from these.
export const ACCESS_TOKEN_TTL = Number(process.env.ACCESS_TOKEN_TTL) || 15 * 60;
export const REFRESH_TOKEN_TTL =
  Number(process.env.REFRESH_TOKEN_TTL) || 30 * 24 * 60 * 60;

// Window during which an already-rotated token is still accepted,
// so concurrent requests don't log the user out.
export const REFRESH_GRACE_PERIOD = Number(process.env.REFRESH_GRACE_PERIOD) || 60;

// Guards against clock drift deleting the cookie before the JWT expires.
const COOKIE_SKEW_BUFFER = 60;

const DEV_FALLBACK_SECRET = "nexfile-dev-secret-key-2024-change-in-production";

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET is required in production.");
}

const TOKEN_SECRET = process.env.NEXTAUTH_SECRET || DEV_FALLBACK_SECRET;

/* -------------------------------------------------------------------------- */
/* Generation                                                                  */
/* -------------------------------------------------------------------------- */

export const generateAccessToken = (payload) =>
  jwt.sign({ ...payload, type: "access" }, TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });

export const generateRefreshToken = (payload) =>
  jwt.sign({ ...payload, type: "refresh" }, TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });

/* -------------------------------------------------------------------------- */
/* Verification                                                                */
/* -------------------------------------------------------------------------- */

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch {
    return null;
  }
};

// Distinguishes "expired" (normal) from "invalid signature" (suspicious).
export const inspectToken = (token) => {
  if (!token) {
    return { valid: false, expired: false, reason: "missing", payload: null };
  }

  try {
    const payload = jwt.verify(token, TOKEN_SECRET);
    return { valid: true, expired: false, reason: null, payload };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, expired: true, reason: "expired", payload: jwt.decode(token) };
    }
    return { valid: false, expired: false, reason: "invalid", payload: null };
  }
};

/* -------------------------------------------------------------------------- */
/* Cookies                                                                     */
/* -------------------------------------------------------------------------- */

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // "lax" keeps OAuth callback navigations working.
  sameSite: "lax",
  path: "/",
});

export const setAuthCookies = (response, accessToken, refreshToken) => {
  const cookieOptions = getCookieOptions();

  response.cookies.set("token", accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_TTL + COOKIE_SKEW_BUFFER,
  });

  response.cookies.set("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_TTL,
  });

  return response;
};

export const clearAuthCookies = (response) => {
  const cookieOptions = getCookieOptions();

  // Must reuse the same path/options, otherwise the browser keeps the cookie.
  response.cookies.set("token", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("refreshToken", "", { ...cookieOptions, maxAge: 0 });

  return response;
};

/* -------------------------------------------------------------------------- */
/* Persistence                                                                 */
/* -------------------------------------------------------------------------- */

const USER_POPULATE_FIELDS = "name email role image emailVerified";

// DB expiry is derived from the JWT's own exp claim so they can't disagree.
export const saveRefreshToken = async (userId, token) => {
  const decoded = jwt.decode(token);
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + REFRESH_TOKEN_TTL * 1000);

  return RefreshToken.create({ userId, token, expiresAt, isRevoked: false });
};

export const findRefreshToken = async (token) =>
  RefreshToken.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).populate("userId", USER_POPULATE_FIELDS);

/**
 * Atomically claim a token for rotation. findOneAndUpdate is a single atomic
 * op, so only one concurrent caller can win the race.
 *
 * status: "claimed" | "grace" | "reused" | "expired" | "not_found"
 */
export const claimRefreshToken = async (token) => {
  const now = new Date();

  const claimed = await RefreshToken.findOneAndUpdate(
    { token, isRevoked: false, expiresAt: { $gt: now } },
    { $set: { isRevoked: true, revokedAt: now } },
    { new: true }
  ).populate("userId", USER_POPULATE_FIELDS);

  if (claimed) return { status: "claimed", doc: claimed };

  const existing = await RefreshToken.findOne({ token }).populate(
    "userId",
    USER_POPULATE_FIELDS
  );

  if (!existing) return { status: "not_found", doc: null };
  if (existing.expiresAt <= now) return { status: "expired", doc: existing };

  if (existing.isRevoked) {
    const revokedAt = existing.revokedAt || existing.updatedAt;
    const elapsed = (now.getTime() - new Date(revokedAt).getTime()) / 1000;

    if (existing.replacedByToken && elapsed <= REFRESH_GRACE_PERIOD) {
      return { status: "grace", doc: existing };
    }
    return { status: "reused", doc: existing };
  }

  return { status: "not_found", doc: existing };
};

// Links old -> new so racing requests inside the grace window can recover.
export const markTokenReplaced = async (oldToken, newToken) => {
  await RefreshToken.updateOne(
    { token: oldToken },
    { $set: { replacedByToken: newToken } }
  );
};

export const revokeRefreshToken = async (token) => {
  await RefreshToken.updateOne(
    { token },
    { $set: { isRevoked: true, revokedAt: new Date() } }
  );
};

/**
 * Hard-delete a token. Used on logout: a revoked-but-present token would be
 * read as reuse by claimRefreshToken and would revoke the user's other devices.
 */
export const deleteRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId, isRevoked: false },
    { $set: { isRevoked: true, revokedAt: new Date() } }
  );
};

/**
 * End every session except the calling one, used after a password change.
 *
 * Records are deleted rather than revoked: a revoked token with no successor
 * is indistinguishable from a stolen one, so those devices would trip the
 * reuse alarm and revoke this session too.
 */
export const revokeOtherUserTokens = async (userId, keepToken) => {
  await RefreshToken.deleteMany({
    userId,
    ...(keepToken ? { token: { $ne: keepToken } } : {}),
  });
};

/* -------------------------------------------------------------------------- */
/* Housekeeping                                                                */
/* -------------------------------------------------------------------------- */

// Recently-revoked tokens are kept so in-flight requests can use the grace path.
export const cleanupExpiredTokens = async (userId = null) => {
  const graceCutoff = new Date(Date.now() - REFRESH_GRACE_PERIOD * 1000);

  const query = {
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isRevoked: true, revokedAt: { $lt: graceCutoff } },
    ],
  };

  if (userId) query.userId = userId;

  return RefreshToken.deleteMany(query);
};

// Caps stored sessions per user.
export const limitUserTokens = async (userId, maxTokens = 5) => {
  const tokens = await RefreshToken.find({ userId })
    .sort({ createdAt: -1 })
    .limit(maxTokens)
    .select("_id");

  const keepIds = tokens.map((t) => t._id);

  await RefreshToken.deleteMany({ userId, _id: { $nin: keepIds } });
};