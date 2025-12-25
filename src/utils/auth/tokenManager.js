import jwt from "jsonwebtoken";
import RefreshToken from "@/models/RefreshToken";

const ACCESS_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";
const REFRESH_TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

const ACCESS_TOKEN_EXPIRY = "1h";
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
  response.cookies.set("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
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