import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import {
  verifyRefreshToken,
  deleteRefreshToken,
  clearAuthCookies,
} from "@/utils/auth/tokenManager";

/** Logout must always succeed from the client's point of view. */
const successResponse = () =>
  clearAuthCookies(
    NextResponse.json({ message: "Logout successful" }, { status: 200 })
  );

export async function POST(req) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      await connectToDB();

      // Delete rather than revoke: a lingering revoked record would be
      // misread as token reuse and kill the user's other sessions.
      if (verifyRefreshToken(refreshToken)) {
        await deleteRefreshToken(refreshToken);
      } else {
        // Malformed or expired token: still remove any stale DB record.
        await deleteRefreshToken(refreshToken);
      }
    }

    return successResponse();
  } catch (error) {
    console.error("Logout error:", error);
    // Cookies are cleared regardless, so the user is never stuck logged in.
    return successResponse();
  }
}