import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FileService } from "@/utils/files/fileService";
import File from "@/models/File";

// Pickers need every file the account owns, not only the folder being browsed
const getAccountFiles = async (userId, { includeDeleted }) => {
  const query = { owner: userId };

  if (!includeDeleted) {
    query.isDeleted = false;
  }

  return await File.find(query)
    .populate("folder", "name")
    .sort({ createdAt: -1 });
};

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
    const scope = searchParams.get("scope");

    const files = scope === "all"
      ? await getAccountFiles(decoded.userId, { includeDeleted })
      : await FileService.getUserFiles(decoded.userId, {
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
          // The folder is populated only for the account-wide scope, so the id is kept either way
          folder: file.folder?._id || file.folder || null,
          folderName: file.folder?.name || null,
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
    console.error("Get files error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get files",
      },
      { status: 500 }
    );
  }
}