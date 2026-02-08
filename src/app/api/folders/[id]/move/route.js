import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import Folder from "@/models/Folder";

/**
 * PATCH /api/folders/[id]/move
 * Move a folder to different parent folder
 */
export async function PATCH(request, context) {
  try {
    await connectDB();

    // Verify authentication
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

    const params = await context.params;
    const { id } = params;
    
    const body = await request.json();
    const { targetFolderId } = body;

    console.log('🚚 Move folder request:', { id, targetFolderId, userId: decoded.userId });

    // Find source folder
    const folder = await Folder.findOne({
      _id: id,
      owner: decoded.userId,
      isDeleted: false,
    });

    if (!folder) {
      return NextResponse.json(
        { success: false, message: "Folder not found" },
        { status: 404 }
      );
    }

    // Prevent moving into itself
    if (targetFolderId === id) {
      return NextResponse.json(
        { success: false, message: "Cannot move folder into itself" },
        { status: 400 }
      );
    }

    // Validate target folder if provided
    if (targetFolderId) {
      const targetFolder = await Folder.findOne({
        _id: targetFolderId,
        owner: decoded.userId,
        isDeleted: false,
      });

      if (!targetFolder) {
        return NextResponse.json(
          { success: false, message: "Target folder not found" },
          { status: 404 }
        );
      }

      // Prevent moving into its own child
      const isChildFolder = await checkIfChildFolder(targetFolderId, id);
      if (isChildFolder) {
        return NextResponse.json(
          { success: false, message: "Cannot move folder into its own subfolder" },
          { status: 400 }
        );
      }
    }

    const oldParentId = folder.parentFolder;
    const folderSize = folder.totalSize || 0;

    // Move folder
    folder.parentFolder = targetFolderId || null;
    await folder.save();

    // Update old parent stats
    if (oldParentId) {
      await Folder.findByIdAndUpdate(oldParentId, {
        $inc: {
          subFoldersCount: -1,
          totalSize: -folderSize,
        },
        lastActivity: new Date(),
      });
    }

    // Update new parent stats
    if (targetFolderId) {
      await Folder.findByIdAndUpdate(targetFolderId, {
        $inc: {
          subFoldersCount: 1,
          totalSize: folderSize,
        },
        lastActivity: new Date(),
      });
    }

    console.log('✅ Folder moved successfully');

    return NextResponse.json(
      {
        success: true,
        message: "Folder moved successfully",
        folder: {
          id: folder._id.toString(),
          name: folder.name,
          parentFolder: folder.parentFolder,
          updatedAt: folder.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Move folder error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to move folder",
      },
      { status: 500 }
    );
  }
}

/**
 * Check if targetFolder is a child of sourceFolder
 */
async function checkIfChildFolder(targetFolderId, sourceFolderId) {
  let currentFolder = await Folder.findById(targetFolderId);

  while (currentFolder && currentFolder.parentFolder) {
    if (currentFolder.parentFolder.toString() === sourceFolderId) {
      return true; // Target is a child of source
    }
    currentFolder = await Folder.findById(currentFolder.parentFolder);
  }

  return false;
}