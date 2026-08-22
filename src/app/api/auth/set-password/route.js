import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { hashPassword, verifyPassword } from "@/utils/auth/hashPassword";
import { revokeOtherUserTokens } from "@/utils/auth/tokenManager";
import { validatePassword } from "@/utils/auth/validators";
import { sendPasswordChangedEmail } from "@/lib/emailService";
import User from "@/models/User";

const MAX_PASSWORD_LENGTH = 50;

/** Maps the shared validator's checks to a message, so the rules stay in one place. */
const getPasswordError = (password) => {
  if (!password) return "Password is required";
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`;
  }

  const { isValid, checks } = validatePassword(password);
  if (isValid) return null;

  if (!checks.minLength) return "Password must be at least 8 characters";
  if (!checks.uppercase) return "Password must contain at least one uppercase letter";
  if (!checks.lowercase) return "Password must contain at least one lowercase letter";
  if (!checks.number) return "Password must contain at least one number";
  if (!checks.specialChar) return "Password must contain at least one special character";

  return "Password does not meet the requirements";
};

// POST /api/auth/set-password
// body: { currentPassword?, newPassword, confirmPassword }
export async function POST(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const validationError = getPasswordError(newPassword);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    // email is listed explicitly: naming fields without a + makes the
    // projection inclusive, which would otherwise drop it.
    const user = await User.findById(userId).select("password email");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Accounts created through Google start without a password, so the current
    // password is only required when one already exists.
    const hasExistingPassword = Boolean(user.password);

    if (hasExistingPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "Current password is required" },
          { status: 400 }
        );
      }

      const isCurrentValid = await verifyPassword(currentPassword, user.password);
      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect" },
          { status: 401 }
        );
      }

      const isSamePassword = await verifyPassword(newPassword, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          { success: false, message: "New password must differ from the current one" },
          { status: 400 }
        );
      }
    }

    user.password = await hashPassword(newPassword);
    user.passwordUpdatedAt = new Date();
    await user.save();

    // Sign out other devices while keeping this session's token intact.
    // Revoking it instead would later look like token reuse and end this
    // session too.
    const currentRefreshToken = request.cookies.get("refreshToken")?.value;
    await revokeOtherUserTokens(user._id, currentRefreshToken);

    // Only a change is worth flagging; a first-time set has nothing to hijack
    if (hasExistingPassword) {
      sendPasswordChangedEmail(user.email);
    }

    return NextResponse.json(
      {
        success: true,
        message: hasExistingPassword
          ? "Password updated successfully"
          : "Password set successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update password" },
      { status: 500 }
    );
  }
}