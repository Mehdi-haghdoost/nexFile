import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth/hashPassword";
import { generateAccessToken } from "@/utils/auth/tokenManager";
import { registerSchema } from "@/utils/auth/validators";

export async function POST(req) {
  try {
    // اتصال به دیتابیس
    await connectToDB();

    // دریافت داده‌های فرم
    const body = await req.json();
    const { name, email, password } = body;

    // Validation با Zod
    try {
      registerSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        {
          message: "اطلاعات وارد شده معتبر نیست",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // چک کردن وجود کاربر
    const existingUser = await User.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 422 }
      );
    }

    // Hash کردن پسورد
    const hashedPassword = await hashPassword(password);

    // تعیین نقش کاربر (اولین کاربر Admin میشه)
    const usersCount = await User.countDocuments();
    const userRole = usersCount === 0 ? "admin" : "user";

    // ساخت کاربر جدید
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // ساخت Access Token
    const accessToken = generateAccessToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    // ارسال پاسخ موفق با Set-Cookie
    const response = NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    // تنظیم Cookie
    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 روز
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("خطا در ثبت‌نام:", error);
    return NextResponse.json(
      { message: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}