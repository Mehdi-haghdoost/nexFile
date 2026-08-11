import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import {
  decryptSecret,
  verifyTotpCode,
  generateBackupCodes,
  isLockedOut,
  lockoutSecondsLeft,
  registerFailedAttempt,
  clearFailedAttempts,
  PENDING_SETUP_TTL_MINUTES,
} from "@/utils/auth/twoFactor";
import User from "@/models/User";

// POST /api/auth/two-factor/enable
// body: { code }
export async function POST(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
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

    return NextResponse.json(
      {
        success: true,
        message: "Two-step verification enabled",
        // Shown once and never retrievable again.
        backupCodes: plainCodes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Two-factor enable error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to enable two-step verification" },
      { status: 500 }
    );
  }
}