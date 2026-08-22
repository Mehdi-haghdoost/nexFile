import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { verifyPassword } from "@/utils/auth/hashPassword";
import { sendTwoFactorDisabledEmail } from "@/lib/emailService";
import {
  isLockedOut,
  lockoutSecondsLeft,
  registerFailedAttempt,
  clearFailedAttempts,
} from "@/utils/auth/twoFactor";
import User from "@/models/User";

// POST /api/auth/two-factor/disable
// body: { password }
// Requires the account password so a hijacked session cannot remove 2FA alone.
export async function POST(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { password } = await request.json();

    // email is listed explicitly: mixing plain field names with + prefixed
    // ones makes the projection inclusive, which would otherwise drop it.
    const user = await User.findById(userId).select(
      "+twoFactorSecret +twoFactorBackupCodes +twoFactorFailedAttempts +twoFactorLockedUntil +twoFactorLastCounter password email twoFactorEnabled"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, message: "Two-step verification is not enabled" },
        { status: 400 }
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

    if (!user.password) {
      return NextResponse.json(
        { success: false, message: "Set an account password before changing this setting" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      await registerFailedAttempt(user);
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorPendingSecret = null;
    user.twoFactorPendingCreatedAt = null;
    user.twoFactorBackupCodes = [];
    user.twoFactorLastCounter = null;
    user.twoFactorEnabledAt = null;
    await user.save();

    await clearFailedAttempts(user);

    // Losing a second factor is worth telling the account owner about
    sendTwoFactorDisabledEmail(user.email);

    return NextResponse.json(
      { success: true, message: "Two-step verification disabled" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Two-factor disable error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to disable two-step verification" },
      { status: 500 }
    );
  }
}