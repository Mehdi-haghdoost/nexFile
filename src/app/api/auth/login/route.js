// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/mongodb";
// import User from "@/models/User";
// import { verifyPassword } from "@/utils/auth/hashPassword";
// import { generateAccessToken } from "@/utils/auth/tokenManager";
// import { loginSchema } from "@/utils/auth/validators";

// export async function POST(req) {
//   try {
//     // اتصال به دیتابیس
//     await connectToDB();

//     // دریافت داده‌های فرم
//     const body = await req.json();
//     const { email, password } = body;

//     // Validation با Zod
//     try {
//       loginSchema.parse(body);
//     } catch (error) {
//       return NextResponse.json(
//         {
//           message: "اطلاعات وارد شده معتبر نیست",
//           errors: error.errors,
//         },
//         { status: 400 }
//       );
//     }

//     // پیدا کردن کاربر (با select پسورد)
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return NextResponse.json(
//         { message: "ایمیل یا رمز عبور اشتباه است" },
//         { status: 401 }
//       );
//     }

//     // چک کردن پسورد
//     const isPasswordValid = await verifyPassword(password, user.password);

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { message: "ایمیل یا رمز عبور اشتباه است" },
//         { status: 401 }
//       );
//     }

//     // ساخت Access Token
//     const accessToken = generateAccessToken({
//       userId: user._id,
//       email: user.email,
//       role: user.role,
//     });

//     // ارسال پاسخ موفق
//     const response = NextResponse.json(
//       {
//         message: "ورود با موفقیت انجام شد",
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           image: user.image,
//         },
//       },
//       { status: 200 }
//     );

//     // تنظیم Cookie
//     response.cookies.set("token", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24 * 30, // 30 روز
//       path: "/",
//     });

//     return response;

//   } catch (error) {
//     console.error("خطا در ورود:", error);
//     return NextResponse.json(
//       { message: "خطای داخلی سرور" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth/hashPassword";
import { generateAccessToken } from "@/utils/auth/tokenManager";
import { loginSchema } from "@/utils/auth/validators";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email, password } = body;

    // Validation (password  is required here)
    try {
      loginSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // پیدا کردن کاربر
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // بررسی اگر کاربر با Google ثبت‌نام کرده باشد
    if (!user.password) {
      return NextResponse.json(
        { message: "This account uses Google login. Please sign in with Google." },
        { status: 401 }
      );
    }

    // چک password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Token
    const accessToken = generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}