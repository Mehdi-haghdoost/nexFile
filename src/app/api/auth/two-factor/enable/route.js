import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUserOrEnrolment } from "@/utils/auth/requireUser";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  setAuthCookies,
  limitUserTokens,
  cleanupExpiredTokens,
} from "@/utils/auth/tokenManager";
import {
  decryptSecret,
  verifyTotpCode,
  generateBackupCodes,
  isLockedOut,
  lockoutSecondsLeft,
  registerFailedAttempt,
  clearFailedAttempts,
  clearChallengeCookie,
  PENDING_SETUP_TTL_MINUTES,
} from "@/utils/auth/twoFactor";
import User from "@/models/User";
import { sendTwoFactorEnabledEmail } from "@/lib/emailService";

// POST /api/auth/two-factor/enable
// body: { code }
export async function POST(request) {
  try {
    await connectDB();

    const { userId, isEnrolment, response } = requireUserOrEnrolment(request);
    if (response) return response;

    const { code } = await request.json();

    const user = await User.findById(userId).select(
      "+twoFactorPendingSecret +twoFactorPendingCreatedAt +twoFactorSecret +twoFactorBackupCodes +twoFactorFailedAttempts +twoFactorLockedUntil +twoFactorLastCounter email twoFactorEnabled"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
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

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, message: "Two-step verification is already enabled" },
        { status: 400 }
      );
    }

    if (!user.twoFactorPendingSecret) {
      return NextResponse.json(
        { success: false, message: "No setup in progress. Start again." },
        { status: 400 }
      );
    }

    const startedAt = user.twoFactorPendingCreatedAt?.getTime() || 0;
    const expired = Date.now() - startedAt > PENDING_SETUP_TTL_MINUTES * 60 * 1000;

    if (expired) {
      user.twoFactorPendingSecret = null;
      user.twoFactorPendingCreatedAt = null;
      await user.save();

      return NextResponse.json(
        { success: false, message: "Setup expired. Start again." },
        { status: 400 }
      );
    }

    const secret = decryptSecret(user.twoFactorPendingSecret);
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Setup data is unreadable. Start again." },
        { status: 400 }
      );
    }

    const { valid, counter } = verifyTotpCode(secret, user.email, code);

    if (!valid) {
      await registerFailedAttempt(user);
      return NextResponse.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }

    const { plainCodes, hashedCodes } = generateBackupCodes();

    user.twoFactorSecret = user.twoFactorPendingSecret;
    user.twoFactorPendingSecret = null;
    user.twoFactorPendingCreatedAt = null;
    user.twoFactorEnabled = true;
    user.twoFactorEnabledAt = new Date();
    user.twoFactorBackupCodes = hashedCodes;
    user.twoFactorLastCounter = counter;
    await user.save();

    await clearFailedAttempts(user);

    // Not awaited: a mail failure must not stop the user enabling protection
    sendTwoFactorEnabledEmail(user.email);

    const body = {
      success: true,
      message: "Two-step verification enabled",
      // Shown once and never retrievable again.
      backupCodes: plainCodes,
    };

    // An already signed-in user just gained a second factor and keeps their
    // session. An enrolling member had none, so this is where it is issued.
    if (!isEnrolment) {
      return NextResponse.json(body, { status: 200 });
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

    let enrolResponse = NextResponse.json(
      {
        ...body,
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

    enrolResponse = setAuthCookies(enrolResponse, accessToken, refreshToken);
    return clearChallengeCookie(enrolResponse);
  } catch (error) {
    console.error("Two-factor enable error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to enable two-step verification" },
      { status: 500 }
    );
  }
}