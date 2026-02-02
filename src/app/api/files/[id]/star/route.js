import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

/**
 * PATCH /api/files/[id]/star
 * Toggle file star status
 */
export async function PATCH(request, { params }) {
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

    const { id } = await params; // ✅ Next.js 15
    const { isStarred } = await request.json();

    const file = await File.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    file.isStarred = isStarred;
    await file.save();

    return NextResponse.json(
      {
        success: true,
        message: `File ${isStarred ? 'starred' : 'unstarred'} successfully`,
        file: {
          id: file._id.toString(),
          isStarred: file.isStarred,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Star file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update star status",
      },
      { status: 500 }
    );
  }
}