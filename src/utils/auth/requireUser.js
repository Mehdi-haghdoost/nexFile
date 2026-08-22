import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import {
  CHALLENGE_COOKIE_NAME,
  CHALLENGE_PURPOSES,
  verifyChallengeToken,
} from "@/utils/auth/twoFactor";

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

/**
 * Like requireUser, but also accepts an enrolment challenge token.
 *
 * A user whose organization demands two-step verification has no session yet,
 * so the setup endpoints must be reachable without one. The enrolment flag
 * tells the caller which path was taken.
 *
 * @returns {{ userId: string|null, isEnrolment: boolean, response: NextResponse|null }}
 */
export const requireUserOrEnrolment = (request) => {
  const accessToken = request.cookies.get("token")?.value;
  const decoded = accessToken ? verifyAccessToken(accessToken) : null;

  if (decoded?.userId) {
    return { userId: decoded.userId, isEnrolment: false, response: null };
  }

  const challengeToken = request.cookies.get(CHALLENGE_COOKIE_NAME)?.value;
  const challenge = verifyChallengeToken(challengeToken, CHALLENGE_PURPOSES.ENROLMENT);

  if (challenge?.userId) {
    return { userId: challenge.userId, isEnrolment: true, response: null };
  }

  return {
    userId: null,
    isEnrolment: false,
    response: NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    ),
  };
};