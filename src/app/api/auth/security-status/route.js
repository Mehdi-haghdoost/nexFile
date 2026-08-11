import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import User from "@/models/User";

// GET /api/auth/security-status
// Personal security state for the current user.
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const user = await User.findById(userId)
      .select("+twoFactorBackupCodes password twoFactorEnabled twoFactorEnabledAt passwordUpdatedAt")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const unusedBackupCodes = (user.twoFactorBackupCodes || []).filter(
      (entry) => !entry.usedAt
    ).length;

    return NextResponse.json(
      {
        success: true,
        security: {
          hasPassword: Boolean(user.password),
          passwordUpdatedAt: user.passwordUpdatedAt || null,
          twoStepVerification: Boolean(user.twoFactorEnabled),
          twoFactorEnabledAt: user.twoFactorEnabledAt || null,
          unusedBackupCodes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Security status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load security status" },
      { status: 500 }
    );
  }
}