import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { verifyPassword } from "@/utils/auth/hashPassword";
import { generateBackupCodes } from "@/utils/auth/twoFactor";
import User from "@/models/User";

// POST /api/auth/two-factor/backup-codes
// body: { password }
// Replaces every existing code with a fresh set.
export async function POST(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { password } = await request.json();

    const user = await User.findById(userId).select(
      "+twoFactorBackupCodes password twoFactorEnabled"
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

    if (!password || !user.password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    const { plainCodes, hashedCodes } = generateBackupCodes();

    user.twoFactorBackupCodes = hashedCodes;
    await user.save();

    return NextResponse.json(
      { success: true, backupCodes: plainCodes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Regenerate backup codes error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to regenerate backup codes" },
      { status: 500 }
    );
  }
}