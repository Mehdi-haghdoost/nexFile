import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { hashPassword } from "@/utils/auth/hashPassword";
import { resetPasswordSchema } from "@/utils/auth/validators";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { token, password, confirmPassword } = body;

    try {
      resetPasswordSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    const passwordReset = await PasswordReset.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!passwordReset) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const user = await User.findById(passwordReset.userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    await user.save();

    passwordReset.isUsed = true;
    await passwordReset.save();

    await PasswordReset.deleteMany({
      userId: user._id,
      _id: { $ne: passwordReset._id },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}