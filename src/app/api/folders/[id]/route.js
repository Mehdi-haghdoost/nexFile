import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FolderService } from "@/utils/folders/folderService";

// A malformed id cannot match any folder, so it is answered like a missing one
const notFound = () =>
  NextResponse.json(
    { success: false, message: "Folder not found" },
    { status: 404 }
  );

// Returns one folder plus the path from the root, which the breadcrumb needs
export async function GET(request, context) {
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
    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

    const folder = await FolderService.getFolderById(id, decoded.userId);

    if (!folder || folder.isDeleted) return notFound();

    // Safe to walk up unscoped: a folder can only ever be moved within its owner's own tree
    const path = await FolderService.getFolderPath(id);

    return NextResponse.json({
      success: true,
      folder: {
        id: folder._id.toString(),
        name: folder.name,
        description: folder.description,
        parentFolder: folder.parentFolder ? folder.parentFolder.toString() : null,
        color: folder.color,
        icon: folder.icon,
        accessType: folder.accessType,
        filesCount: folder.filesCount,
        subFoldersCount: folder.subFoldersCount,
        totalSize: folder.totalSize,
        isStarred: folder.isStarred,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      },
      path: path.map((entry) => ({
        id: entry.id.toString(),
        name: entry.name,
      })),
    });
  } catch (error) {
    console.error("Get folder error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}