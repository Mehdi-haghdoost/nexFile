import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { forgetPasswordSchema } from "@/utils/auth/validators";
import { sendPasswordResetEmail } from "@/lib/emailService";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email } = body;

    try {
      forgetPasswordSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive a password reset link." },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await PasswordReset.deleteMany({ userId: user._id });

    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expiresAt,
      isUsed: false,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login-register?step=reset&token=${resetToken}`;

    const emailResult = await sendPasswordResetEmail(user.email, resetUrl);

    const response = {
      message: "If an account exists with this email, you will receive a password reset link.",
    };

    if (process.env.NODE_ENV === "development") {
      if (!emailResult.success) {
        console.warn("⚠️ Email sending failed (dev mode):", emailResult.error);
        response.resetUrl = resetUrl;
        console.log("\n" + "=".repeat(80));
        console.log("📧 EMAIL SENDING FAILED - Using fallback link");
        console.log("🔗 PASSWORD RESET LINK:");
        console.log(resetUrl);
        console.log("=".repeat(80) + "\n");
      } else {
        console.log("✅ Email sent successfully to:", user.email);
      }
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}