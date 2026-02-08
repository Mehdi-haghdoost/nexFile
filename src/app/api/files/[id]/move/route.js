import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import File from "@/models/File";
import Folder from "@/models/Folder";

/**
 * PATCH /api/files/[id]/move
 * Move a file to different folder
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

    console.log('🚚 Move file request:', { id, targetFolderId, userId: decoded.userId });

    // Find source file
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

    const oldFolderId = file.folder;

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
    }

    // Move file
    file.folder = targetFolderId || null;
    await file.save();

    // Update old folder stats
    if (oldFolderId) {
      await Folder.findByIdAndUpdate(oldFolderId, {
        $inc: {
          filesCount: -1,
          totalSize: -file.size,
        },
        lastActivity: new Date(),
      });
    }

    // Update new folder stats
    if (targetFolderId) {
      await Folder.findByIdAndUpdate(targetFolderId, {
        $inc: {
          filesCount: 1,
          totalSize: file.size,
        },
        lastActivity: new Date(),
      });
    }

    console.log('✅ File moved successfully');

    return NextResponse.json(
      {
        success: true,
        message: "File moved successfully",
        file: {
          id: file._id.toString(),
          name: file.name,
          originalName: file.originalName,
          folder: file.folder,
          updatedAt: file.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Move file error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to move file",
      },
      { status: 500 }
    );
  }
}