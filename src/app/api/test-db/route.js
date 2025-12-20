import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    // اتصال به دیتابیس
    const connected = await connectToDB();
    
    if (!connected) {
      return NextResponse.json(
        { 
          success: false, 
          message: "اتصال به دیتابیس برقرار نشد" 
        },
        { status: 500 }
      );
    }

    // تعداد کاربرها رو بگیر
    const usersCount = await User.countDocuments();

    return NextResponse.json({
      success: true,
      message: "اتصال به دیتابیس موفقیت‌آمیز بود",
      database: "nexfile",
      usersCount: usersCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در اتصال به دیتابیس",
        error: error.message,
      },
      { status: 500 }
    );
  }
}