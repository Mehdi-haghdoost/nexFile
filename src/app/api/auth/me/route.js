import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAccessToken } from "@/utils/auth/tokenManager";

export async function GET() {
  try {
    // اتصال به دیتابیس
    await connectToDB();

    // گرفتن Token از Cookie
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "احراز هویت نشده‌اید" },
        { status: 401 }
      );
    }

    // تایید Token
    const payload = verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    // پیدا کردن کاربر
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // ارسال اطلاعات کاربر
    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return NextResponse.json(
      { message: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}