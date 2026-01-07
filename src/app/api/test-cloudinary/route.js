import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    // Test cloudinary config
    const result = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: "Cloudinary connection successful",
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 5) + "...",
      },
      result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
      error: error
    }, { status: 500 });
  }
}