import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth/hashPassword";
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
import { loginSchema } from "@/utils/auth/validators";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    try {
      loginSchema.parse(body);
    } catch (error) {
      const formattedErrors = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
      }

      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: formattedErrors,
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Accounts created through Google have no local password
    if (!user.password) {
      return NextResponse.json(
        {
          message:
            "This account uses Google login. Please sign in with Google.",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    /**
     * With two-step verification on, the password alone earns only a short
     * challenge token. No session cookies are issued until a code is accepted,
     * so a stolen password cannot reach the account on its own.
     */
    if (user.twoFactorEnabled) {
      const challengeResponse = NextResponse.json(
        {
          message: "Two-step verification required",
          requiresTwoFactor: true,
        },
        { status: 200 }
      );

      return setChallengeCookie(
        challengeResponse,
        generateChallengeToken(user._id.toString(), CHALLENGE_PURPOSES.LOGIN)
      );
    }

    /**
     * The organization demands two-step verification but this account has none.
     * An enrolment token unlocks only the setup endpoints, so the member can
     * enroll without holding a session that bypasses the policy.
     */
    const mustEnrol = await OrganizationService.requiresTwoFactor(user._id);

    if (mustEnrol) {
      const enrolResponse = NextResponse.json(
        {
          message: "Two-step verification setup required",
          requiresTwoFactorSetup: true,
        },
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

    // Housekeeping: drop stale records and cap concurrent sessions per user.
    await cleanupExpiredTokens(user._id);
    await limitUserTokens(user._id, 5);

    let response = NextResponse.json(
      {
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
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}