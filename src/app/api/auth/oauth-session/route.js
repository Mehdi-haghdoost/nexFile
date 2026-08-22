import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { OrganizationService } from "@/utils/admin/organizationService";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  setAuthCookies,
  limitUserTokens,
  cleanupExpiredTokens,
} from "@/utils/auth/tokenManager";
import {
  generateChallengeToken,
  setChallengeCookie,
  clearChallengeCookie,
  CHALLENGE_PURPOSES,
} from "@/utils/auth/twoFactor";

/**
 * POST /api/auth/oauth-session
 *
 * Exchanges a completed NextAuth sign-in for the app's own session cookies.
 * Without this step a Google user reaches /home with no token cookie and is
 * bounced straight back to login by the middleware.
 */
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "No active provider session" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Social sign-in is not a bypass: an account with two-step verification
    // still has to present a code before any session cookie is issued.
    if (user.twoFactorEnabled) {
      const challengeResponse = NextResponse.json(
        { success: true, requiresTwoFactor: true },
        { status: 200 }
      );

      return setChallengeCookie(
        challengeResponse,
        generateChallengeToken(user._id.toString(), CHALLENGE_PURPOSES.LOGIN)
      );
    }

    // The organization requires enrolment and this account has none yet.
    const mustEnrol = await OrganizationService.requiresTwoFactor(user._id);

    if (mustEnrol) {
      const enrolResponse = NextResponse.json(
        { success: true, requiresTwoFactorSetup: true },
        { status: 200 }
      );

      return setChallengeCookie(
        enrolResponse,
        generateChallengeToken(user._id.toString(), CHALLENGE_PURPOSES.ENROLMENT)
      );
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    await saveRefreshToken(user._id, refreshToken);
    await cleanupExpiredTokens(user._id);
    await limitUserTokens(user._id, 5);

    let response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      },
      { status: 200 }
    );

    response = setAuthCookies(response, accessToken, refreshToken);

    // Drop any challenge left over from an abandoned attempt.
    return clearChallengeCookie(response);
  } catch (error) {
    console.error("OAuth session error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to complete sign-in" },
      { status: 500 }
    );
  }
}