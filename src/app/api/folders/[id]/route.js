import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { FolderService } from "@/utils/folders/folderService";
import { updateFolderSchema } from "@/utils/folders/folderValidator";

// A malformed id cannot match any folder, so it is answered like a missing one
const notFound = () =>
  NextResponse.json(
    { success: false, message: "Folder not found" },
    { status: 404 }
  );

// Resolves the caller and a valid id, or the response explaining why not
const requireOwner = async (request, context) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyAccessToken(token);

  if (!decoded?.userId) {
    return {
      response: NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      ),
    };
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { response: notFound() };

  return { userId: decoded.userId, id };
};

// Returns one folder plus the path from the root, which the breadcrumb needs
export async function GET(request, context) {
  try {
    await connectDB();

    const { userId, id, response } = await requireOwner(request, context);
    if (response) return response;

    const folder = await FolderService.getFolderById(id, userId);
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

// Renames a folder, or changes any other field the update schema allows
export async function PATCH(request, context) {
  try {
    await connectDB();

    const { userId, id, response } = await requireOwner(request, context);
    if (response) return response;

    const body = await request.json().catch(() => ({}));

    let updateData;
    try {
      updateData = updateFolderSchema.parse(body);
    } catch (validationError) {
      const issues = validationError.issues || validationError.errors || [];

      return NextResponse.json(
        {
          success: false,
          message: issues[0]?.message || "Invalid folder details",
        },
        { status: 400 }
      );
    }

    const folder = await FolderService.updateFolder(id, userId, updateData);
    if (!folder) return notFound();

    return NextResponse.json({
      success: true,
      message: "Folder updated",
      folder: {
        id: folder._id.toString(),
        name: folder.name,
        parentFolder: folder.parentFolder ? folder.parentFolder.toString() : null,
        filesCount: folder.filesCount,
        subFoldersCount: folder.subFoldersCount,
        totalSize: folder.totalSize,
        updatedAt: folder.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update folder error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Soft delete by default; ?permanent=true also destroys the subtree and its assets
export async function DELETE(request, context) {
  try {
    await connectDB();

    const { userId, id, response } = await requireOwner(request, context);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get("permanent") === "true";

    const folder = isPermanent
      ? await FolderService.permanentDeleteFolder(id, userId)
      : await FolderService.softDeleteFolder(id, userId);

    return NextResponse.json({
      success: true,
      message: isPermanent ? "Folder permanently deleted" : "Folder moved to trash",
      folder: { id, permanent: isPermanent },
    });
  } catch (error) {
    // The service throws for a missing folder, which is not a server fault
    if (error.message?.includes("not found")) return notFound();

    console.error("Delete folder error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}