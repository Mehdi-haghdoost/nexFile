import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";

// DELETE /api/files/[id]/permanent
// body: { itemType: 'file' | 'folder' }
export async function DELETE(request, { params }) {
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
    const body = await request.json().catch(() => ({}));
    const { itemType = "file" } = body;

    // Delegate to the matching service method
    if (itemType === "folder") {
      await FileService.permanentDeleteFolder(id, decoded.userId);
    } else {
      await FileService.permanentDeleteFile(id, decoded.userId);
    }

    return NextResponse.json(
      { success: true, message: "Permanently deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Permanent delete error:", error);
    const status = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete" },
      { status }
    );
  }
}