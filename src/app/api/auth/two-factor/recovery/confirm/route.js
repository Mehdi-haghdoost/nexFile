import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import TwoFactorRecovery from "@/models/TwoFactorRecovery";
import { revokeAllUserTokens } from "@/utils/auth/tokenManager";
import { clearChallengeCookie } from "@/utils/auth/twoFactor";
import { sendTwoFactorDisabledEmail } from "@/lib/emailService";

// POST /api/auth/two-factor/recovery/confirm
// body: { token }
export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Recovery token is required" },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const recovery = await TwoFactorRecovery.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!recovery) {
      return NextResponse.json(
        { success: false, message: "This recovery link is invalid or has expired" },
        { status: 400 }
      );
    }

    const user = await User.findById(recovery.userId).select(
      "+twoFactorSecret +twoFactorBackupCodes +twoFactorLastCounter +twoFactorFailedAttempts +twoFactorLockedUntil"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorPendingSecret = null;
    user.twoFactorPendingCreatedAt = null;
    user.twoFactorBackupCodes = [];
    user.twoFactorLastCounter = null;
    user.twoFactorEnabledAt = null;
    user.twoFactorFailedAttempts = 0;
    user.twoFactorLockedUntil = null;
    await user.save();

    recovery.isUsed = true;
    await recovery.save();

    // Recovery implies the account may be contested, so end every session.
    await revokeAllUserTokens(user._id);

    sendTwoFactorDisabledEmail(user.email);

    const response = NextResponse.json(
      {
        success: true,
        message: "Two-step verification has been turned off. You can sign in with your password.",
      },
      { status: 200 }
    );

    return clearChallengeCookie(response);
  } catch (error) {
    console.error("Two-factor recovery confirm error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to complete recovery" },
      { status: 500 }
    );
  }
}