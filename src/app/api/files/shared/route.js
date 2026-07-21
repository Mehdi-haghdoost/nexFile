import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";

// GET /api/files/shared?filter=recent|files|folders|links
export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "recent";

    const items = await FileService.getSharedItems(decoded.userId, { filter });

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("❌ Get shared items error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get shared items" },
      { status: 500 }
    );
  }
}