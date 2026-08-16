import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  setAuthCookies,
  limitUserTokens,
  cleanupExpiredTokens,
} from "@/utils/auth/tokenManager";
import {
  CHALLENGE_COOKIE_NAME,
  verifyChallengeToken,
  clearChallengeCookie,
  decryptSecret,
  verifyTotpCode,
  looksLikeBackupCode,
  findUnusedBackupCode,
  isLockedOut,
  lockoutSecondsLeft,
  registerFailedAttempt,
  clearFailedAttempts,
} from "@/utils/auth/twoFactor";

// POST /api/auth/two-factor/challenge
// body: { code }  — accepts a 6-digit TOTP code or a single-use backup code
export async function POST(request) {
  try {
    await connectDB();

    const challengeToken = request.cookies.get(CHALLENGE_COOKIE_NAME)?.value;
    const payload = verifyChallengeToken(challengeToken);

    if (!payload?.userId) {
      return clearChallengeCookie(
        NextResponse.json(
          {
            success: false,
            message: "Verification expired. Please sign in again.",
            code: "CHALLENGE_EXPIRED",
          },
          { status: 401 }
        )
      );
    }

    const { code } = await request.json();

    const user = await User.findById(payload.userId).select(
      "+twoFactorSecret +twoFactorBackupCodes +twoFactorLastCounter +twoFactorFailedAttempts +twoFactorLockedUntil"
    );

    if (!user || !user.twoFactorEnabled) {
      return clearChallengeCookie(
        NextResponse.json(
          { success: false, message: "Verification is no longer required" },
          { status: 400 }
        )
      );
    }

    if (isLockedOut(user)) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many attempts. Try again in ${Math.ceil(lockoutSecondsLeft(user) / 60)} minutes.`,
        },
        { status: 429 }
      );
    }

    let verified = false;
    let usedBackupCode = false;

    if (looksLikeBackupCode(code)) {
      const index = findUnusedBackupCode(user, code);

      if (index !== -1) {
        // Burn the code immediately so it cannot be replayed.
        user.twoFactorBackupCodes[index].usedAt = new Date();
        user.markModified("twoFactorBackupCodes");
        verified = true;
        usedBackupCode = true;
      }
    } else {
      const secret = decryptSecret(user.twoFactorSecret);

      if (secret) {
        const result = verifyTotpCode(secret, user.email, code);

        // Reject a code that was already accepted, even inside its window.
        const isReplay =
          result.valid &&
          user.twoFactorLastCounter !== null &&
          result.counter <= user.twoFactorLastCounter;

        if (result.valid && !isReplay) {
          user.twoFactorLastCounter = result.counter;
          verified = true;
        }
      }
    }

    if (!verified) {
      await registerFailedAttempt(user);
      return NextResponse.json(
        { success: false, message: "Incorrect verification code" },
        { status: 401 }
      );
    }

    await user.save();
    await clearFailedAttempts(user);

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

    const remainingBackupCodes = (user.twoFactorBackupCodes || []).filter(
      (entry) => !entry.usedAt
    ).length;

    let response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        usedBackupCode,
        remainingBackupCodes,
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
    return clearChallengeCookie(response);
  } catch (error) {
    console.error("Two-factor challenge error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}