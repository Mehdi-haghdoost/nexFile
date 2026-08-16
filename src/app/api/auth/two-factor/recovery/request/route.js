import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import TwoFactorRecovery from "@/models/TwoFactorRecovery";
import { sendTwoFactorRecoveryEmail } from "@/lib/emailService";
import {
  CHALLENGE_COOKIE_NAME,
  verifyChallengeToken,
  RECOVERY_TTL_MINUTES,
} from "@/utils/auth/twoFactor";

// POST /api/auth/two-factor/recovery/request
// Requires a valid challenge cookie, so only someone who already passed the
// password step can trigger a recovery email.
export async function POST(request) {
  try {
    await connectDB();

    const challengeToken = request.cookies.get(CHALLENGE_COOKIE_NAME)?.value;
    const payload = verifyChallengeToken(challengeToken);

    if (!payload?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification expired. Please sign in again.",
          code: "CHALLENGE_EXPIRED",
        },
        { status: 401 }
      );
    }

    const user = await User.findById(payload.userId).select("email twoFactorEnabled");

    // Nothing to recover. The caller already proved the password, so there is
    // no account to probe for here.
    if (!user || !user.twoFactorEnabled) {
      return NextResponse.json(
        {
          success: true,
          message: "If the account needs recovery, an email has been sent.",
        },
        { status: 200 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // One live recovery link per user.
    await TwoFactorRecovery.deleteMany({ userId: user._id });

    await TwoFactorRecovery.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + RECOVERY_TTL_MINUTES * 60 * 1000),
      isUsed: false,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const recoveryUrl = `${baseUrl}/login-register?step=recovery&token=${rawToken}`;

    const emailResult = await sendTwoFactorRecoveryEmail(
      user.email,
      recoveryUrl,
      RECOVERY_TTL_MINUTES
    );

    if (!emailResult.success) {
      // Drop the token. A live link that disables two-step verification while
      // nobody knows it exists is worse than making the user try again.
      await TwoFactorRecovery.deleteMany({ userId: user._id });

      if (process.env.NODE_ENV === "development") {
        console.warn("Recovery email failed:", emailResult.code, emailResult.error);
      }

      return NextResponse.json(
        {
          success: false,
          message: "We couldn't send the recovery email. Please try again shortly.",
          code: "EMAIL_FAILED",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "If the account needs recovery, an email has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Two-factor recovery request error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send recovery email" },
      { status: 500 }
    );
  }
}