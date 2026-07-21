import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";

// POST /api/files/[id]/share
// body: { users: [{ id, permission }], itemType: 'file' | 'folder' }
export async function POST(request, { params }) {
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

    const { id } = await params;
    const body = await request.json();
    const { users = [], itemType = "file" } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No users provided" },
        { status: 400 }
      );
    }

    const item = await FileService.shareItem(id, decoded.userId, {
      users,
      itemType,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Shared successfully",
        sharedWith: item.sharedWith.map((s) => ({
          user: s.user.toString(),
          permission: s.permission,
          sharedAt: s.sharedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Share item error:", error);
    const status = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to share" },
      { status }
    );
  }
}