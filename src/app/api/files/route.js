import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";

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

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    const includeDeleted = searchParams.get("includeDeleted") === "true";

    const files = await FileService.getUserFiles(decoded.userId, {
      folder: folder || null,
      includeDeleted,
    });

    return NextResponse.json(
      {
        success: true,
        files: files.map((file) => ({
          id: file._id,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
          extension: file.extension,
          url: file.url,
          thumbnailUrl: file.thumbnailUrl,
          folder: file.folder,
          isStarred: file.isStarred,
          isDeleted: file.isDeleted,
          deletedAt: file.deletedAt,
          downloadCount: file.downloadCount,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Get files error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get files",
      },
      { status: 500 }
    );
  }
}