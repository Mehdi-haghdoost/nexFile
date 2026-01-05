// import jwt from "jsonwebtoken";
// import RefreshToken from "@/models/RefreshToken";

// const ACCESS_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";
// const REFRESH_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

// const ACCESS_TOKEN_EXPIRY = "15m";
// const REFRESH_TOKEN_EXPIRY = "30d";

// export const generateAccessToken = (payload) => {
//   return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
//     expiresIn: ACCESS_TOKEN_EXPIRY,
//   });
// };

// export const generateRefreshToken = (payload) => {
//   return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
//     expiresIn: REFRESH_TOKEN_EXPIRY,
//   });
// };

// export const verifyAccessToken = (token) => {
//   try {
//     return jwt.verify(token, ACCESS_TOKEN_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

// export const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, REFRESH_TOKEN_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

// export const setAuthCookies = (response, accessToken, refreshToken) => {
//   const isProduction = process.env.NODE_ENV === "production";

//   const cookieOptions = {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "strict" : "lax",
//     path: "/",
//   };

//   response.cookies.set("token", accessToken, {
//     ...cookieOptions,
//     maxAge: 15 * 60,
//   });

//   response.cookies.set("refreshToken", refreshToken, {
//     ...cookieOptions,
//     maxAge: 30 * 24 * 60 * 60,
//   });

//   return response;
// };

// export const clearAuthCookies = (response) => {
//   response.cookies.delete("token");
//   response.cookies.delete("refreshToken");
//   return response;
// };

// export const saveRefreshToken = async (userId, token) => {
//   const expiresAt = new Date();
//   expiresAt.setDate(expiresAt.getDate() + 30);

//   await RefreshToken.create({
//     userId,
//     token,
//     expiresAt,
//     isRevoked: false,
//   });
// };

// export const findRefreshToken = async (token) => {
//   return await RefreshToken.findOne({
//     token,
//     isRevoked: false,
//     expiresAt: { $gt: new Date() },
//   }).populate('userId', 'name email role image emailVerified');
// };

// export const revokeRefreshToken = async (token) => {
//   await RefreshToken.updateOne(
//     { token },
//     { isRevoked: true }
//   );
// };

// export const revokeAllUserTokens = async (userId) => {
//   await RefreshToken.updateMany(
//     { userId, isRevoked: false },
//     { isRevoked: true }
//   );
// };

// export const cleanupExpiredTokens = async (userId) => {
//   const result = await RefreshToken.deleteMany({
//     userId,
//     $or: [
//       { isRevoked: true },
//       { expiresAt: { $lt: new Date() } }
//     ]
//   });

//   return result;
// };

import jwt from "jsonwebtoken";
import RefreshToken from "@/models/RefreshToken";

const ACCESS_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";
const REFRESH_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

// Production values
const ACCESS_TOKEN_EXPIRY = "15m";  // 15 minutes
const REFRESH_TOKEN_EXPIRY = "30d";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const setAuthCookies = (response, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
  };

// Cookie maxAge
  response.cookies.set("token", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60,  // 15 minutes
  });

  response.cookies.set("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
};

export const clearAuthCookies = (response) => {
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  return response;
};

export const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
    isRevoked: false,
  });
};

export const findRefreshToken = async (token) => {
  return await RefreshToken.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).populate('userId', 'name email role image emailVerified');
};

export const revokeRefreshToken = async (token) => {
  await RefreshToken.updateOne(
    { token },
    { isRevoked: true }
  );
};

export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

/**
 * Clean up expired and revoked tokens for all users
 * @param {string} userId - Optional: Clean tokens for specific user only
 * @returns {Promise<{deletedCount: number}>}
 */
export const cleanupExpiredTokens = async (userId = null) => {
  const query = {
    $or: [
      { isRevoked: true },
      { expiresAt: { $lt: new Date() } }
    ]
  };

  if (userId) {
    query.userId = userId;
  }

  const result = await RefreshToken.deleteMany(query);
  return result;
};

/**
 * Clean up old tokens for a specific user
 * Keeps only the latest valid token and removes all others
 * @param {string} userId - User ID to clean tokens for
 * @returns {Promise<void>}
 */
export const cleanupUserTokens = async (userId) => {
  // Find the latest valid token for this user
  const latestToken = await RefreshToken.findOne({
    userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (latestToken) {
    // Delete all tokens except the latest one
    await RefreshToken.deleteMany({
      userId,
      _id: { $ne: latestToken._id },
      $or: [
        { isRevoked: true },
        { expiresAt: { $lt: new Date() } }
      ]
    });
  }
};

/**
 * Limit number of tokens per user
 * Keeps only the N most recent tokens
 * @param {string} userId - User ID to limit tokens for
 * @param {number} maxTokens - Maximum number of tokens to keep (default: 5)
 * @returns {Promise<void>}
 */
export const limitUserTokens = async (userId, maxTokens = 5) => {
  const tokens = await RefreshToken.find({ userId })
    .sort({ createdAt: -1 })
    .limit(maxTokens);

  const tokenIds = tokens.map(t => t._id);

  // Delete all tokens except the N most recent ones
  await RefreshToken.deleteMany({
    userId,
    _id: { $nin: tokenIds }
  });
};