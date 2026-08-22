import { NextResponse } from "next/server";
import QRCode from "qrcode";
import connectDB from "@/lib/mongodb";
import { requireUserOrEnrolment } from "@/utils/auth/requireUser";
import {
  generateTotpSecret,
  buildOtpAuthUri,
  encryptSecret,
} from "@/utils/auth/twoFactor";
import User from "@/models/User";

// POST /api/auth/two-factor/setup
// Issues a pending secret and the QR payload. Nothing is enabled until the
// user confirms a code through /two-factor/enable.
export async function POST(request) {
  try {
    await connectDB();

    // Accepts an enrolment token too, so a member forced to enroll can reach
    // this endpoint without a session.
    const { userId, response } = requireUserOrEnrolment(request);
    if (response) return response;

    const user = await User.findById(userId).select("+twoFactorPendingSecret email twoFactorEnabled");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, message: "Two-step verification is already enabled" },
        { status: 400 }
      );
    }

    // A fresh secret each time, so an abandoned setup can never be resumed.
    const secret = generateTotpSecret();
    const otpAuthUri = buildOtpAuthUri(secret, user.email);

    user.twoFactorPendingSecret = encryptSecret(secret);
    user.twoFactorPendingCreatedAt = new Date();
    await user.save();

    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUri, {
      width: 240,
      margin: 1,
    });

    return NextResponse.json(
      {
        success: true,
        // manualKey lets users who cannot scan type the secret instead.
        manualKey: secret,
        otpAuthUri,
        qrCodeDataUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Two-factor setup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to start two-step verification setup" },
      { status: 500 }
    );
  }
}