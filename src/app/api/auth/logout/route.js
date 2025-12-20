import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "خروج با موفقیت انجام شد" },
      { status: 200 }
    );

    // پاک کردن Cookie
    response.cookies.delete("token");

    return response;

  } catch (error) {
    console.error("خطا در خروج:", error);
    return NextResponse.json(
      { message: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}