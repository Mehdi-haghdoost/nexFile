import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";

/**
 * GET /api/files/suggested
 * Get suggested files based on user's recent activity
 * Returns the most recently updated files (excluding deleted)
 */
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
    const limit = parseInt(searchParams.get("limit")) || 4;

    const files = await File.find({
      owner: decoded.userId,
      isDeleted: false,
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('name originalName extension mimeType size url secureUrl folder updatedAt createdAt')
      .lean();

    const formattedFiles = files.map((file) => ({
      id: file._id.toString(),
      name: file.name,
      originalName: file.originalName,
      extension: file.extension,
      mimeType: file.mimeType,
      size: file.size,
      image: file.secureUrl || file.url || '/images/folder.png',
      folder: file.folder,
      updatedAt: file.updatedAt,
      createdAt: file.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        files: formattedFiles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get suggested files error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch suggested files",
      },
      { status: 500 }
    );
  }
}