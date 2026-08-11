import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth/tokenManager";

/**
 * Resolve the caller from the access token cookie.
 * @returns {{ userId: string|null, response: NextResponse|null }} response is
 *   non-null when the caller is not authenticated and should be returned as-is.
 */
export const requireUser = (request) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      userId: null,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyAccessToken(token);

  if (!decoded?.userId) {
    return {
      userId: null,
      response: NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      ),
    };
  }

  return { userId: decoded.userId, response: null };
};